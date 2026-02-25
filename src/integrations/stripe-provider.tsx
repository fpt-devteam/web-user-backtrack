import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripePublishableKey) {
  throw new Error('Stripe publishable key is not defined in environment variables');
}

export const stripePromise = loadStripe(stripePublishableKey);

export function StripeProvider({ children }: { children: React.ReactNode }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
