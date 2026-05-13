export type CareerAnswers = {
  q1?: string;   // goal: meetings | interviews | emails | presentations
  q2?: string;   // sub-context (branches on q1)
  q3?: string;   // blocker: freeze | translate | pronunciation | vocabulary
  q4?: number;   // frequency 1–5
  q6?: number;   // daily time in minutes (5–30)
  q7?: string;   // past attempts
  q8?: number;   // confidence 1–5
  q9?: string;   // deadline: 4w | 8w | 12w | open
  q10?: string;  // email
};

export type CareerSubmitPayload = {
  answers: CareerAnswers;
  timestamp: string;
};
