import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MEMBERSHIP_TYPES, STUDY_PURPOSES, STUDY_TIMINGS } from "./site-data";

const MOBILE_RE = /^(?:\+?91)?[6-9]\d{9}$/;

export const enquiryInputSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email is too long."),
  mobileNumber: z
    .string()
    .trim()
    .regex(MOBILE_RE, "Please enter a valid 10-digit Indian mobile number."),
  whatsappNumber: z
    .string()
    .trim()
    .max(15)
    .optional()
    .or(z.literal("")),
  preferredBranch: z.string().trim().min(1, "Please choose a branch."),
  membershipType: z.enum(MEMBERSHIP_TYPES, {
    message: "Please choose a membership type.",
  }),
  joiningDate: z.string().optional(),
  studyPurpose: z.enum(STUDY_PURPOSES, {
    message: "Please choose your study purpose.",
  }),
  preferredTiming: z.enum(STUDY_TIMINGS, {
    message: "Please choose a preferred timing.",
  }),
  additionalMessage: z.string().trim().max(2000, "Message is too long.").optional(),
  consent: z.literal(true, {
    message: "Please agree to be contacted about your enquiry.",
  }),
  // Honeypot: bots fill this, humans never see it.
  website: z.string().max(0, "").optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquiryInputSchema>;

// In-memory rate limiter (per server instance): max 5 submissions per IP per hour.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, { count: number; reset: number }>();

function normalizeMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = enquiryInputSchema.safeParse(input);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      throw new Error(issue?.message ?? "Please check the highlighted fields.");
    }
    return parsed.data;
  })
  .handler(async ({ data }) => {
    if (data.website) {
      // Honeypot filled: silently accept to avoid tipping off bots.
      return { ok: true as const, duplicate: false as const };
    }

    // Rate limit by caller IP.
    let ip = "unknown";
    try {
      const { getRequestHeader } = await import("@tanstack/react-start/server");
      ip =
        getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
        getRequestHeader("x-real-ip") ||
        "unknown";
    } catch {
      // No request context available (rare); fall through to shared limit.
    }
    const now = Date.now();
    const entry = hits.get(ip);
    if (entry && now < entry.reset) {
      if (entry.count >= RATE_LIMIT) {
        throw new Error(
          "Too many enquiries from this connection. Please try again in a little while."
        );
      }
      entry.count += 1;
    } else {
      hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const mobile = normalizeMobile(data.mobileNumber);
    const whatsapp =
      data.whatsappNumber && data.whatsappNumber.trim()
        ? normalizeMobile(data.whatsappNumber)
        : null;

    // Duplicate guard: same mobile within the last 24 hours.
    const since = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabaseAdmin
      .from("student_enquiries")
      .select("id")
      .eq("mobile_number", mobile)
      .gte("created_at", since)
      .limit(1);

    if (existing && existing.length > 0) {
      return { ok: true as const, duplicate: true as const };
    }

    const { error } = await supabaseAdmin.from("student_enquiries").insert({
      full_name: data.fullName,
      email: data.email,
      mobile_number: mobile,
      whatsapp_number: whatsapp,
      preferred_branch: data.preferredBranch,
      membership_type: data.membershipType,
      joining_date: data.joiningDate ? data.joiningDate : null,
      study_purpose: data.studyPurpose,
      preferred_timing: data.preferredTiming,
      additional_message: data.additionalMessage ? data.additionalMessage : null,
      consent: true,
      enquiry_status: "New",
    });

    if (error) {
      console.error("Enquiry insert failed:", error.message);
      throw new Error(
        "We couldn't submit your enquiry right now. Please try again in a moment."
      );
    }

    return { ok: true as const, duplicate: false as const };
  });
