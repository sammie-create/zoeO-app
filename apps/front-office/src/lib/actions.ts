"use server";

import { createClient } from "@zoeallure/supabase/server";
import { sendPlunkEmail, upsertPlunkContact } from "@/lib/plunk";
import { contactTopics } from "@/lib/contact-topics";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export type CartLine = { id: string; qty: number };

export async function placeOrder(input: {
  name: string;
  phone: string;
  email: string | null;
  fulfilmentType: "delivery" | "pickup";
  fulfilmentDetail: string | null;
  address: string | null;
  items: CartLine[];
  paymentProofUrl: string | null;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_guest_order", {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email,
    p_fulfilment_type: input.fulfilmentType,
    p_fulfilment_detail: input.fulfilmentDetail,
    p_address: input.address,
    p_items: input.items.map((i) => ({ product_id: i.id, quantity: i.qty })),
    p_payment_proof_url: input.paymentProofUrl,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  newsletter: boolean;
}) {
  if (input.name.trim().length < 2) throw new Error("Name is required");
  if (!/\S+@\S+\.\S+/.test(input.email)) throw new Error("A valid email is required");
  if (input.message.trim().length < 10) throw new Error("Message is too short");

  const topicLabel = contactTopics.find((t) => t.value === input.topic)?.label ?? "General enquiry";

  const notifyEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!notifyEmail) throw new Error("CONTACT_NOTIFICATION_EMAIL is not set");

  const fromEmail = process.env.PLUNK_FROM_EMAIL;
  if (!fromEmail) throw new Error("PLUNK_FROM_EMAIL is not set");

  await sendPlunkEmail({
    to: notifyEmail,
    from: fromEmail,
    subject: `New contact message: ${topicLabel}`,
    body: `
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(input.phone) || "—"}</p>
      <p><strong>Topic:</strong> ${escapeHtml(topicLabel)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>
    `,
    reply: input.email,
  });

  if (input.newsletter) {
    await upsertPlunkContact({ email: input.email, subscribed: true, data: { name: input.name } });
  }
}

export async function placeBooking(input: {
  name: string;
  phone: string;
  email: string | null;
  serviceId: string;
  scheduledAt: string;
  locationType: "studio" | "home_service";
  locationDetail: string | null;
  notes: string | null;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_guest_booking", {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email,
    p_service_id: input.serviceId,
    p_scheduled_at: input.scheduledAt,
    p_location_type: input.locationType,
    p_location_detail: input.locationDetail,
    p_notes: input.notes,
  });
  if (error) throw new Error(error.message);
  return data;
}
