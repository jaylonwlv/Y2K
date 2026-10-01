/**
 * Y2K Home Plus plans. Prices are placeholders until purchases are wired up; then they come from
 * the App Store, already localised. Product ids must match App Store Connect.
 */
export type Plan = {
  id: 'yearly' | 'weekly' | 'lifetime';
  productId: string;
  title: string;
  price: string;
  period?: 'year' | 'week';
  trialDays?: number;
  /** Small print under the plan's name. */
  detail: string;
};

export const PLANS: Plan[] = [
  {
    id: 'yearly',
    productId: 'plus_yearly',
    title: 'Yearly',
    price: '$29.99',
    period: 'year',
    trialDays: 3,
    detail: '3 days free · just $0.58 a week',
  },
  { id: 'weekly', productId: 'plus_weekly', title: 'Weekly', price: '$4.99', period: 'week', detail: 'Billed weekly' },
  { id: 'lifetime', productId: 'plus_lifetime', title: 'Lifetime', price: '$49.99', detail: 'Pay once, keep forever' },
];

/** What happens after tapping the button, shown right above it. */
export function renewalTerms(plan: Plan) {
  if (!plan.period) return `${plan.price} once. No subscription.`;
  const then = plan.trialDays ? `${plan.trialDays} days free, then ` : '';
  return `${then}${plan.price}/${plan.period}, renews automatically. Cancel anytime in Settings.`;
}

export function buttonLabel(plan: Plan) {
  if (plan.trialDays) return 'Start my free trial';
  return plan.period ? `Subscribe for ${plan.price}/${plan.period}` : `Unlock for ${plan.price}`;
}

export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
