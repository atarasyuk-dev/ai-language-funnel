// src/features/funnel/utils/analytics.ts
type EventName =
  | 'step_viewed'
  | 'option_selected'
  | 'email_submitted'
  | 'funnel_completed'
  | 'ab_variant_assigned';

type EventPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: EventName, payload?: EventPayload): void {
  console.log(JSON.stringify({ event: name, ts: new Date().toISOString(), ...payload }));
}
