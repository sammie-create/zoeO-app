import { PolicyLayout } from "@/components/policies/policy-layout";

export const metadata = { title: "Warranty & Hair Care Policy — ZoeO Allure" };

const toc = [
  { href: "#hair-care-maintenance-policy", label: "Hair Care & Maintenance Policy" },
  { href: "#warranty-policy", label: "Warranty Policy" },
];

export default function WarrantyPolicyPage() {
  return (
    <PolicyLayout
      active="warranty-policy"
      title="Warranty & Hair Care"
      lead="Caring for your hair and wig products, and what our warranty covers."
      toc={toc}
    >
      <section className="policy-sec" id="hair-care-maintenance-policy">
        <h2>Hair Care &amp; Maintenance Policy</h2>
        <h3>Care &amp; Maintenance</h3>
        <p>Human hair and wig products require appropriate care and maintenance.</p>
        <p>The lifespan, appearance, texture, bounce, curl pattern, lace, and overall condition of a wig can be affected by how it is worn, stored, washed, styled, coloured, chemically processed, and maintained.</p>
        <p>Customers are expected to follow the recommended care instructions provided for their product.</p>
        <p>Certain styles, particularly layered, curled, braided, or heavily styled wigs, may require periodic professional or appropriate styling to maintain their original appearance.</p>
        <p>Normal wear and tear, improper maintenance, excessive heat, chemical processing, incorrect storage, or alterations carried out after purchase may not be covered by warranty.</p>
      </section>

      <section className="policy-sec" id="warranty-policy">
        <h2>Warranty Policy</h2>
        <h3>Warranty Coverage</h3>
        <p>ZoeO Allure stands behind the quality and workmanship of our products.</p>
        <p>Where a product is covered by a specific warranty, the warranty period and conditions will be stated on the relevant product page, invoice, or order confirmation.</p>
        <p>The warranty covers qualifying manufacturing or workmanship issues that arise under normal and intended use.</p>
        <h3>Warranty Exclusions</h3>
        <p>Unless otherwise stated, warranty coverage does not include:</p>
        <ul>
          <li>Normal wear and tear</li>
          <li>Damage caused by improper care</li>
          <li>Excessive heat or heat damage</li>
          <li>Chemical damage</li>
          <li>Unauthorised alterations</li>
          <li>Cutting or resizing</li>
          <li>Colouring or bleaching</li>
          <li>Improper installation</li>
          <li>Damage caused by third-party stylists</li>
          <li>Damage caused by misuse, accidents, or neglect</li>
        </ul>
        <h3>Legal Rights</h3>
        <p>A warranty does not prevent or limit any rights that cannot legally be excluded under applicable consumer protection law.</p>
      </section>
    </PolicyLayout>
  );
}
