export type FunnelQuestionType =
  | 'single-select'
  | 'multi-select'
  | 'slider'
  | 'email'
  | 'result-preview';

export type FunnelOption = {
  id: string;
  label: string;
  emoji?: string;
  description?: string;
};

export type FunnelAnswers = {
  goal?: string;
  level?: string;
  motivation?: string;
  painPoint?: string;
  timeline?: string;
  learningStyle?: string;
  dailyCommitment?: string;
  confidence?: number;
  planPreference?: string;
  email?: string;
};

export type FunnelQuestion = {
  id: keyof FunnelAnswers;
  step: number;
  type: FunnelQuestionType;
  title: string | ((answers: FunnelAnswers) => string);
  subtitle?: string | ((answers: FunnelAnswers) => string);
  options?: FunnelOption[];
  required?: boolean;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
};

export type FunnelDirection = 'forward' | 'backward';

export type FunnelState = {
  currentStep: number;
  answers: FunnelAnswers;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  direction: FunnelDirection;
};

export type SubmitPayload = {
  answers: FunnelAnswers;
  timestamp: string;
};

export type TelegramMessage = {
  text: string;
  parse_mode: 'HTML';
};
