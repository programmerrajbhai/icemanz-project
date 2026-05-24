import { NextResponse } from 'next/server';
import OAuthClient from 'intuit-oauth';

export async function GET() {
  try {
    const oauthClient = new OAuthClient({
      clientId: process.env.QBO_CLIENT_ID!,
      clientSecret: process.env.QBO_CLIENT_SECRET!,
      environment: process.env.QBO_ENVIRONMENT as 'sandbox' | 'production',
      redirectUri: process.env.QBO_REDIRECT_URI!,
    });

    const authUri = oauthClient.authorizeUri({
      scope: ['com.intuit.quickbooks.accounting'],
      state: 'icemanz-qbo-auth',
    });

    return NextResponse.redirect(authUri);
  } catch (error) {
    console.error('Error generating QBO auth URL:', error);
    return NextResponse.json({ error: 'Failed to connect to QuickBooks' }, { status: 500 });
  }
}
