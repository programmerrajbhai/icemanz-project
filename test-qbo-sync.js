const { PrismaClient } = require('@prisma/client');
const OAuthClient = require('intuit-oauth');
const prisma = new PrismaClient();

async function getQboClient() {
  const tokenData = await prisma.qboToken.findFirst();

  if (!tokenData) {
    throw new Error('No QBO token found');
  }

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

async function testSync() {
  try {
    const { oauthClient, realmId } = await getQboClient();
    console.log('Got QBO client, realmId:', realmId);

    const email = 'test@example.com';
    const customerQuery = `SELECT * FROM Customer WHERE PrimaryEmailAddr = '${email}'`;
    console.log('Querying customer:', customerQuery);

    const customerResponse = await oauthClient.makeApiCall({
      url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(customerQuery)}`,
      method: 'GET',
    });

    console.log('Customer response status:', customerResponse);

    // const accountQuery = `SELECT * FROM Account WHERE AccountType = 'Income' MAXRESULTS 1`;
    // const accountResponse = await oauthClient.makeApiCall({
    //   url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(accountQuery)}`,
    //   method: 'GET',
    // });
    // console.log('Account response status:', accountResponse.response.status);

  } catch (error) {
    console.error('Error during test:', error);
  }
}

testSync().catch(console.error);
