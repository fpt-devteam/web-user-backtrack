import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
console.log('Stripe Public Key:', stripePublicKey);
if (!stripePublicKey) {
  console.error('Stripe public key is not defined in environment variables');
  throw new Error('Stripe public key is not defined in environment variables');
}
const stripePromise = loadStripe(stripePublicKey);

export function StripeProvider({ children }: { children: React.ReactNode }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
