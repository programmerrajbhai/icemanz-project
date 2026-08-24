import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { logoAttachment } from '@/lib/logo';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, items, email, fullName, phone, address, companyName, contactPersonRole, businessType, purchaseTimeline, numberLocations, billingSameAsShipping, deliveryRequirements, projectDetails } = body;
    console.log("[CREATE-PAYMENT-INTENT] Received order request data:", { email, fullName, phone, address, companyName });

    // Determine the category from the cart items
    const category = items.some((item: any) => item.category === 'walk-in-cooler-freezer')
      ? 'walk-in-cooler-freezer'
      : 'refrigeration-equipment';

    const reqDeliveryNotes = `
Delivery Requirements:
Loading Dock: ${deliveryRequirements?.loadingDock ? 'Yes' : 'No'}
Forklift: ${deliveryRequirements?.forklift ? 'Yes' : 'No'}
Residential Delivery: ${deliveryRequirements?.residentialDelivery ? 'Yes' : 'No'}
Billing Same As Shipping: ${billingSameAsShipping ? 'Yes' : 'No'}
${!billingSameAsShipping ? `
Billing Address:
Address: ${body.billingAddress || 'N/A'}
City: ${body.billingCity || 'N/A'}
State: ${body.billingState || 'N/A'}
Zip Code: ${body.billingZipCode || 'N/A'}
Country: ${body.billingCountry || 'N/A'}
` : ''}
    `.trim();

    const descriptionNotes = `
Company Name: ${companyName || 'N/A'}
Contact Role: ${contactPersonRole || 'N/A'}
Business Type: ${businessType || 'N/A'}
Purchase Timeline: ${purchaseTimeline || 'N/A'}
Number of Locations: ${numberLocations || 'N/A'}
Project Details: ${projectDetails || 'None'}
    `.trim();

    // Create InvoiceRequest in database with PENDING status
    const invoiceRequest = await prisma.invoiceRequest.create({
      data: {
        email: email || 'customer@example.com',
        phone: phone || '',
        fullName: fullName || 'Customer',
        address: address || '',
        totalAmount: amount,
        totalWithTax: amount,
        products: items,
        category: category,
        status: 'PENDING',
        deliveryNotes: reqDeliveryNotes,
        description: descriptionNotes
      }
    });

    console.log("[CREATE-PAYMENT-INTENT] Order Request created with ID:", invoiceRequest.id);

    // Call the QBO callback API to sync and create an invoice in QuickBooks automatically
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));

    try {
      console.log(`[CREATE-PAYMENT-INTENT] Calling sync to QuickBooks at ${baseUrl}/api/admin/invoices/${invoiceRequest.id}/approve`);
      // Internal call to approve endpoint to generate QBO invoice
      const syncResponse = await fetch(`${baseUrl}/api/admin/invoices/${invoiceRequest.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SYNC_QBO' }),
      });
      if (!syncResponse.ok) {
        console.error("Failed to auto-sync with QuickBooks on checkout. Status:", syncResponse.status);
        try {
          const errBody = await syncResponse.text();
          console.error("Sync error body:", errBody);
        } catch (e) {
          // ignore
        }
      } else {
        console.log("Successfully synced with QuickBooks on checkout");
      }
    } catch (syncError) {
      console.error("Error auto-syncing with QuickBooks:", syncError);
    }

    const firstProduct = items && items.length > 0 ? items[0] : null;
    const productTitle = firstProduct ? (firstProduct.title || firstProduct.name) : 'Custom Project';
    const productImage = firstProduct ? firstProduct.image : null;
    const productQuantity = firstProduct ? (firstProduct.quantity || 1) : 1;
    const isWalkInCooler = category === 'walk-in-cooler-freezer';

    const emailSubject = isWalkInCooler
      ? `Invoice Request Received - ${productTitle}`
      : `Order Received - ${productTitle}`;

    // Format amount properly
    const formattedAmount = amount ? `$${amount.toFixed(2)}` : 'To Be Confirmed';

    // New styled email HTML matching the design
    const emailHtml = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 24px 32px; border-bottom: 2px solid #e2e8f0;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="left" valign="middle">
                        <img src="cid:icemanz-logo" alt="ICEMANZ Logo" width="140" style="display: block; max-width: 140px; height: auto;" />
                      </td>
                      <td align="right" valign="middle">
                        <table cellpadding="0" cellspacing="0" border="0" align="right">
                          <tr>
                            <td style="padding-right: 6px; font-size: 14px; text-align: right;">📞</td>
                            <td style="color: #0f172a; font-weight: 600; font-size: 14px; text-align: right;">+1 (718) 678-6005</td>
                          </tr>
                          <tr>
                            <td colspan="2" style="color: #64748b; font-size: 11px; text-align: right; padding-top: 4px;">Mon - Fri: 6AM - 6PM EST</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 32px;">
                  <!-- Success Icon -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 24px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td width="64" height="64" align="center" valign="middle" style="background-color: #eff6ff; border-radius: 50%; border: 8px solid #e0e7ff; display: inline-block;">
                              <span style="color: #10b981; font-size: 28px; line-height: 64px; display: block; text-align: center;">✓</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Greeting -->
                  <h2 style="color: #0f172a; text-align: center; font-size: 24px; font-weight: 700; margin: 0 0 12px 0;">Thank You, ${fullName}!</h2>
                  <p style="color: #475569; text-align: center; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                    We have received your invoice request and our team is<br/>preparing your customized quote.
                  </p>

                  <!-- Info Alert -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border-radius: 8px; margin-bottom: 32px;">
                    <tr>
                      <td style="padding: 16px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td width="40" valign="middle">
                              <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="32" height="32" align="center" valign="middle" style="background-color: #2563eb; color: #ffffff; border-radius: 50%; font-size: 16px; display: inline-block;">
                                    <span style="line-height: 32px; display: block; text-align: center;">✉</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td valign="middle" style="color: #1e3a8a; font-size: 14px; line-height: 1.5;">
                              You will receive your official invoice with final pricing within <strong>1 business day</strong>.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Product Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <tr>
                      <td style="padding: 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                          <tr>
                            ${productImage ? `
                            <td width="100" valign="top" style="padding-right: 20px;">
                              <table width="100" height="100" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 8px;">
                                <tr>
                                  <td align="center" valign="middle" style="padding: 10px;">
                                    <img src="${productImage}" alt="Product" width="80" style="max-width: 80px; max-height: 80px; display: block;" />
                                  </td>
                                </tr>
                              </table>
                            </td>
                            ` : ''}
                            <td valign="top">
                              <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px; font-weight: 600; line-height: 1.4;">${productTitle}</h3>
                              <p style="margin: 0; color: #64748b; font-size: 14px;">Quantity: ${productQuantity}</p>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td valign="middle" width="50%">
                                    <table cellpadding="0" cellspacing="0" border="0">
                                      <tr>
                                        <td width="40" valign="middle">
                                          <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                              <td width="32" height="32" align="center" valign="middle" style="background-color: #eff6ff; color: #2563eb; border-radius: 50%; font-size: 16px; display: inline-block;">
                                                <span style="line-height: 32px; display: block; text-align: center;">🏷️</span>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                        <td valign="middle">
                                          <div style="margin: 0 0 4px 0; color: #64748b; font-size: 12px;">Estimated Equipment Price</div>
                                          <div style="margin: 0; color: #2563eb; font-size: 18px; font-weight: 700;">${formattedAmount}</div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td valign="middle" width="50%" align="right" style="border-left: 1px solid #e2e8f0; padding-left: 20px;">
                                    <table cellpadding="0" cellspacing="0" border="0" align="right">
                                      <tr>
                                        <td align="right" style="padding-bottom: 6px;">
                                          <div style="margin: 0; color: #64748b; font-size: 12px;">Final Invoice Amount</div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td align="right">
                                          <span style="background-color: #fef3c7; color: #ea580c; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; display: inline-block;">To Be Confirmed</span>
                                        </td>
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
                  </table>

                  <!-- What Happens Next -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px;">
                    <tr>
                      <td align="center" style="padding-bottom: 24px;">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td width="30%" style="border-bottom: 1px solid #e2e8f0;"></td>
                            <td width="40%" align="center" style="padding: 0 15px;">
                              <h3 style="color: #0f172a; font-size: 18px; font-weight: 600; margin: 0;">What Happens Next?</h3>
                            </td>
                            <td width="30%" style="border-bottom: 1px solid #e2e8f0;"></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <!-- Step 1 -->
                            <td width="30%" valign="top">
                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                  <td width="45" valign="top">
                                    <table cellpadding="0" cellspacing="0" border="0">
                                      <tr>
                                        <td width="36" height="36" align="center" valign="middle" style="background-color: #eff6ff; border-radius: 8px; display: inline-block;">
                                          <span style="font-size: 18px; line-height: 36px; display: block; text-align: center;">📄</span>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td valign="middle">
                                    <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 13px; font-weight: 600;">Review</h4>
                                    <p style="margin: 0; color: #64748b; font-size: 11px; line-height: 1.4;">Our team reviews<br/>your request</p>
                                  </td>
                                </tr>
                              </table>
                            </td>

                            <!-- Arrow 1 -->
                            <td width="5%" valign="middle" align="center" style="color: #cbd5e1; font-size: 20px;">→</td>

                            <!-- Step 2 -->
                            <td width="30%" valign="top">
                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                  <td width="45" valign="top">
                                    <table cellpadding="0" cellspacing="0" border="0">
                                      <tr>
                                        <td width="36" height="36" align="center" valign="middle" style="background-color: #ecfdf5; border-radius: 8px; display: inline-block;">
                                          <span style="font-size: 18px; line-height: 36px; display: block; text-align: center;">🧮</span>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td valign="middle">
                                    <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 13px; font-weight: 600;">Calculate</h4>
                                    <p style="margin: 0; color: #64748b; font-size: 11px; line-height: 1.4;">We add shipping,<br/>taxes & other costs</p>
                                  </td>
                                </tr>
                              </table>
                            </td>

                            <!-- Arrow 2 -->
                            <td width="5%" valign="middle" align="center" style="color: #cbd5e1; font-size: 20px;">→</td>

                            <!-- Step 3 -->
                            <td width="30%" valign="top">
                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                  <td width="45" valign="top">
                                    <table cellpadding="0" cellspacing="0" border="0">
                                      <tr>
                                        <td width="36" height="36" align="center" valign="middle" style="background-color: #fff7ed; border-radius: 8px; display: inline-block;">
                                          <span style="font-size: 18px; line-height: 36px; display: block; text-align: center;">✉️</span>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td valign="middle">
                                    <h4 style="margin: 0 0 4px 0; color: #0f172a; font-size: 13px; font-weight: 600;">Invoice</h4>
                                    <p style="margin: 0; color: #64748b; font-size: 11px; line-height: 1.4;">We send your final<br/>invoice by email</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Contact Support Footer -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 12px; margin-top: 40px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td valign="middle">
                              <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="48" valign="middle">
                                    <table cellpadding="0" cellspacing="0" border="0">
                                      <tr>
                                        <td width="36" height="36" align="center" valign="middle" style="background-color: #eff6ff; color: #2563eb; border-radius: 50%; font-size: 18px; display: inline-block;">
                                          <span style="line-height: 36px; display: block; text-align: center;">💬</span>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td valign="middle">
                                    <div style="margin: 0 0 4px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Need help or have any questions?</div>
                                    <div style="margin: 0; color: #64748b; font-size: 13px;">Reply to this email or contact our sales team.</div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td valign="middle" align="right">
                              <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td align="center" valign="middle" style="background-color: #004a99; border-radius: 8px;">
                                    <a href="tel:+17186786005" style="color: white; text-decoration: none; padding: 10px 20px; font-size: 14px; font-weight: 600; display: inline-block;">
                                      📞 Contact Sales Team
                                    </a>
                                  </td>
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
            </table>
          </td>
        </tr>
      </table>
    `;

    try {
      await transporter.sendMail({
        from: `"ICEMANZ Support" <${process.env.SMTP_USERNAME || process.env.SMTP_USER}>`,
        to: email,
        subject: emailSubject,
        html: emailHtml,
        attachments: [logoAttachment]
      });
      console.log("[CREATE-PAYMENT-INTENT] Thank you email sent to:", email);
    } catch (emailError) {
      console.error("[CREATE-PAYMENT-INTENT] Failed to send thank you email:", emailError);
    }

    return NextResponse.json({
      success: true,
      invoiceId: invoiceRequest.id,
      isQuickBooks: true
    });
  } catch (error: any) {
    console.error('Order request error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
