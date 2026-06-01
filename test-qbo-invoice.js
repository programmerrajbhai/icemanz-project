const { PrismaClient } = require('@prisma/client');
const OAuthClient = require('intuit-oauth');
const prisma = new PrismaClient();

async function getQboClient() {
  const tokenData = await prisma.qboToken.findFirst();
  if (!tokenData) throw new Error('No QBO token found');

  const oauthClient = new OAuthClient({
    clientId: process.env.QBO_CLIENT_ID,
    clientSecret: process.env.QBO_CLIENT_SECRET,
    environment: process.env.QBO_ENVIRONMENT,
    redirectUri: process.env.QBO_REDIRECT_URI,
    token: {
      access_token: tokenData.accessToken,
      refresh_token: tokenData.refreshToken,
      token_type: 'bearer',
      expires_in: Math.floor((tokenData.expiresAt.getTime() - Date.now()) / 1000),
      x_refresh_token_expires_in: 8726400,
    },
  });
  return { oauthClient, realmId: tokenData.realmId };
}

async function testCreateInvoice() {
  try {
    const { oauthClient, realmId } = await getQboClient();
    
    // Create customer
    const email = 'test2@example.com';
    const customerQuery = `SELECT * FROM Customer WHERE PrimaryEmailAddr = '${email}' MAXRESULTS 1`;
    const customerResponse = await oauthClient.makeApiCall({
      url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(customerQuery)}`,
      method: 'GET',
    });
    
    const customers = customerResponse.json.QueryResponse?.Customer;
    let customerRef;
    if (customers && customers.length > 0) {
      customerRef = { value: customers[0].Id, name: customers[0].DisplayName };
    } else {
      const customerData = {
        DisplayName: 'Test Customer 2',
        PrimaryEmailAddr: { Address: email }
      };
      const createCustomerResponse = await oauthClient.makeApiCall({
        url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/customer`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });
      const newCustomer = createCustomerResponse.json.Customer;
      customerRef = { value: newCustomer.Id, name: newCustomer.DisplayName };
    }
    console.log('Customer Ref:', customerRef);

    // Get item
    const itemQuery = `SELECT * FROM Item WHERE Name = 'Services' MAXRESULTS 1`;
    const itemResponse = await oauthClient.makeApiCall({
      url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(itemQuery)}`,
      method: 'GET',
    });
    const items = itemResponse.json.QueryResponse?.Item;
    let itemRef;
    if (items && items.length > 0) {
      itemRef = { value: items[0].Id, name: items[0].Name };
    } else {
      console.log('Item Services not found. Need to create.');
      itemRef = { value: '1', name: 'Services' }; // Assuming it exists for now, or just fails
    }
    console.log('Item Ref:', itemRef);

    // Create Invoice
    const invoiceData = {
      CustomerRef: customerRef,
      Line: [
        {
          Amount: 100,
          DetailType: 'SalesItemLineDetail',
          SalesItemLineDetail: {
            ItemRef: itemRef,
            UnitPrice: 100,
            Qty: 1,
          },
        },
      ],
    };
    
    const createInvoiceResponse = await oauthClient.makeApiCall({
      url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/invoice`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });
    
    const newInvoice = createInvoiceResponse.json.Invoice;
    console.log('Created invoice:', newInvoice.Id);
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testCreateInvoice().catch(console.error);