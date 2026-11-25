CREATE DATABASE IF NOT EXISTS study_house_library CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE study_house_library;

CREATE TABLE IF NOT EXISTS branches (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  contact_number VARCHAR(20) NULL,
  starting_membership_price DECIMAL(10,2) NULL,
  google_maps_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO branches (name, address, contact_number, starting_membership_price, google_maps_url) VALUES
('Gotri', '4th & 5th Floor, Aerium Complex, Shree Shrof Nagar Society, Harinagar Cross Road, Gotri Rd, above Patanjali store, Vadodara, Gujarat 390007', NULL, NULL, 'https://www.google.com/maps/search/?api=1&query=Study+House+Library+Gotri'),
('Nizampura', 'Aditviya Complex (Passport Office Complex), 311, Delux Char Rasta, Nizampura Char Rasta, Bhakti Nagar, Pensionpura, Nizampura, Vadodara, Gujarat 390002', NULL, NULL, 'https://www.google.com/maps/search/?api=1&query=Study+House+Library+Nizampura'),
('Fatehgunj', '4th Floor, Silver Bell Complex, Abbas Tyabji Rd, above CCD, opp. Word office-3, Jayesh Colony, Fatehgunj, Vadodara, Gujarat 390008', NULL, NULL, 'https://www.google.com/maps/search/?api=1&query=Study+House+Library+Fatehgunj'),
('Waghodia Road', '4th Floor, Study House Library, Sharam Complex G Tower, Waghodia Rd, opposite Savita Hospital Road, Pariwar Char Rasta, Vadodara, Gujarat.', '+919426282245', 999.00, 'https://www.google.com/maps/search/?api=1&query=Study+House+Library+Sharam+Complex+G+Tower+Waghodia+Road+Pariwar+Char+Rasta+Vadodara')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS enquiries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  enquiry_code VARCHAR(32) NOT NULL UNIQUE,
  branch_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  whatsapp_number VARCHAR(15) NULL,
  email VARCHAR(255) NOT NULL,
  enquiry_type VARCHAR(50) NOT NULL DEFAULT 'General',
  membership_plan VARCHAR(100) NULL,
  preferred_timing VARCHAR(50) NULL,
  preferred_joining_date DATE NULL,
  student_category VARCHAR(100) NULL,
  study_purpose VARCHAR(100) NULL,
  customer_message TEXT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'Website',
  status ENUM('New','Pending','Converted','Closed') NOT NULL DEFAULT 'New',
  follow_up_date DATE NULL,
  management_remarks TEXT NULL,
  consent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_enquiries_branch FOREIGN KEY (branch_id) REFERENCES branches(id),
  INDEX idx_enquiries_mobile_created (mobile_number, created_at),
  INDEX idx_enquiries_branch_status (branch_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admission_code VARCHAR(32) NOT NULL UNIQUE,
  enquiry_id BIGINT UNSIGNED NULL,
  branch_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  email VARCHAR(255) NULL,
  preferred_joining_date DATE NULL,
  membership_preference VARCHAR(100) NULL,
  status ENUM('New','Pending','Approved','Rejected') NOT NULL DEFAULT 'New',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_admissions_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries(id),
  CONSTRAINT fk_admissions_branch FOREIGN KEY (branch_id) REFERENCES branches(id),
  INDEX idx_admissions_branch_status (branch_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS memberships (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  membership_code VARCHAR(32) NOT NULL UNIQUE,
  enquiry_id BIGINT UNSIGNED NULL,
  branch_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  plan VARCHAR(100) NOT NULL,
  preferred_timing VARCHAR(50) NULL,
  applicable_price DECIMAL(10,2) NULL,
  status ENUM('New','Pending','Active','Closed') NOT NULL DEFAULT 'New',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_memberships_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries(id),
  CONSTRAINT fk_memberships_branch FOREIGN KEY (branch_id) REFERENCES branches(id),
  INDEX idx_memberships_branch_status (branch_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS follow_ups (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  enquiry_id BIGINT UNSIGNED NOT NULL,
  follow_up_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  management_remarks TEXT NULL,
  communication_history TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_follow_ups_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries(id),
  INDEX idx_follow_ups_date_status (follow_up_date, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS excel_sync_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  status ENUM('Success','Failed','Retrying') NOT NULL,
  exported_at TIMESTAMP NULL,
  record_count INT UNSIGNED NOT NULL DEFAULT 0,
  failure_details TEXT NULL,
  retry_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS excel_sync_outbox (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('enquiry','admission','membership') NOT NULL,
  entity_id BIGINT UNSIGNED NOT NULL,
  status ENUM('Pending','Retrying','Completed') NOT NULL DEFAULT 'Pending',
  retry_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
  last_error VARCHAR(2000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  UNIQUE KEY uq_excel_sync_outbox_entity (entity_type, entity_id),
  INDEX idx_excel_sync_outbox_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS api_error_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  endpoint VARCHAR(200) NOT NULL,
  http_status SMALLINT UNSIGNED NOT NULL,
  database_error_code VARCHAR(50) NULL,
  request_id CHAR(36) NOT NULL,
  error_summary VARCHAR(2000) NOT NULL,
  INDEX idx_api_error_logs_occurred_at (occurred_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
