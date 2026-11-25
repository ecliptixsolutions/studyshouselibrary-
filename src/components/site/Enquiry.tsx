import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { submitEnquiry, enquiryInputSchema, type EnquiryInput } from "@/lib/enquiry";
import { BRANCHES, MEMBERSHIP_TYPES, STUDY_PURPOSES, STUDY_TIMINGS } from "@/lib/site-data";
import { Reveal } from "./Reveal";

const EMPTY: EnquiryInput = {
  fullName: "",
  email: "",
  mobileNumber: "",
  whatsappNumber: "",
  preferredBranch: "",
  membershipType: "" as EnquiryInput["membershipType"],
  joiningDate: "",
  studyPurpose: "" as EnquiryInput["studyPurpose"],
  preferredTiming: "" as EnquiryInput["preferredTiming"],
  additionalMessage: "",
  consent: false as unknown as true,
  website: "",
};

export function Enquiry() {
  const [values, setValues] = useState<EnquiryInput>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryInput, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [whatsappShare, setWhatsappShare] = useState<string | null>(null);

  useEffect(() => {
    const branch = new URLSearchParams(window.location.search).get("branch");
    if (branch && BRANCHES.some((item) => item.name === branch)) {
      setValues((current) => ({ ...current, preferredBranch: branch }));
    }
    return () => setValues(EMPTY);
  }, []);

  function set<K extends keyof EnquiryInput>(key: K, value: EnquiryInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = enquiryInputSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof EnquiryInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof EnquiryInput | undefined;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitEnquiry({ data: parsed.data });
      if (result.duplicate) {
        toast.info("We already received an enquiry from this number in the last 24 hours. Our team will reach out to you soon.");
      } else {
        toast.success("Thank you! Your enquiry has been received — our team will contact you shortly.");
      }
      // Optional, student-initiated WhatsApp handoff with their submitted details.
      const waMessage = [
        "Hello Study House Library!",
        "",
        "I am interested in joining your library.",
        "",
        `Name: ${parsed.data.fullName}`,
        `Preferred Branch: ${parsed.data.preferredBranch}`,
        `Membership: ${parsed.data.membershipType}`,
        `Study Purpose: ${parsed.data.studyPurpose}`,
        "",
        "Please share more information about the membership.",
      ].join("\n");
      setWhatsappShare(`https://wa.me/919426282245?text=${encodeURIComponent(waMessage)}`);
      setValues(EMPTY);
      setErrors({});
      setReference(result.reference ?? null);
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const err = (key: keyof EnquiryInput) =>
    errors[key] ? (
      <p className="mt-1.5 text-xs font-medium text-destructive">{errors[key]}</p>
    ) : null;

  return (
    <section id="enquiry" className="relative overflow-hidden bg-brand-deep py-20 sm:py-28">
      <div className="absolute top-14 left-1/2 hidden h-px w-56 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent lg:block" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.32em] text-brand-gold uppercase">
                <span className="h-px w-10 bg-brand-gold/70" aria-hidden />
                Admission / Enquiry
              </p>
            </Reveal>
            <Reveal delayMs={80}>
              <h2 className="font-display mt-4 text-3xl font-semibold text-brand-ivory sm:text-4xl">
                Your Journey <em className="text-brand-gold not-italic">Starts Here.</em>
              </h2>
            </Reveal>
            <Reveal delayMs={160}>
              <p className="mt-6 leading-relaxed text-brand-parchment/85">
                Take the first step towards a more focused and productive study routine. Join Study
                House Library and give your goals the environment they deserve.
              </p>
              <p className="mt-5 text-sm text-brand-parchment/70">
                Prefer to chat? WhatsApp us at{" "}
                <a
                  href="https://wa.me/919426282245"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-4 transition-colors hover:text-brand-ivory"
                >
                  +91 94262 82245
                </a>
                .
              </p>
            </Reveal>
          </div>

          <Reveal delayMs={120} className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              noValidate
              className="relative rounded-2xl border border-brand-gold/40 bg-brand p-6 shadow-[0_28px_64px_rgba(11,11,32,0.45)] sm:p-8"
            >
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" aria-hidden />

              {/* Honeypot — hidden from humans, catches bots */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="label-form">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    className="field-input"
                    autoComplete="name"
                    value={values.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="Your full name"
                  />
                  {err("fullName")}
                </div>
                <div>
                  <label htmlFor="email" className="label-form">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="field-input"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                  {err("email")}
                </div>
                <div>
                  <label htmlFor="mobileNumber" className="label-form">
                    Mobile Number *
                  </label>
                  <input
                    id="mobileNumber"
                    type="tel"
                    inputMode="numeric"
                    className="field-input"
                    autoComplete="tel"
                    value={values.mobileNumber}
                    onChange={(e) => set("mobileNumber", e.target.value)}
                    placeholder="10-digit mobile number"
                  />
                  {err("mobileNumber")}
                </div>
                <div>
                  <label htmlFor="whatsappNumber" className="label-form">
                    WhatsApp Number{" "}
                    <span className="font-normal text-muted-foreground">(if different)</span>
                  </label>
                  <input
                    id="whatsappNumber"
                    type="tel"
                    inputMode="numeric"
                    className="field-input"
                    value={values.whatsappNumber}
                    onChange={(e) => set("whatsappNumber", e.target.value)}
                    placeholder="Optional"
                  />
                  {err("whatsappNumber")}
                </div>
                <div>
                  <label htmlFor="preferredBranch" className="label-form">
                    Preferred Branch *
                  </label>
                  <select
                    id="preferredBranch"
                    className="field-input"
                    value={values.preferredBranch}
                    onChange={(e) => set("preferredBranch", e.target.value)}
                  >
                    <option value="">Select a branch</option>
                    {BRANCHES.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  {err("preferredBranch")}
                </div>
                <div>
                  <label htmlFor="membershipType" className="label-form">
                    Membership Type *
                  </label>
                  <select
                    id="membershipType"
                    className="field-input"
                    value={values.membershipType}
                    onChange={(e) =>
                      set("membershipType", e.target.value as EnquiryInput["membershipType"])
                    }
                  >
                    <option value="">Select membership type</option>
                    {MEMBERSHIP_TYPES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  {err("membershipType")}
                </div>
                <div>
                  <label htmlFor="joiningDate" className="label-form">
                    Preferred Joining Date
                  </label>
                  <input
                    id="joiningDate"
                    type="date"
                    className="field-input"
                    value={values.joiningDate}
                    onChange={(e) => set("joiningDate", e.target.value)}
                  />
                  {err("joiningDate")}
                </div>
                <div>
                  <label htmlFor="studyPurpose" className="label-form">
                    Study Purpose *
                  </label>
                  <select
                    id="studyPurpose"
                    className="field-input"
                    value={values.studyPurpose}
                    onChange={(e) =>
                      set("studyPurpose", e.target.value as EnquiryInput["studyPurpose"])
                    }
                  >
                    <option value="">Select your purpose</option>
                    {STUDY_PURPOSES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {err("studyPurpose")}
                </div>
                <div className="sm:col-span-2">
                  <span className="label-form">Preferred Timing *</span>
                  <div className="flex flex-wrap gap-2">
                    {STUDY_TIMINGS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set("preferredTiming", t as EnquiryInput["preferredTiming"])}
                        aria-pressed={values.preferredTiming === t}
                        className={
                          values.preferredTiming === t
                            ? "rounded-full border border-brand-gold bg-brand-gold px-4 py-2 text-sm font-medium text-brand-deep"
                            : "rounded-full border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-gold/60"
                        }
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {err("preferredTiming")}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="additionalMessage" className="label-form">
                    Anything Else?
                  </label>
                  <textarea
                    id="additionalMessage"
                    rows={3}
                    className="field-input resize-y"
                    value={values.additionalMessage}
                    onChange={(e) => set("additionalMessage", e.target.value)}
                    placeholder="Any questions or special requirements (optional)"
                  />
                  {err("additionalMessage")}
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 accent-[var(--brand-gold)]"
                      checked={values.consent === true}
                      onChange={(e) => set("consent", e.target.checked as unknown as true)}
                    />
                    I agree to be contacted about my enquiry.
                  </label>
                  {err("consent")}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-deep shadow-[0_10px_26px_rgba(217,168,62,0.4)] transition-all hover:bg-brand-gold-muted disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden />
                    Submit My Enquiry
                  </>
                )}
              </button>

              {done && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="text-sm font-medium text-primary">
                    Your enquiry is in. If you need anything else, WhatsApp us at +91 94262 82245.
                  </p>
                  {reference && <p className="text-sm text-brand-gold">Reference: {reference}</p>}
                  {whatsappShare && (
                    <a
                      href={whatsappShare}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-whatsapp/60 px-4 py-2 text-sm font-semibold text-whatsapp transition-colors hover:bg-whatsapp/10"
                      aria-label="Share your enquiry details with Study House Library on WhatsApp"
                    >
                      <svg
                        className="size-4"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94.2-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.8 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                      </svg>
                      Send details on WhatsApp
                    </a>
                  )}
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
