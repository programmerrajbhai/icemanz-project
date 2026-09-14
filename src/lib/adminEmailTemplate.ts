export function buildAdminOrderEmailHtml(params: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amountPaid: number;
  deliveryMethod: string;
  shippingName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCountry?: string;
  products?: any[];
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
}) {
  const {
    orderId, customerName, customerEmail, customerPhone,
    amountPaid, deliveryMethod,
    shippingName, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry,
    products = [], subtotal, shippingCost, tax,
  } = params;

  const orderDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const orderTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Calculate subtotal/shipping/tax from amount if not provided
  const displaySubtotal = subtotal ?? amountPaid;
  const displayShipping = shippingCost ?? 0;
  const displayTax = tax ?? 0;

  const productRows = products.length > 0 ? products.map((p: any) => {
    const name = p.name || p.title || 'Product';
    const brand = p.brand || '';
    const qty = p.quantity || 1;
    const price = parseFloat(String(p.price || 0).replace(/[^0-9.]/g, ''));
    const lineTotal = price * qty;
    const image = p.image || p.images?.[0] || '';

    return `
      <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${image ? `
              <td style="vertical-align:top;padding-right:14px;">
                <img src="${image}" alt="${name}" width="68" height="68"
                  style="width:68px;height:68px;object-fit:contain;border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;display:block;" />
              </td>` : ''}
              <td style="vertical-align:middle;">
                <div style="font-size:13px;font-weight:600;color:#111827;line-height:1.4;">${name}</div>
                ${brand ? `<div style="font-size:11px;color:#6b7280;margin-top:2px;">Brand: ${brand}</div>` : ''}
                <div style="font-size:11px;color:#6b7280;margin-top:2px;">Qty: ${qty}</div>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;text-align:right;vertical-align:middle;white-space:nowrap;">
          <div style="font-size:13px;font-weight:700;color:#111827;">$${fmt(lineTotal)}</div>
          ${qty > 1 ? `<div style="font-size:11px;color:#9ca3af;margin-top:2px;">$${fmt(price)} each</div>` : ''}
        </td>
      </tr>
    `;
  }).join('') : `
    <tr>
      <td colspan="2" style="padding:16px;text-align:center;color:#9ca3af;font-size:13px;">No product details available</td>
    </tr>
  `;

  const shippingBlock = shippingAddress && deliveryMethod !== 'pickup' ? `
    <td width="50%" style="vertical-align:top;padding-left:8px;">
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;height:100%;box-sizing:border-box;">
        <div style="font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">🚚 Ship To</div>
        <div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:4px;">${shippingName || customerName}</div>
        <div style="font-size:12px;color:#374151;line-height:1.7;">
          ${shippingAddress}<br/>
          ${shippingCity}${shippingState ? ', ' + shippingState : ''} ${shippingZip || ''}<br/>
          ${shippingCountry || 'US'}
        </div>
      </div>
    </td>
  ` : `
    <td width="50%" style="vertical-align:top;padding-left:8px;">
      <div style="background:#fefce8;border:1px solid #fef08a;border-radius:10px;padding:16px;height:100%;box-sizing:border-box;">
        <div style="font-size:11px;font-weight:700;color:#ca8a04;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">📦 Pickup</div>
        <div style="font-size:13px;font-weight:600;color:#111827;margin-bottom:4px;">Customer Pickup</div>
        <div style="font-size:12px;color:#374151;line-height:1.7;">
          184-60 Jamaica Ave<br/>
          Hollis, NY 11423<br/>
          United States
        </div>
      </div>
    </td>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>New Order - ICEMANZ</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%);border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
              <div style="display:inline-block;">
                <span style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">ICE</span><span style="font-size:28px;font-weight:900;color:#60a5fa;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">MANZ</span>
              </div>
              <div style="margin-top:6px;">
                <span style="font-size:11px;color:#93c5fd;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Order Notification</span>
              </div>
            </td>
          </tr>

          <!-- ORDER BADGE + ID -->
          <tr>
            <td style="background:#fff;padding:24px 32px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#dcfce7;border-radius:20px;padding:5px 14px;">
                          <span style="font-size:12px;font-weight:700;color:#16a34a;letter-spacing:0.5px;">● NEW ORDER</span>
                        </td>
                        <td style="padding-left:12px;">
                          <span style="font-size:20px;font-weight:800;color:#111827;">Order #${orderId.slice(0, 8).toUpperCase()}</span>
                        </td>
                      </tr>
                    </table>
                    <div style="font-size:12px;color:#6b7280;margin-top:6px;">${orderDate} at ${orderTime}</div>
                  </td>
                  <td style="text-align:right;vertical-align:top;">
                    <div style="font-size:24px;font-weight:800;color:#16a34a;">$${fmt(amountPaid)}</div>
                    <div style="font-size:11px;color:#9ca3af;">Total Paid</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CUSTOMER + SHIPPING INFO -->
          <tr>
            <td style="background:#fff;padding:0 32px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" style="vertical-align:top;padding-right:8px;">
                    <div style="background:#f8faff;border:1px solid #dbeafe;border-radius:10px;padding:16px;">
                      <div style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">👤 Customer</div>
                      <div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:4px;">${customerName}</div>
                      <div style="font-size:12px;color:#2563eb;margin-bottom:3px;">${customerEmail}</div>
                      <div style="font-size:12px;color:#374151;">${customerPhone || 'N/A'}</div>
                    </div>
                  </td>
                  ${shippingBlock}
                </tr>
              </table>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="background:#fff;padding:0 32px;">
              <div style="height:1px;background:#f1f5f9;"></div>
            </td>
          </tr>

          <!-- PRODUCTS HEADING -->
          <tr>
            <td style="background:#fff;padding:20px 32px 12px;">
              <div style="font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:1px;">📦 Products Ordered</div>
            </td>
          </tr>

          <!-- PRODUCTS TABLE -->
          <tr>
            <td style="background:#fff;padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                ${productRows}
              </table>
            </td>
          </tr>

          <!-- ORDER SUMMARY -->
          <tr>
            <td style="background:#fff;padding:16px 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:13px;color:#6b7280;padding-bottom:10px;">Subtotal</td>
                        <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;padding-bottom:10px;">$${fmt(displaySubtotal)}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#6b7280;padding-bottom:10px;">
                          Shipping
                          ${shippingState ? `<span style="font-size:11px;color:#9ca3af;">(${shippingState} freight rate)</span>` : ''}
                        </td>
                        <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;padding-bottom:10px;">
                          ${deliveryMethod === 'pickup' ? '<span style="color:#16a34a;">FREE</span>' : `$${fmt(displayShipping)}`}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#6b7280;padding-bottom:14px;">
                          Tax
                          ${shippingState ? `<span style="font-size:11px;color:#9ca3af;">(${shippingState})</span>` : ''}
                        </td>
                        <td style="font-size:13px;color:#111827;font-weight:600;text-align:right;padding-bottom:14px;">$${fmt(displayTax)}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top:2px solid #e5e7eb;padding-top:14px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="font-size:15px;font-weight:800;color:#111827;">Total Paid</td>
                              <td style="font-size:22px;font-weight:800;color:#16a34a;text-align:right;">$${fmt(amountPaid)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#1e3a8a;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
              <div style="font-size:12px;color:#93c5fd;margin-bottom:4px;">ICEMANZ Admin Notification System</div>
              <div style="font-size:11px;color:#6b91d6;">© ${new Date().getFullYear()} ICEMANZ. All rights reserved.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
