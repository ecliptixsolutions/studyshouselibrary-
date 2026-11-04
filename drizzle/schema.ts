import { boolean, date, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const studentEnquiries = pgTable(
  "student_enquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    mobileNumber: text("mobile_number").notNull(),
    whatsappNumber: text("whatsapp_number"),
    preferredBranch: text("preferred_branch").notNull(),
    membershipType: text("membership_type").notNull(),
    joiningDate: date("joining_date"),
    studyPurpose: text("study_purpose").notNull(),
    preferredTiming: text("preferred_timing").notNull(),
    additionalMessage: text("additional_message"),
    consent: boolean("consent").notNull().default(false),
    enquiryStatus: text("enquiry_status").notNull().default("New"),
  },
  (table) => [index("student_enquiries_mobile_created_at_idx").on(table.mobileNumber, table.createdAt)],
);
