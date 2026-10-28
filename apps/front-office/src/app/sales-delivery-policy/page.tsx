import { PolicyLayout } from "@/components/policies/policy-layout";

export const metadata = { title: "Sales & Delivery Policy — ZoeO Allure" };

const toc = [
  { href: "#sales-product-policy", label: "Sales & Product Policy" },
  { href: "#production-delivery-shipping-policy", label: "Production, Delivery & Shipping Policy" },
];

export default function SalesDeliveryPolicyPage() {
  return (
    <PolicyLayout
      active="sales-delivery-policy"
      title="Sales & Delivery"
      lead="Product information, made-to-order items, production times and delivery."
      toc={toc}
    >
      <section className="policy-sec" id="sales-product-policy">
        <h2>Sales &amp; Product Policy</h2>
        <h3>Products &amp; Product Information</h3>
        <p>We make every effort to ensure that product descriptions, photographs, colours, lengths, densities, textures, and other product information displayed on our website are accurate.</p>
        <p>However, slight variations may occur due to lighting, photography, screen settings, manufacturing processes, and the natural characteristics of human hair.</p>
        <p>Where a product is made to order, the final product will be produced according to the specifications selected or agreed upon at the time of purchase.</p>
        <p>Customers are encouraged to review all product details carefully before placing an order and to contact us if clarification is required.</p>
        <h3>Made-to-Order &amp; Custom Products</h3>
        <p>Some ZoeO Allure products are made specifically for the customer after an order has been placed.</p>
        <p>Because these products are customised or made to order, customers should carefully confirm all specifications before payment.</p>
        <ul>
          <li>Colour</li>
          <li>Length</li>
          <li>Density</li>
          <li>Closure or lace type</li>
          <li>Size</li>
          <li>Styling</li>
          <li>Other custom specifications</li>
        </ul>
        <h3>Product Colour &amp; Appearance</h3>
        <p>Colours displayed on a website may appear slightly different depending on the customer&rsquo;s device, screen brightness, lighting, and settings.</p>
        <p>For products involving natural or human hair, slight differences in texture, movement, density, or appearance may occur. These natural variations do not automatically constitute a defect.</p>
      </section>

      <section className="policy-sec" id="production-delivery-shipping-policy">
        <h2>Production, Delivery &amp; Shipping Policy</h2>
        <h3>Production Time</h3>
        <p>Production timelines vary depending on the product ordered.</p>
        <p>The estimated production period stated on the individual product page begins after payment has been confirmed and all required order details have been received.</p>
        <p>Production times are expressed in working days and do not include weekends or public holidays.</p>
        <p>For example, a product with a stated production time of 3&ndash;10 working days may be completed at any point within that period.</p>
        <p>Some customised or highly detailed products may require additional time. Where there is an unexpected production delay, customers will be notified as soon as reasonably possible.</p>
        <h3>Shipping &amp; Delivery</h3>
        <p>Production time and delivery time are separate.</p>
        <p>Once an order has completed production, it will be prepared for dispatch or handed over to the selected delivery service.</p>
        <p>Delivery timelines depend on the destination, courier service, weather, public holidays, and other circumstances outside ZoeO Allure&rsquo;s direct control.</p>
        <p>Customers are responsible for providing a complete and accurate delivery address and a reachable telephone number.</p>
        <p>If a package cannot be delivered because of an incorrect address, unavailable recipient, refusal to receive the package, or failure to respond to the courier, additional delivery charges may apply.</p>
        <p>Risk associated with delivery will be handled in accordance with applicable law and the circumstances of the transaction.</p>
        <h3>Cancellation by ZoeO Allure</h3>
        <p>In exceptional circumstances, ZoeO Allure may need to cancel an order where, for example, a product is unavailable, an unavoidable production issue prevents fulfilment, or there is a material error affecting the order.</p>
        <p>Where ZoeO Allure cancels an order and payment has already been received, the customer will be notified and an appropriate remedy, including a refund where applicable, will be provided.</p>
      </section>
    </PolicyLayout>
  );
}
