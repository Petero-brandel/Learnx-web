import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Bluedemy',
  description: 'Whether you want to master a single skill or unlock our entire library, we have a pricing plan that fits your goals. Start your journey with Bluedemy today.',
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
