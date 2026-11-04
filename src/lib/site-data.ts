// Verified business data for Study House Library. Do not invent entries —
// every address below was provided by the owner. See mem://business facts.

export const LIBRARY = {
  name: "Study House Library",
  tagline: "Your Study • Our Priority",
  whatsappDisplay: "+91 94262 82245",
  whatsappLink:
    "https://wa.me/919426282245?text=Hello%20Study%20House%20Library%2C%20I%20would%20like%20to%20know%20more%20about%20membership",
  hours: "Open daily, 7:30 AM – 11 PM",
  hoursNote: "Hours may differ on public holidays.",
  city: "Vadodara, Gujarat",
} as const;

export interface Branch {
  name: string;
  area: string;
  address: string;
  mapsUrl: string;
}

const branchInput = [
  {
    name: "Gotri",
    area: "Gotri Road",
    address:
      "4th & 5th Floor, Aerium Complex, Shree Shrof Nagar Society, Harinagar Cross Road, Gotri Rd, above Patanjali store, Vadodara, Gujarat 390007",
  },
  {
    name: "Nizampura",
    area: "Nizampura Char Rasta",
    address:
      "Aditviya Complex (Passport Office Complex), 311, Delux Char Rasta, Nizampura Char Rasta, Bhakti Nagar, Pensionpura, Nizampura, Vadodara, Gujarat 390002",
  },
  {
    name: "Fatehgunj",
    area: "Fatehgunj",
    address:
      "4th Floor, Silver Bell Complex, Abbas Tyabji Rd, above CCD, opp. Word office-3, Jayesh Colony, Fatehgunj, Vadodara, Gujarat 390008",
  },
] as const;

export const BRANCHES: Branch[] = branchInput.map((b) => ({
  ...b,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}`,
}));

export const MEMBERSHIP_TYPES = [
  "Full Day",
  "Half Day",
  "Monthly Membership",
  "Other / Need Guidance",
] as const;

export const STUDY_PURPOSES = [
  "UPSC",
  "GPSC",
  "GATE",
  "CAT",
  "CA",
  "SSC",
  "College / University Studies",
  "Other",
] as const;

export const STUDY_TIMINGS = ["Morning", "Afternoon", "Evening", "Flexible"] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About Us", href: "/#about" },
  { label: "Facilities", href: "/#facilities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Why Choose Us", href: "/#why-us" },
  { label: "Locations", href: "/#locations" },
  { label: "Admission / Enquiry", href: "/#enquiry" },
] as const;
