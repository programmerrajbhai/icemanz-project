import path from 'path';
import fs from 'fs';

export interface OrderEmailItem {
  title?: string;
  name?: string;
  brand?: string;
  image?: string;
  images?: string[];
  quantity?: number;
  price?: number | string;
  category?: string;
  sku?: string;
}

export interface OrderEmailParams {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  amountPaid: number;
  currency?: string;
  deliveryMethod?: string | null;
  shippingName?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingZip?: string | null;
  shippingCountry?: string | null;
  deliveryCost?: number | null;
  tax?: number | null;
  subtotal?: number | null;
  products?: OrderEmailItem[];
  invoiceDetails?: {
    projectName?: string;
    description?: string;
    deliveryTime?: string;
    deliveryNotes?: string;
  };
}

export interface EmailAttachment {
  filename: string;
  path: string;
  cid: string;
}

export function buildOrderEmailAttachments(products: OrderEmailItem[] = []): { attachments: EmailAttachment[]; imageCidMap: Map<string, string> } {
  const attachments: EmailAttachment[] = [];
  const imageCidMap = new Map<string, string>();

  // 1. Logo attachment
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  if (fs.existsSync(logoPath)) {
    attachments.push({
      filename: 'logo.png',
      path: logoPath,
      cid: 'icemanz-logo'
    });
  }

  // 2. Local product images attachment
  products.forEach((item, index) => {
    let rawImg = item.image || (item.images && item.images[0]) || '';
    if (rawImg && typeof rawImg === 'string' && !rawImg.startsWith('http://') && !rawImg.startsWith('https://')) {
      const cleanPath = rawImg.startsWith('/') ? rawImg.slice(1) : rawImg;
      const fullPath = path.join(process.cwd(), 'public', cleanPath);

      if (fs.existsSync(fullPath)) {
        const ext = path.extname(fullPath) || '.png';
        const cid = `prod-img-${index}`;
        attachments.push({
          filename: `product-${index}${ext}`,
          path: fullPath,
          cid
        });
        imageCidMap.set(rawImg, `cid:${cid}`);
      }
    }
  });

  return { attachments, imageCidMap };
}

export function generateOrderReceiptEmailHtml(params: OrderEmailParams, imageCidMap?: Map<string, string>): string {
  const {
    orderId,
    customerName,
    amountPaid,
    currency = 'USD',
    deliveryMethod,
    shippingName,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingZip,
    shippingCountry,
    deliveryCost,
    tax,
    subtotal,
    products = [],
    invoiceDetails
  } = params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://icemanz.com';
  const formattedTotal = `$${amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Process product list HTML
  let productsRowsHtml = '';
  if (products && products.length > 0) {
    productsRowsHtml = products.map((item, index) => {
      const itemTitle = item.title || item.name || 'Featured Product';
      const itemBrand = item.brand || 'ICEMANZ';
      const itemQty = item.quantity || 1;

      // Calculate price
      let itemPriceNum = 0;
      if (typeof item.price === 'number') {
        itemPriceNum = item.price;
      } else if (typeof item.price === 'string') {
        itemPriceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      }

      const formattedItemPrice = itemPriceNum > 0
        ? `$${itemPriceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : (item.price ? `$${item.price}` : '$0.00');

      const itemTotalNum = itemPriceNum * itemQty;
      const formattedItemTotal = itemTotalNum > 0
        ? `$${itemTotalNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : formattedItemPrice;

      // Process image URL or CID
      let rawImg = item.image || (item.images && item.images[0]) || '';
      let imgSrc = '';

      if (imageCidMap && imageCidMap.has(rawImg)) {
        imgSrc = imageCidMap.get(rawImg)!;
      } else if (rawImg) {
        if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
          imgSrc = rawImg;
        } else {
          imgSrc = `${baseUrl}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
        }
      }

      return `
        <tr>
          <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="76" valign="top" style="padding-right: 16px;">
                  <div style="width: 76px; height: 76px; border-radius: 8px; border: 1px solid #e2e8f0; background-color: #ffffff; text-align: center; overflow: hidden; display: block;">
                    ${imgSrc ? `
                      <img src="${imgSrc}" alt="${itemTitle}" width="68" height="68" style="width: 68px; height: 68px; object-fit: contain; padding: 4px; display: block;" />
                    ` : `
                      <div style="width: 76px; height: 76px; line-height: 76px; background-color: #f8fafc; color: #94a3b8; font-size: 24px; text-align: center;">📦</div>
                    `}
                  </div>
                </td>
                <td valign="top">
                  <div style="margin-bottom: 4px;">
                    <span style="background-color: #eff6ff; color: #004a99; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                      ${itemBrand}
                    </span>
                    ${item.category ? `
                      <span style="background-color: #f1f5f9; color: #475569; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; margin-left: 4px; display: inline-block;">
                        ${item.category}
                      </span>
                    ` : ''}
                  </div>
                  <h4 style="margin: 4px 0 6px 0; color: #0f172a; font-size: 15px; font-weight: 700; line-height: 1.3;">
                    ${itemTitle}
                  </h4>
                  <div style="color: #64748b; font-size: 13px; font-weight: 500;">
                    Qty: <strong style="color: #0f172a;">${itemQty}</strong> &bull; Unit Price: <strong style="color: #0f172a;">${formattedItemPrice}</strong>
                  </div>
                </td>
                <td width="100" valign="top" align="right" style="padding-left: 10px;">
                  <div style="color: #004a99; font-size: 16px; font-weight: 800; text-align: right; white-space: nowrap;">
                    ${formattedItemTotal}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    }).join('');
  } else if (invoiceDetails?.projectName) {
    productsRowsHtml = `
      <tr>
        <td style="padding: 20px; border-bottom: 1px solid #f1f5f9;">
          <h4 style="margin: 0 0 6px 0; color: #004a99; font-size: 16px; font-weight: 700;">
            ${invoiceDetails.projectName}
          </h4>
          ${invoiceDetails.description ? `
            <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.5;">${invoiceDetails.description}</p>
          ` : ''}
        </td>
      </tr>
    `;
  }

  // Shipping / Pickup HTML
  let shippingOrPickupHtml = '';
  if (deliveryMethod === 'pickup') {
    shippingOrPickupHtml = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="36" valign="top">
                  <div style="width: 32px; height: 32px; background-color: #10b981; color: #ffffff; border-radius: 50%; text-align: center; line-height: 32px; font-size: 16px;">
                    🏢
                  </div>
                </td>
                <td valign="top" style="padding-left: 12px;">
                  <h3 style="margin: 0 0 6px 0; color: #166534; font-size: 16px; font-weight: 700;">Store Pickup Location</h3>
                  <p style="margin: 0 0 4px 0; color: #0f172a; font-size: 14px; font-weight: 600;">184-60 Jamaica Ave, Hollis, NY 11423, United States</p>
                  <p style="margin: 0; color: #15803d; font-size: 13px; font-weight: 600;">✓ Usually ready for pickup in 2-4 business days</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  } else if (shippingAddress || deliveryMethod === 'ship') {
    shippingOrPickupHtml = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="36" valign="top">
                  <div style="width: 32px; height: 32px; background-color: #004a99; color: #ffffff; border-radius: 50%; text-align: center; line-height: 32px; font-size: 16px;">
                    🚚
                  </div>
                </td>
                <td valign="top" style="padding-left: 12px;">
                  <h3 style="margin: 0 0 8px 0; color: #1e3a8a; font-size: 16px; font-weight: 700;">Shipping Information</h3>
                  <div style="color: #334155; font-size: 14px; line-height: 1.6;">
                    <strong style="color: #0f172a;">${shippingName || customerName}</strong><br/>
                    ${shippingAddress ? `${shippingAddress}<br/>` : ''}
                    ${shippingCity ? `${shippingCity}, ` : ''}${shippingState || ''} ${shippingZip || ''}<br/>
                    ${shippingCountry || ''}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  }

  // Cost breakdown
  const subtotalDisplay = subtotal && subtotal > 0 ? `$${subtotal.toFixed(2)}` : formattedTotal;
  const shippingDisplay = deliveryCost !== undefined && deliveryCost !== null
    ? (deliveryCost > 0 ? `$${deliveryCost.toFixed(2)}` : 'FREE')
    : (deliveryMethod === 'pickup' ? 'FREE (Store Pickup)' : 'Included');
  const taxDisplay = tax && tax > 0 ? `$${tax.toFixed(2)}` : null;

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 30px 10px;">
      <tr>
        <td align="center">
          <table width="620" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
            
            <!-- Header Bar with Logo -->
            <tr>
              <td style="padding: 24px 32px; background-color: #ffffff; border-bottom: 2px solid #f1f5f9;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" valign="middle">
                      <img src="cid:icemanz-logo" alt="ICEMANZ Logo" width="150" style="display: block; max-width: 150px; height: auto;" />
                    </td>
                    <td align="right" valign="middle">
                      <table cellpadding="0" cellspacing="0" border="0" align="right">
                        <tr>
                          <td style="padding-right: 6px; font-size: 14px; text-align: right;">📞</td>
                          <td style="color: #0f172a; font-weight: 700; font-size: 14px; text-align: right;">+1 (718) 678-6005</td>
                        </tr>
                        <tr>
                          <td colspan="2" style="color: #64748b; font-size: 11px; text-align: right; padding-top: 2px;">Mon - Fri: 6AM - 6PM EST</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content Area -->
            <tr>
              <td style="padding: 32px;">

                <!-- Order Confirmation Banner -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; margin-bottom: 28px;">
                  <tr>
                    <td align="center" style="padding: 24px;">
                      <div style="width: 52px; height: 52px; background-color: #10b981; color: #ffffff; border-radius: 50%; text-align: center; line-height: 52px; font-size: 26px; font-weight: bold; margin: 0 auto 12px auto;">
                        ✓
                      </div>
                      <h2 style="color: #065f46; font-size: 22px; font-weight: 800; margin: 0 0 6px 0; text-align: center;">Order Confirmed & Paid</h2>
                      <p style="color: #047857; font-size: 15px; margin: 0; text-align: center; line-height: 1.5;">
                        Thank you <strong>${customerName}</strong>! We have received your payment of <strong style="color: #065f46; font-size: 16px;">${formattedTotal} ${currency.toUpperCase()}</strong>.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Order Meta Card -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 28px;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="50%" valign="top">
                            <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px;">Order Number</div>
                            <div style="color: #0f172a; font-size: 14px; font-weight: 700; font-family: monospace;">#${orderId}</div>
                          </td>
                          <td width="50%" valign="top" align="right">
                            <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px;">Order Status</div>
                            <div>
                              <span style="background-color: #d1fae5; color: #065f46; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; display: inline-block;">
                                Paid
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Products Section -->
                ${productsRowsHtml ? `
                  <div style="margin-bottom: 28px;">
                    <h3 style="color: #0f172a; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 14px 0; border-bottom: 2px solid #004a99; padding-bottom: 8px;">
                      Products Ordered
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                      ${productsRowsHtml}
                    </table>
                  </div>
                ` : ''}

                <!-- Pricing & Summary Breakdown -->
                <div style="margin-bottom: 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <tr>
                      <td style="padding: 20px 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px;">
                          <tr>
                            <td style="color: #64748b; font-size: 14px;">Subtotal</td>
                            <td align="right" style="color: #0f172a; font-size: 14px; font-weight: 600;">${subtotalDisplay}</td>
                          </tr>
                        </table>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px;">
                          <tr>
                            <td style="color: #64748b; font-size: 14px;">Shipping & Delivery</td>
                            <td align="right" style="color: #0f172a; font-size: 14px; font-weight: 600;">${shippingDisplay}</td>
                          </tr>
                        </table>
                        ${taxDisplay ? `
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px;">
                            <tr>
                              <td style="color: #64748b; font-size: 14px;">Tax</td>
                              <td align="right" style="color: #0f172a; font-size: 14px; font-weight: 600;">${taxDisplay}</td>
                            </tr>
                          </table>
                        ` : ''}
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 2px dashed #cbd5e1; padding-top: 12px; margin-top: 6px;">
                          <tr>
                            <td style="color: #0f172a; font-size: 16px; font-weight: 800;">Total Amount Paid</td>
                            <td align="right" style="color: #10b981; font-size: 20px; font-weight: 900;">${formattedTotal} <span style="font-size: 12px; color: #64748b;">${currency.toUpperCase()}</span></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Shipping / Pickup Info Box -->
                ${shippingOrPickupHtml}

                <!-- Help & Support -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; border-radius: 12px;">
                  <tr>
                    <td style="padding: 20px; text-align: center;">
                      <h4 style="margin: 0 0 6px 0; color: #0f172a; font-size: 14px; font-weight: 700;">Need Assistance with Your Order?</h4>
                      <p style="margin: 0 0 12px 0; color: #475569; font-size: 13px; line-height: 1.4;">
                        Our team is preparing your order. If you have any questions or modifications, please contact support.
                      </p>
                      <a href="tel:+17186786005" style="background-color: #004a99; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-block;">
                        📞 Call Customer Support
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
                  &copy; ${new Date().getFullYear()} ICEMANZ. All rights reserved.<br/>
                  Industrial & Commercial Refrigeration Equipment Experts
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  `;
}

export function generateOrderReceiptEmailText(params: OrderEmailParams): string {
  const { orderId, customerName, amountPaid, currency = 'USD', products = [] } = params;

  let textProducts = products.map((p) => {
    const title = p.title || p.name || 'Product';
    return `- ${title} (Qty: ${p.quantity || 1})`;
  }).join('\n');

  return `
ICEMANZ - Order Summary & Confirmation
Order #${orderId}

Dear ${customerName},

Thank you for your order! We have received your payment of $${amountPaid.toFixed(2)} ${currency.toUpperCase()}.

Products Ordered:
${textProducts || '1 Order Item'}

Total Amount Paid: $${amountPaid.toFixed(2)} ${currency.toUpperCase()}

If you have any questions, please contact our support team at +1 (718) 678-6005.

Thank you for choosing ICEMANZ!
  `.trim();
}
