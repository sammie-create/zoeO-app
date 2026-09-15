"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MessagePanel({ name, phone }: { name: string; phone: string }) {
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [draft, setDraft] = useState(`Hi ${name}, `);

  return (
    <div className="mt-5 rounded-[20px] border border-noir-100 p-7">
      <div className="text-[15px] font-bold text-noir-800">Send a message</div>
      <div className="mt-1 text-[12.5px] text-noir-400">
        Reach {name} directly at {phone}.
      </div>
      <div className="mt-4 flex gap-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={() => setChannel("whatsapp")}
          className="h-auto rounded-full px-5 py-2.5 text-[12.5px] font-bold"
          style={{
            background: channel === "whatsapp" ? "#F4ECFE" : "#fff",
            borderColor: channel === "whatsapp" ? "#CFB1FB" : "#D8D5E0",
            color: channel === "whatsapp" ? "#55129B" : "#403B4C",
          }}
        >
          WhatsApp
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setChannel("sms")}
          className="h-auto rounded-full px-5 py-2.5 text-[12.5px] font-bold"
          style={{
            background: channel === "sms" ? "#F4ECFE" : "#fff",
            borderColor: channel === "sms" ? "#CFB1FB" : "#D8D5E0",
            color: channel === "sms" ? "#55129B" : "#403B4C",
          }}
        >
          SMS
        </Button>
      </div>
      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={4}
        className="mt-3.5 w-full rounded-xl border-noir-200 bg-noir-50 px-3.5 py-3 text-[13.5px] leading-relaxed focus-visible:border-violet-500 focus-visible:ring-violet-100"
      />
      <Button
        type="button"
        onClick={() =>
          toast.info(`${channel === "whatsapp" ? "WhatsApp" : "SMS"} sending isn't connected yet`, {
            description: "This is a draft composer only — hook up a WhatsApp/SMS provider to actually send.",
          })
        }
        className="mt-4 h-auto rounded-full bg-violet-500 px-7 py-3.5 text-[13.5px] font-bold text-white hover:bg-violet-600"
      >
        Send via {channel === "whatsapp" ? "WhatsApp" : "SMS"}
      </Button>
    </div>
  );
}
