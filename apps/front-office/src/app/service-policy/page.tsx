import { PolicyLayout } from "@/components/policies/policy-layout";

export const metadata = { title: "Service Policy — ZoeO Allure" };

export default function ServicePolicyPage() {
  return (
    <PolicyLayout
      active="service-policy"
      title="Service Policy"
      lead="Our standards for appointments and beauty services, and what we ask of you."
    >
      <section className="policy-sec" id="service-policy">
        <h2>Service Policy</h2>
        <h3>Service Standards</h3>
        <p>ZoeO Allure is committed to providing professional services, quality workmanship, clear communication, and a smooth customer experience.</p>
        <p>Service requirements, appointment details, preparation requirements, pricing, timelines, and any service-specific conditions will be communicated through the applicable service listing, booking information, invoice, or customer communication.</p>
        <h3>Customer Responsibilities</h3>
        <p>Customers are responsible for providing accurate information, arriving or being available as agreed, following reasonable preparation or aftercare instructions, and communicating relevant changes promptly.</p>
        <h3>Service Changes &amp; Cancellations</h3>
        <p>Where a service appointment or arrangement needs to be changed or cancelled, customers should contact ZoeO Allure as early as possible. Availability of rescheduling, cancellation, or refund options may depend on the nature and timing of the request and any service-specific terms.</p>
        <h3>Service Quality &amp; Complaints</h3>
        <p>If a customer believes a service was not completed as agreed, they should contact ZoeO Allure promptly with details of the concern. We will review the matter fairly and communicate the appropriate next steps.</p>
      </section>
    </PolicyLayout>
  );
}
