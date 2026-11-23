import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number into Sri Lankan Rupees (LKR)
 * e.g., 1250 => "LKR 1,250"
 */
export function formatLKR(amount: number): string {
  return `LKR ${Number(amount || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Generates the WhatsApp order message and encoded link strictly according to requirement:
 *
 * Hello Nandana Super Shop!
 *
 * I would like to place an order.
 *
 * Order Details:
 * 1. Plastic Storage Basket
 *    Price: LKR 1,250
 *    Quantity: 2
 *    Total: LKR 2,500
 *
 * 2. Kitchen Container Set
 *    Price: LKR 2,850
 *    Quantity: 1
 *    Total: LKR 2,850
 *
 * ---
 * Total Items: 3
 * Grand Total: LKR 5,350
 *
 * Please confirm my order and delivery details.
 */
export function generateWhatsAppOrderUrl(
  items: CartItem[],
  whatsappNumber: string = "94778704807"
): string {
  if (items.length === 0) return `https://wa.me/${whatsappNumber}`;

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemLines = items
    .map((item, index) => {
      const itemTotal = item.product.price * item.quantity;
      return `${index + 1}. ${item.product.name}
   Price: ${formatLKR(item.product.price)}
   Quantity: ${item.quantity}
   Total: ${formatLKR(itemTotal)}`;
    })
    .join("\n\n");

  const message = `Hello Nandana Super Shop!

I would like to place an order.

Order Details:
${itemLines}

---
Total Items: ${totalItems}
Grand Total: ${formatLKR(grandTotal)}

Please confirm my order and delivery details.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates formatted WhatsApp inquiry message for contact form
 */
export function generateWhatsAppInquiryUrl(
  data: {
    fullName: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
  },
  whatsappNumber: string = "94778704807"
): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  const msg = `Hello Nandana Super Shop!

New Website Inquiry:

Name: ${data.fullName}
Phone: ${data.phone}
${data.email ? `Email: ${data.email}\n` : ""}Subject: ${data.subject}

Message:
${data.message}

Please get back to me. Thank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
}
