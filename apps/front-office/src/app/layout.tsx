import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteChrome } from "@/components/chrome/site-chrome";
import { getProducts, getServices } from "@/lib/queries";
import { AppProviders } from "@/lib/store/app-providers";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ZoeO Allure",
  description: "Beauty, made easier. All in one place.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [products, services] = await Promise.all([getProducts(), getServices()]);

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", playfairDisplay.variable, manrope.variable, "font-sans")}
      suppressHydrationWarning
    >
      <head>
        <script
          // Runs before hydration to set the theme attribute from storage,
          // so there's no flash of the wrong theme on load.
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("za_theme");if(t==="light")document.documentElement.dataset.theme="light"}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <AppProviders>
          <SiteChrome products={products} services={services}>
            {children}
          </SiteChrome>
        </AppProviders>
      </body>
    </html>
  );
}
