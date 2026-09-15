"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/spinner";
import { ngn } from "@/lib/format";
import { updateSettings } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function SettingsForm({ settings }: { settings: Tables<"site_settings"> }) {
  const router = useRouter();
  const [deliveryFee, setDeliveryFee] = useState(settings.delivery_fee);
  const [threshold, setThreshold] = useState(settings.low_stock_threshold);
  const [teaser, setTeaser] = useState(settings.show_exhibition_teaser);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp_number);
  const [instagram, setInstagram] = useState(settings.instagram_handle);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await updateSettings({
        delivery_fee: deliveryFee,
        low_stock_threshold: threshold,
        show_exhibition_teaser: teaser,
        whatsapp_number: whatsapp,
        instagram_handle: instagram,
      });
      router.refresh();
      setSaved(true);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-7 grid max-w-[920px] grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="grid gap-4.5 rounded-[18px] border border-noir-100 p-6.5">
        <div className="text-sm font-bold text-noir-800">Delivery fee</div>
        <div className="-mt-3 text-[12.5px] text-noir-400">Applied at checkout for Lagos delivery orders.</div>
        <div className="flex items-center gap-4 rounded-xl border border-noir-200 px-[18px] py-3.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDeliveryFee((v) => Math.max(0, v - 500))}
            className="h-auto w-auto p-0 text-lg text-noir-500 hover:bg-transparent"
          >
            −
          </Button>
          <span className="flex-1 text-center text-base font-extrabold">{ngn(deliveryFee)}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDeliveryFee((v) => v + 500)}
            className="h-auto w-auto p-0 text-lg text-noir-500 hover:bg-transparent"
          >
            +
          </Button>
        </div>
      </div>

      <div className="grid gap-4.5 rounded-[18px] border border-noir-100 p-6.5">
        <div className="text-sm font-bold text-noir-800">Low-stock alert threshold</div>
        <div className="-mt-3 text-[12.5px] text-noir-400">
          A product is flagged low-stock at or below this many units; zero units is always out of stock.
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-noir-200 px-[18px] py-3.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setThreshold((v) => Math.max(0, v - 1))}
            className="h-auto w-auto p-0 text-lg text-noir-500 hover:bg-transparent"
          >
            −
          </Button>
          <span className="flex-1 text-center text-base font-extrabold">{threshold} units</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setThreshold((v) => v + 1)}
            className="h-auto w-auto p-0 text-lg text-noir-500 hover:bg-transparent"
          >
            +
          </Button>
        </div>
      </div>

      <div className="grid gap-4.5 rounded-[18px] border border-noir-100 p-6.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-noir-800">Exhibition teaser</div>
            <div className="mt-1 text-[12.5px] text-noir-400">Show the exhibition section on the landing page.</div>
          </div>
          <Switch checked={teaser} onCheckedChange={setTeaser} />
        </div>
        <div className="text-[12.5px] text-noir-600">
          Currently <strong>{teaser ? "shown" : "hidden"}</strong> on the storefront.
        </div>
      </div>

      <div className="grid gap-3.5 rounded-[18px] border border-noir-100 p-6.5">
        <div className="text-sm font-bold text-noir-800">Contact details</div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
            WhatsApp number
          </div>
          <Input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
          />
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
            Instagram handle
          </div>
          <Input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3.5 rounded-[18px] border border-noir-100 p-6.5 sm:col-span-2">
        <Button
          type="button"
          disabled={saving}
          onClick={save}
          className="h-auto rounded-full bg-violet-500 px-[26px] py-3 text-[13.5px] font-bold text-white hover:bg-violet-600"
        >
          {saving && <Spinner size={14} />}
          Save settings
        </Button>
        {saved && <span className="text-[12.5px] font-bold text-status-booked">✓ Saved</span>}
      </div>
    </div>
  );
}
