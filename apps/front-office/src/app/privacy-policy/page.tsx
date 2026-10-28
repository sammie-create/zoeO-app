import { PolicyLayout } from "@/components/policies/policy-layout";

export const metadata = { title: "Privacy Policy — ZoeO Allure" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      active="privacy-policy"
      title="Privacy"
      lead="How we use the information you share with us when you order or book."
    >
      <section className="policy-sec" id="privacy-customer-information">
        <h2>Privacy &amp; Customer Information</h2>
        <h3>Privacy</h3>
        <p>Customer information provided during an order will be handled in accordance with ZoeO Allure&rsquo;s Privacy Policy and applicable data protection requirements.</p>
        <p>We may use information supplied by customers for purposes including order processing, payment confirmation, delivery, customer support, and other legitimate business purposes.</p>
      </section>
    </PolicyLayout>
  );
}
