import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database, Share2, Cookie } from "lucide-react";

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <div className="container py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg mb-8">
            <p className="text-muted-foreground m-0">
              Your privacy is critically important to us. This Privacy Policy explains how Electrify collects, uses, protects, and shares your personal information when you use our e-commerce platform.
            </p>
          </div>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold m-0">1. Information We Collect</h2>
            </div>
            
            <h3 className="text-xl font-semibold mt-4 mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, date of birth</li>
              <li><strong>Billing Information:</strong> Billing address, payment method details (encrypted)</li>
              <li><strong>Shipping Information:</strong> Delivery addresses, contact information</li>
              <li><strong>Profile Data:</strong> Profile pictures, preferences, saved items</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-3">Transaction Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Order history and purchase details</li>
              <li>Payment transaction records</li>
              <li>Return and refund information</li>
              <li>Customer support interactions</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-3">Technical Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>IP address and device identifiers</li>
              <li>Browser type and version</li>
              <li>Operating system information</li>
              <li>Cookies and usage data</li>
              <li>Log files and analytics data</li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold m-0">2. How We Use Your Information</h2>
            </div>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Order Processing:</strong> To process and fulfill your orders</li>
              <li><strong>Account Management:</strong> To create and manage your account</li>
              <li><strong>Customer Service:</strong> To respond to inquiries and provide support</li>
              <li><strong>Payment Processing:</strong> To process payments securely</li>
              <li><strong>Marketing:</strong> To send promotional materials (with your consent)</li>
              <li><strong>Platform Improvement:</strong> To analyze usage and improve our services</li>
              <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent activities</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold m-0">3. Information Sharing</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-3">Service Providers</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Payment Processors:</strong> Stripe, PayPal, M-Pesa, and other payment providers</li>
              <li><strong>Shipping Partners:</strong> Courier and logistics companies</li>
              <li><strong>Analytics Services:</strong> Google Analytics for usage analysis</li>
              <li><strong>Email Services:</strong> Mailchimp for email communications</li>
              <li><strong>Cloud Services:</strong> Supabase for data storage and authentication</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-3">Legal Requirements</h3>
            <p className="text-muted-foreground">
              We may disclose your information if required by law, court order, or government request, or to protect our rights and prevent fraud.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold m-0">4. Data Security</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              We implement robust security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Encrypted storage for sensitive information</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure payment processing through PCI-DSS compliant providers</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Cookie className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold m-0">5. Cookies and Tracking</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Keep you logged in securely</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Personalize content and advertisements</li>
              <li>Improve site performance and user experience</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control cookies through your browser settings. See our Cookie Policy for more details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-3">GDPR Rights (EU Users)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Right to Access:</strong> Request copies of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate information</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Right to Object:</strong> Object to certain data processing activities</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-3">CCPA Rights (California Users)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Know what personal information is collected</li>
              <li>Know whether personal information is sold or disclosed</li>
              <li>Say no to the sale of personal information</li>
              <li>Access your personal information</li>
              <li>Request deletion of personal information</li>
              <li>Equal service and price, even if you exercise privacy rights</li>
            </ul>

            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us at privacy@electrify.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Generally:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Account data: Until account deletion or inactivity (5 years)</li>
              <li>Transaction records: 7 years for legal and tax compliance</li>
              <li>Marketing data: Until consent is withdrawn</li>
              <li>Analytics data: Aggregated and anonymized after 2 years</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses and adequacy decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or prominent notice on our website. Your continued use of our services after such modifications constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8 p-6 bg-muted rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                <strong>Email:</strong> <a href="mailto:privacy@electrify.com" className="text-primary hover:underline">privacy@electrify.com</a>
              </p>
              <p className="text-muted-foreground">
                <strong>Data Protection Officer:</strong> <a href="mailto:dpo@electrify.com" className="text-primary hover:underline">dpo@electrify.com</a>
              </p>
              <p className="text-muted-foreground">
                <strong>Support:</strong> <a href="mailto:support@electrify.com" className="text-primary hover:underline">support@electrify.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;