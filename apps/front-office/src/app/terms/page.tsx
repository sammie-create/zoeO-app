import { PolicyLayout } from "@/components/policies/policy-layout";

export const metadata = { title: "Terms & Conditions — ZoeO Allure" };

const toc = [
  { href: "#terms-conditions", label: "Terms & Conditions" },
  { href: "#payment-policy", label: "Payment Policy" },
  { href: "#customer-responsibilities", label: "Customer Responsibilities" },
  { href: "#complaints-customer-support-liability", label: "Complaints, Customer Support & Liability" },
  { href: "#contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <PolicyLayout
      active="terms"
      title="Terms & Conditions"
      lead="By placing an order, making a payment, or using any of our services, you agree to the terms and policies outlined below."
      toc={toc}
    >
      <section className="policy-sec" id="terms-conditions">
        <h2>Terms &amp; Conditions</h2>
        <h3>Welcome to ZoeO Allure</h3>
        <p>By placing an order, making a payment, or using any of our services, you agree to the terms and policies outlined below.</p>
        <p>Our goal is to provide quality products, clear communication, and a smooth shopping experience. Please read these terms carefully before completing your purchase.</p>
        <h3>Orders &amp; Confirmation</h3>
        <p>An order is considered confirmed once payment has been successfully received and the order has been acknowledged by ZoeO Allure.</p>
        <p>Customers are responsible for ensuring that all information supplied during checkout is accurate:</p>
        <ul>
          <li>Full name</li>
          <li>Phone number</li>
          <li>Email address</li>
          <li>Delivery address</li>
          <li>Product specifications</li>
          <li>Colour, length, size, or other customisation details where applicable</li>
        </ul>
        <h3>Acceptance of Terms</h3>
        <p>By placing an order with ZoeO Allure, you confirm that you have read and understood these Terms &amp; Conditions and agree to be bound by them, subject to any rights and protections provided by applicable law.</p>
        <p>These terms may be updated from time to time. The version applicable to an order will generally be the version in effect when the order is placed, unless otherwise required by law.</p>
      </section>

      <section className="policy-sec" id="payment-policy">
        <h2>Payment Policy</h2>
        <h3>Payment</h3>
        <p>Full payment is required before production begins unless an alternative payment arrangement has been expressly approved by ZoeO Allure.</p>
        <p>Payment is only considered confirmed when the payment has been successfully received and verified.</p>
        <p>Customers should not send payment to personal accounts or payment channels that have not been officially provided by ZoeO Allure.</p>
        <p>Where a payment is made through a third-party payment platform, any applicable processing charges will be subject to that platform&rsquo;s terms.</p>
        <h3>Pricing, Promotions &amp; Discounts</h3>
        <p>Promotional offers, discounts, giveaways, and special sales may have specific terms attached to them. Where a promotion has separate conditions, those conditions will be communicated as part of the promotion.</p>
        <p>Promotional prices and offers may be available only for a specified period or while stock lasts.</p>
        <p>ZoeO Allure reserves the right to correct obvious pricing or listing errors and to communicate the appropriate resolution to affected customers.</p>
      </section>

      <section className="policy-sec" id="customer-responsibilities">
        <h2>Customer Responsibilities</h2>
        <p>Customers are responsible for:</p>
        <ul>
          <li>Providing accurate order and delivery information.</li>
          <li>Reviewing product specifications before purchasing.</li>
          <li>Making payments through authorised payment channels.</li>
          <li>Being available to receive deliveries or communicating with the courier.</li>
          <li>Following recommended product care instructions.</li>
          <li>Reporting genuine product issues promptly.</li>
          <li>Providing accurate information when making a complaint or requesting a return.</li>
        </ul>
      </section>

      <section className="policy-sec" id="complaints-customer-support-liability">
        <h2>Complaints, Customer Support &amp; Liability</h2>
        <h3>Complaints &amp; Customer Support</h3>
        <p>We value our customers and encourage you to contact us directly if you experience an issue with your order.</p>
        <p>When contacting us about an order, please provide your order number and a clear description of the issue.</p>
        <p>We will review complaints fairly and communicate the next steps.</p>
        <p>Nothing in these terms prevents a consumer from exercising any rights or remedies available under applicable Nigerian law.</p>
        <h3>Limitation of Liability</h3>
        <p>ZoeO Allure will not be responsible for loss or damage arising solely from circumstances outside our reasonable control, including certain courier delays, natural disasters, government restrictions, network or payment-provider failures, or other unforeseeable events.</p>
        <p>However, nothing in these terms is intended to exclude, restrict, or waive any liability or consumer right that cannot legally be excluded under Nigerian law.</p>
      </section>

      <section className="policy-sec" id="contact">
        <h2>Contact</h2>
        <h3>Customer Support</h3>
        <p>For questions, complaints, returns, warranty claims, or other enquiries, please contact ZoeO Allure through the official customer service channels provided on our website.</p>
        <p>
          Customer Service: <a href="tel:+2348052579324">+234 805 257 9324</a>
        </p>
      </section>
    </PolicyLayout>
  );
}
