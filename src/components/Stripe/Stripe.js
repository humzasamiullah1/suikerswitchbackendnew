import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Replace with your **publishable key** from Stripe dashboard
// const PUBLIC_KEY =
//   "pk_test_51NfVkoAdN8nseiVbFQG16E8QRBvJxD2ZMHPcdpYEmVOAeOkiYYk8yeVIqXk8M3jjlXCiB34jiPSI9ZTKLi76n5VW00sSVl4Phs";

const PUBLIC_KEY =
  "pk_live_51NuiZqIj51f14n3KOT6wvEIloNGCe0viaw4BJ04W0A5OL5ug7Eci1SrcCSzhp32uSdW182os6epQhJPlcriX6Dnb00qIYAtHVP";

const stripePromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
