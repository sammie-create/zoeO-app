"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { updateOrderDeliveryStatus, updateOrderPaymentStatus, deleteOrder } from "../actions";
import type { Database } from "@zoeallure/supabase";

type PaymentStatus = Database["public"]["Tables"]["orders"]["Row"]["payment_status"];
type DeliveryStatus = Database["public"]["Tables"]["orders"]["Row"]["delivery_status"];

const PAYMENT_OPTIONS: { key: PaymentStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
  { key: "cancelled", label: "Cancelled" },
];

const DELIVERY_STEPS: { key: DeliveryStatus; label: string }[] = [
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

const PICKUP_STEPS: { key: DeliveryStatus; label: string }[] = [
  { key: "processing", label: "Processing" },
  { key: "ready_for_pickup", label: "Ready for pickup" },
  { key: "picked_up", label: "Picked up" },
];

export function PaymentStatusPicker({ orderId, current }: { orderId: string; current: PaymentStatus }) {
  const router = useRouter();
  const [pending, setPending] = useState<PaymentStatus | null>(null);

  async function handleSet(status: PaymentStatus) {
    if (status === current) return;
    setPending(status);
    await updateOrderPaymentStatus(orderId, status);
    router.refresh();
    toast.success(`Payment marked ${status}`);
    setPending(null);
  }

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {PAYMENT_OPTIONS.map((opt) => {
        const active = opt.key === current;
        return (
          <Button
            key={opt.key}
            type="button"
            variant="outline"
            disabled={pending !== null}
            onClick={() => handleSet(opt.key)}
            className="h-auto rounded-xl border-noir-100 py-3 text-center text-[12.5px] font-bold"
            style={{
              background: active ? "#F4ECFE" : "#fff",
              color: active ? "#55129B" : "#403B4C",
            }}
          >
            {pending === opt.key ? <Spinner size={14} /> : opt.label}
          </Button>
        );
      })}
    </div>
  );
}

export function DeliveryTracker({
  orderId,
  fulfilmentType,
  current,
}: {
  orderId: string;
  fulfilmentType: "delivery" | "pickup";
  current: DeliveryStatus;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<DeliveryStatus | null>(null);
  const steps = fulfilmentType === "pickup" ? PICKUP_STEPS : DELIVERY_STEPS;
  const currentIndex = steps.findIndex((s) => s.key === current);

  async function handleSet(status: DeliveryStatus) {
    if (status === current) return;
    setPending(status);
    await updateOrderDeliveryStatus(orderId, status);
    router.refresh();
    toast.success("Delivery status updated");
    setPending(null);
  }

  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step.key} className="relative flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div className="h-0.5 flex-1" style={{ background: i === 0 ? "transparent" : done ? "#7F23E0" : "#EDEBF1" }} />
              <button
                type="button"
                onClick={() => handleSet(step.key)}
                disabled={pending !== null}
                className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border-2 text-xs font-extrabold"
                style={{
                  background: done ? "#7F23E0" : "#fff",
                  color: done ? "#fff" : "#B4AFC0",
                  borderColor: done ? "#7F23E0" : "#D8D5E0",
                }}
              >
                {pending === step.key ? <Spinner size={12} /> : i + 1}
              </button>
              <div
                className="h-0.5 flex-1"
                style={{ background: i === steps.length - 1 ? "transparent" : i < currentIndex ? "#7F23E0" : "#EDEBF1" }}
              />
            </div>
            <span
              className="mt-2.5 max-w-[90px] text-[11.5px] font-bold"
              style={{ color: done ? "#1A1720" : "#B4AFC0" }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function DeleteOrderButton({ orderId, orderRef }: { orderId: string; orderRef: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-auto rounded-xl border-[#F2C3D2] py-3.5 text-center text-[13px] font-bold text-status-cancelled hover:bg-[#FDEEF0]"
      >
        Delete order
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete order?"
        description={`Order ${orderRef} will be permanently removed. This cannot be undone.`}
        onConfirm={async () => {
          await deleteOrder(orderId);
          toast.success("Order deleted");
          router.push("/orders");
          router.refresh();
        }}
      />
    </>
  );
}
