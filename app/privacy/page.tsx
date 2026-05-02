import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-zinc-950 dark:text-zinc-50 selection:bg-indigo-500/30">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mb-6">At LearnX, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform.</p>
          
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-6">We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, mailing address, phone number, credit card information.</p>
          
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-8 mb-4">2. How We Use Collected Information</h2>
          <p className="mb-6">LearnX may collect and use Users personal information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>To improve customer service: Information you provide helps us respond to your customer service requests and support needs more efficiently.</li>
            <li>To personalize user experience: We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.</li>
            <li>To process payments: We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.</li>
            <li>To send periodic emails: We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests.</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-8 mb-4">3. Contacting Us</h2>
          <p className="mb-6">If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at privacy@learnx.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
