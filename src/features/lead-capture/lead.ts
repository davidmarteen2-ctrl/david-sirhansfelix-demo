export const experienceOptions = [
  "beginner",
  "intermediate",
  "advanced",
  "funded",
] as const;

export const marketOptions = [
  "forex",
  "indices",
  "gold",
  "crypto",
  "multiple",
] as const;

export const interestOptions = [
  "signals",
  "mentorship",
  "prop-prep",
  "free-content",
] as const;

export const nextStepOptions = [
  "see-pricing",
  "book-call",
  "ask-question",
  "join",
] as const;

export type Experience = (typeof experienceOptions)[number];
export type Market = (typeof marketOptions)[number];
export type Interest = (typeof interestOptions)[number];
export type NextStep = (typeof nextStepOptions)[number];

export interface LeadInput {
  name: string;
  email: string;
  contactHandle: string;
  experience: Experience;
  market: Market;
  interest: Interest;
  problem: string;
  nextStep: NextStep;
  chosenPlan: string;
  website: string;
}

export interface LeadContext {
  submittedAt: string;
  source: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
}

export interface LeadRecord extends Omit<LeadInput, "website">, LeadContext {
  leadId: string;
  leadScore: number;
}

export type LeadValidationResult =
  | { ok: true; data: LeadInput }
  | { ok: false; fieldErrors: Record<string, string> };

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

const isOneOf = <T extends readonly string[]>(
  value: string,
  options: T,
): value is T[number] => options.includes(value as T[number]);

export function validateLead(input: unknown): LeadValidationResult {
  const body = input && typeof input === "object"
    ? input as Record<string, unknown>
    : {};

  const name = normalizeText(body.name);
  const email = normalizeText(body.email).toLowerCase();
  const contactHandle = normalizeText(body.contactHandle);
  const experience = normalizeText(body.experience);
  const market = normalizeText(body.market);
  const interest = normalizeText(body.interest);
  const problem = normalizeText(body.problem);
  const nextStep = normalizeText(body.nextStep);
  const chosenPlan = normalizeText(body.chosenPlan);
  const website = normalizeText(body.website);
  const fieldErrors: Record<string, string> = {};

  if (name.length < 2 || name.length > 80) {
    fieldErrors.name = "Enter your name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (contactHandle.length < 2 || contactHandle.length > 80) {
    fieldErrors.contactHandle = "Enter your WhatsApp number or Telegram handle.";
  }
  if (!isOneOf(experience, experienceOptions)) {
    fieldErrors.experience = "Choose your experience level.";
  }
  if (!isOneOf(market, marketOptions)) {
    fieldErrors.market = "Choose your primary market.";
  }
  if (!isOneOf(interest, interestOptions)) {
    fieldErrors.interest = "Choose what you are interested in.";
  }
  if (problem.length < 12 || problem.length > 600) {
    fieldErrors.problem = "Tell us a little more (at least 12 characters).";
  }
  if (!isOneOf(nextStep, nextStepOptions)) {
    fieldErrors.nextStep = "Choose what you want to do next.";
  }
  if (chosenPlan.length > 60) {
    fieldErrors.chosenPlan = "Choose a valid plan.";
  }
  if (website.length > 200) {
    fieldErrors.website = "Invalid value.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      contactHandle,
      experience: experience as Experience,
      market: market as Market,
      interest: interest as Interest,
      problem,
      nextStep: nextStep as NextStep,
      chosenPlan,
      website,
    },
  };
}

export function scoreLead(lead: LeadInput): number {
  let score = 2;

  if (lead.experience === "intermediate") score += 1;
  if (lead.experience === "advanced" || lead.experience === "funded") score += 2;
  if (["indices", "gold", "multiple"].includes(lead.market)) score += 1;
  if (lead.interest === "signals") score += 1;
  if (lead.interest === "mentorship" || lead.interest === "prop-prep") score += 2;
  if (lead.nextStep === "book-call" || lead.nextStep === "join") score += 3;
  if (lead.nextStep === "see-pricing") score += 1;
  if (lead.chosenPlan) score += 1;

  return Math.min(score, 12);
}

export function buildLeadRecord(lead: LeadInput, context: LeadContext): LeadRecord {
  const timestamp = context.submittedAt
    .replace(/[-:]/g, "")
    .replace("T", "-")
    .slice(0, 15);
  const nameSlug = lead.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32) || "lead";

  return {
    leadId: `hans-${timestamp}-${nameSlug}`,
    ...context,
    leadScore: scoreLead(lead),
    name: lead.name,
    email: lead.email,
    contactHandle: lead.contactHandle,
    experience: lead.experience,
    market: lead.market,
    interest: lead.interest,
    problem: lead.problem,
    nextStep: lead.nextStep,
    chosenPlan: lead.chosenPlan,
  };
}
