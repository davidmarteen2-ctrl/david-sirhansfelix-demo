import * as React from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LeadApplicationProps {
  preferredPlan?: string;
}

interface SubmissionState {
  kind: "idle" | "submitting" | "success" | "error";
  message: string;
  leadId?: string;
}

// Matches Hans's design tokens: light canvas, border, surface
const inputClass =
  "min-h-12 w-full rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-primary)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[#111] focus:ring-2 focus:ring-[#111]/8 disabled:cursor-not-allowed disabled:opacity-60";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm font-medium text-[var(--color-negative)]" role="alert">
      {message}
    </p>
  );
}

const EASE_ENTER: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function LeadApplication({ preferredPlan = "" }: LeadApplicationProps) {
  const [selectedPlan, setSelectedPlan] = React.useState(preferredPlan);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [submission, setSubmission] = React.useState<SubmissionState>({
    kind: "idle",
    message: "",
  });

  React.useEffect(() => {
    setSelectedPlan(preferredPlan);
  }, [preferredPlan]);

  const clearError = (field: string) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    setSubmission({ kind: "submitting", message: "Sending your application..." });
    setFieldErrors({});

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          pageUrl: window.location.href,
          referrer: document.referrer,
        }),
      });
      const result = await response.json().catch(() => ({
        ok: false,
        error: "We could not read the server response. Please try again.",
      }));

      if (!response.ok || !result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setSubmission({
          kind: "error",
          message: result.error ?? "We could not send your application. Please try again.",
        });
        return;
      }

      form.reset();
      setSelectedPlan("");
      setSubmission({
        kind: "success",
        message:
          "Application received. Hans reviews every application personally — you'll hear back shortly.",
        leadId: result.leadId,
      });
    } catch {
      setSubmission({
        kind: "error",
        message: "The connection dropped. Check your internet and try again.",
      });
    }
  };

  const isSubmitting = submission.kind === "submitting";

  return (
    <section id="apply" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 bg-[var(--color-canvas)]">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">

        {/* Left — Sticky copy panel */}
        <div className="self-start lg:sticky lg:top-28">
          <p className="mb-5 text-sm font-semibold text-[var(--color-secondary)] uppercase tracking-widest">
            Apply for access
          </p>
          <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-[var(--color-primary)] sm:text-5xl">
            Tell us where your trading gets stuck.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--color-secondary)] sm:text-lg">
            Hans uses your answers to recommend the right next step — signals, mentorship, or a short call. No broker login or payment required.
          </p>

          <div className="mt-10 space-y-5 border-l-2 border-[var(--color-border)] pl-6">
            <div>
              <p className="font-semibold text-[var(--color-primary)]">Hans reviews your answers personally</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">
                Your market, experience, and goal decide what happens next.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-primary)]">One clear recommendation</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">
                That may be a plan, a short call, or free guidance if you are not ready.
              </p>
            </div>
            <div className="flex items-start gap-3 pt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-[var(--color-secondary)]"
                strokeWidth={1.8}
              />
              <p>Trading involves risk. This application does not provide financial advice or guarantee results.</p>
            </div>
          </div>
        </div>

        {/* Right — Form card */}
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            {submission.kind === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE_ENTER }}
                className="flex min-h-[560px] flex-col justify-center"
                role="status"
                aria-live="polite"
              >
                <div className="flex size-12 items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-primary)]">
                  <Check aria-hidden="true" className="size-6" strokeWidth={2} />
                </div>
                <h3 className="mt-7 text-3xl font-semibold tracking-tight text-[var(--color-primary)]">
                  Check your inbox.
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-[var(--color-secondary)]">
                  {submission.message}
                </p>
                {submission.leadId && submission.leadId !== "accepted" && (
                  <p className="mt-5 font-mono text-xs text-[var(--color-muted)]">
                    Reference: {submission.leadId}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setSubmission({ kind: "idle", message: "" })}
                  className="mt-10 w-fit text-sm font-semibold text-[var(--color-primary)] underline decoration-[var(--color-border)] underline-offset-4 hover:decoration-[var(--color-secondary)] transition-colors"
                >
                  Submit another application
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Honeypot — hidden from humans, traps bots */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {/* Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-[var(--color-primary)]">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={80}
                      placeholder="Your full name"
                      className={inputClass}
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                      onChange={() => clearError("name")}
                    />
                    <FieldError id="name-error" message={fieldErrors.name} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-[var(--color-primary)]">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      placeholder="you@email.com"
                      className={inputClass}
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                      onChange={() => clearError("email")}
                    />
                    <FieldError id="email-error" message={fieldErrors.email} />
                  </div>
                </div>

                {/* Contact handle */}
                <div className="space-y-2">
                  <label htmlFor="contactHandle" className="text-sm font-medium text-[var(--color-primary)]">
                    WhatsApp number or Telegram handle
                  </label>
                  <input
                    id="contactHandle"
                    name="contactHandle"
                    type="text"
                    autoComplete="tel"
                    required
                    maxLength={80}
                    placeholder="+234... or @yourhandle"
                    className={inputClass}
                    aria-invalid={Boolean(fieldErrors.contactHandle)}
                    aria-describedby={fieldErrors.contactHandle ? "contact-error" : "contact-help"}
                    onChange={() => clearError("contactHandle")}
                  />
                  <p id="contact-help" className="text-xs text-[var(--color-muted)]">
                    Use the contact method you check most often.
                  </p>
                  <FieldError id="contact-error" message={fieldErrors.contactHandle} />
                </div>

                {/* Experience + Market */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="experience" className="text-sm font-medium text-[var(--color-primary)]">
                      Trading experience
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      required
                      defaultValue=""
                      className={inputClass}
                      aria-invalid={Boolean(fieldErrors.experience)}
                      aria-describedby={fieldErrors.experience ? "experience-error" : undefined}
                      onChange={() => clearError("experience")}
                    >
                      <option value="" disabled>Select experience</option>
                      <option value="beginner">Under 1 year</option>
                      <option value="intermediate">1–3 years</option>
                      <option value="advanced">3+ years</option>
                      <option value="funded">Funded or professional</option>
                    </select>
                    <FieldError id="experience-error" message={fieldErrors.experience} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="market" className="text-sm font-medium text-[var(--color-primary)]">
                      Primary market
                    </label>
                    <select
                      id="market"
                      name="market"
                      required
                      defaultValue=""
                      className={inputClass}
                      aria-invalid={Boolean(fieldErrors.market)}
                      aria-describedby={fieldErrors.market ? "market-error" : undefined}
                      onChange={() => clearError("market")}
                    >
                      <option value="" disabled>Select market</option>
                      <option value="forex">Forex pairs</option>
                      <option value="indices">Indices</option>
                      <option value="gold">Gold</option>
                      <option value="crypto">Crypto</option>
                      <option value="multiple">Several markets</option>
                    </select>
                    <FieldError id="market-error" message={fieldErrors.market} />
                  </div>
                </div>

                {/* Interest + Plan */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="interest" className="text-sm font-medium text-[var(--color-primary)]">
                      What are you looking for?
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      required
                      defaultValue=""
                      className={inputClass}
                      aria-invalid={Boolean(fieldErrors.interest)}
                      aria-describedby={fieldErrors.interest ? "interest-error" : undefined}
                      onChange={() => clearError("interest")}
                    >
                      <option value="" disabled>Select one</option>
                      <option value="signals">Trading signals</option>
                      <option value="mentorship">Mentorship</option>
                      <option value="prop-prep">Prop firm preparation</option>
                      <option value="free-content">Free guidance first</option>
                    </select>
                    <FieldError id="interest-error" message={fieldErrors.interest} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="chosenPlan" className="text-sm font-medium text-[var(--color-primary)]">
                      Plan in mind
                    </label>
                    <select
                      id="chosenPlan"
                      name="chosenPlan"
                      value={selectedPlan}
                      className={inputClass}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                    >
                      <option value="">Not sure yet</option>
                      <option value="Signals">Signals</option>
                      <option value="Mentorship">Mentorship</option>
                      <option value="Prop Prep">Prop Prep</option>
                    </select>
                  </div>
                </div>

                {/* Problem textarea */}
                <div className="space-y-2">
                  <label htmlFor="problem" className="text-sm font-medium text-[var(--color-primary)]">
                    What is your biggest trading problem right now?
                  </label>
                  <textarea
                    id="problem"
                    name="problem"
                    required
                    minLength={12}
                    maxLength={600}
                    rows={4}
                    placeholder="Tell us what keeps happening and what you want to improve."
                    className={`${inputClass} resize-y`}
                    aria-invalid={Boolean(fieldErrors.problem)}
                    aria-describedby={fieldErrors.problem ? "problem-error" : undefined}
                    onChange={() => clearError("problem")}
                  />
                  <FieldError id="problem-error" message={fieldErrors.problem} />
                </div>

                {/* Next step radio group */}
                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-[var(--color-primary)]">
                    What would you like to do next?
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["see-pricing", "See the best plan"],
                        ["book-call", "Book a short call"],
                        ["ask-question", "Ask a question"],
                        ["join", "Join if it fits"],
                      ] as const
                    ).map(([value, label], index) => (
                      <label
                        key={value}
                        className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-secondary)] transition hover:border-[#111]/30 has-[:checked]:border-[#111] has-[:checked]:bg-[#111]/4 has-[:checked]:text-[var(--color-primary)]"
                      >
                        <input
                          type="radio"
                          name="nextStep"
                          value={value}
                          required
                          defaultChecked={index === 0}
                          className="size-4 accent-[#111]"
                          onChange={() => clearError("nextStep")}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  <FieldError id="next-step-error" message={fieldErrors.nextStep} />
                </fieldset>

                {/* Error banner */}
                {submission.kind === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[var(--radius-control)] border border-[var(--color-negative)]/30 bg-[var(--color-negative)]/6 px-4 py-3 text-sm leading-relaxed text-[var(--color-negative)]"
                    role="alert"
                  >
                    {submission.message}
                  </motion.div>
                )}

                {/* Submit row */}
                <div className="border-t border-[var(--color-border)] pt-6">
                  <button
                    id="apply-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a1a1a] hover:-translate-y-px active:translate-y-0 disabled:cursor-wait disabled:bg-[var(--color-muted)] sm:w-auto"
                  >
                    {isSubmitting ? "Sending application…" : "Send application"}
                    {!isSubmitting && <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />}
                  </button>
                  <p className="mt-4 max-w-xl text-xs leading-relaxed text-[var(--color-muted)]">
                    By submitting, you agree to be contacted about Hans Felix's services. Never send broker passwords, seed phrases, or account credentials.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
