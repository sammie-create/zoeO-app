import { PolicyLayout } from "@/components/policies/policy-layout";

export const metadata = { title: "Returns, Exchanges & Refunds — ZoeO Allure" };

const toc = [
  { href: "#returns-exchanges-refunds-policy", label: "Returns, Exchanges & Refunds Policy" },
  { href: "#defective-or-incorrect-products-policy", label: "Defective or Incorrect Products Policy" },
];

export default function ReturnsPolicyPage() {
  return (
    <PolicyLayout
      active="returns-policy"
      title="Returns, Exchanges & Refunds"
      lead="How to report an issue, what can be returned or exchanged, and when refunds apply."
      toc={toc}
    >
      <section className="policy-sec" id="returns-exchanges-refunds-policy">
        <h2>Returns, Exchanges &amp; Refunds Policy</h2>
        <h3>Inspection Upon Delivery</h3>
        <p>Customers are encouraged to inspect their order as soon as it is received.</p>
        <p>If an item appears damaged, incorrect, defective, or materially different from what was ordered, please contact ZoeO Allure promptly with clear photographs and/or videos showing the issue.</p>
        <p>Do not alter, cut, colour, bleach, install, wash, chemically process, restyle, or otherwise modify an item before contacting us about a suspected product issue. Modification of the product may affect our ability to properly assess the issue.</p>
        <h3>Returns &amp; Exchanges</h3>
        <p>We accept eligible returns where the product qualifies for return under our policy and applicable Nigerian consumer protection laws.</p>
        <p>To be eligible for a return, the product should generally be:</p>
        <ul>
          <li>Unused</li>
          <li>Unworn</li>
          <li>Unaltered</li>
          <li>In its original condition</li>
          <li>Returned with its original packaging and accessories, where applicable</li>
        </ul>
        <h3>Return Conditions for Hair Products</h3>
        <p>Hair products that have been worn, installed, cut, coloured, bleached, washed, chemically processed, restyled, or otherwise altered may not be eligible for return unless the issue is a verified defect covered by warranty or applicable consumer protection law.</p>
        <p>Because certain products are customised or made to order, they may have different return conditions.</p>
        <h3>Refund Policy</h3>
        <p>Refunds may be considered where:</p>
        <ul>
          <li>The wrong product was supplied by ZoeO Allure.</li>
          <li>The product has a verified manufacturing or workmanship defect.</li>
          <li>The product materially fails to correspond with its agreed description or specifications.</li>
          <li>A refund is otherwise required under applicable law.</li>
          <li>ZoeO Allure is unable to fulfil an accepted order.</li>
        </ul>
        <h3>Approved Refunds</h3>
        <p>Where a return is approved, the customer may be offered a replacement, repair, correction, exchange, or refund depending on the nature of the issue and applicable law.</p>
        <p>Refunds will generally be made through the original payment method where reasonably possible.</p>
        <p>Refund processing times may vary depending on the customer&rsquo;s bank or payment provider.</p>
        <h3>Change of Mind</h3>
        <p>Cancellation or return of an order simply because a customer has changed their mind may not be available once production has commenced, particularly for customised or made-to-order products.</p>
        <p>Where cancellation is requested before production begins, ZoeO Allure will review the request and advise the customer of the available options.</p>
        <p>Any applicable cancellation charges will be communicated before the cancellation is processed.</p>
        <p>Nothing in this policy removes any mandatory consumer rights provided by applicable law.</p>
      </section>

      <section className="policy-sec" id="defective-or-incorrect-products-policy">
        <h2>Defective or Incorrect Products Policy</h2>
        <h3>Reporting an Issue</h3>
        <p>If you believe your product is defective or does not correspond with what you ordered, please contact ZoeO Allure as soon as possible.</p>
        <p>We may request:</p>
        <ul>
          <li>Your order number</li>
          <li>Photographs</li>
          <li>Videos</li>
          <li>A description of the issue</li>
          <li>Other information reasonably required to assess the complaint</li>
        </ul>
        <h3>Resolution</h3>
        <p>Once the issue has been reviewed, we will communicate the appropriate resolution.</p>
        <p>Where a product is confirmed to be defective, ZoeO Allure will provide the remedy required by applicable law and/or the remedy stated in the applicable warranty.</p>
      </section>
    </PolicyLayout>
  );
}
