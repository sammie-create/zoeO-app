import type { ProductCategory } from "@zoeallure/supabase";

export const categoryLabels: Record<ProductCategory, string> = {
  hair: "Hair Care",
  personal: "Personal Care",
  nails: "Nail Care",
  wigs: "Extensions",
};

export const careCopy: Record<ProductCategory, [string, string][]> = {
  hair: [
    ["Application", "Apply on wet hair. Massage gently for 2 min."],
    ["Rinsing", "Rinse thoroughly with lukewarm water."],
    ["Storage", "Keep in a cool dry space, out of direct sun."],
  ],
  personal: [
    ["Application", "Apply to clean, dry skin as needed."],
    ["Wear", "Reapply through the day for a fresh finish."],
    ["Storage", "Store capped at room temperature."],
  ],
  nails: [
    ["Prep", "Push back cuticles and buff the nail surface."],
    ["Apply", "Press firmly for 30 seconds per nail."],
    ["Removal", "Soak in warm soapy water, then lift gently."],
  ],
  wigs: [
    ["Wash", "Wash every 7–10 wears with sulphate-free shampoo."],
    ["Style", "Use a heat shield below 180°C."],
    ["Storage", "Store on a stand or in a silk bag."],
  ],
};
