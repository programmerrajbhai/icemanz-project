import { NextResponse } from 'next/server';
import OAuthClient from 'intuit-oauth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    console.log('QBO callback: Request URL:', request.url);
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('QBO callback: error:', error);
    console.log('QBO callback: code:', code ? 'present' : 'missing');
    console.log('QBO callback: realmId:', realmId);
    console.log('QBO callback: state:', state);

    if (error) {
      return NextResponse.json({ error: `OAuth error: ${error}` }, { status: 400 });
    }

    if (!code || !realmId) {
      return NextResponse.json({ error: 'Missing code or realmId' }, { status: 400 });
    }

    console.log('QBO callback: Creating OAuth client');
    const oauthClient = new OAuthClient({
      clientId: process.env.QBO_CLIENT_ID!,
      clientSecret: process.env.QBO_CLIENT_SECRET!,
      environment: process.env.QBO_ENVIRONMENT as 'sandbox' | 'production',
      redirectUri: process.env.QBO_REDIRECT_URI!,
    });

    console.log('QBO callback: Creating token with request URL');
    const authResponse = await oauthClient.createToken(request.url);
    console.log('QBO callback: Token created successfully');
    const token = oauthClient.getToken();
    console.log('QBO callback: Token:', {
      access_token: token.access_token ? 'present' : 'missing',
      refresh_token: token.refresh_token ? 'present' : 'missing',
      expires_in: token.expires_in
    });

    const expiresAt = new Date(Date.now() + token.expires_in * 1000);
    console.log('QBO callback: Expires at:', expiresAt);

    console.log('QBO callback: Deleting existing tokens');
    await prisma.qboToken.deleteMany();

    console.log('QBO callback: Creating new token in DB');
    await prisma.qboToken.create({
      data: {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        realmId: realmId,
        expiresAt: expiresAt,
      },
    });

    console.log('QBO callback: Redirecting to /admin/dashboard');
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    return NextResponse.redirect(`${baseUrl}/admin/dashboard`);
  } catch (error: any) {
    console.error('Error in QBO callback:', error);
    return NextResponse.json({
      error: 'Failed to complete QuickBooks connection',
      details: error.message
    }, { status: 500 });
  }
}
