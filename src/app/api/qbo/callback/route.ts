import { NextResponse } from 'next/server';
import OAuthClient from 'intuit-oauth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');

    if (!code || !realmId) {
      return NextResponse.json({ error: 'Missing code or realmId' }, { status: 400 });
    }

    const oauthClient = new OAuthClient({
      clientId: process.env.QBO_CLIENT_ID!,
      clientSecret: process.env.QBO_CLIENT_SECRET!,
      environment: process.env.QBO_ENVIRONMENT as 'sandbox' | 'production',
      redirectUri: process.env.QBO_REDIRECT_URI!,
    });

    const authResponse = await oauthClient.createToken(code);
    const token = authResponse.getJson();

    const expiresAt = new Date(Date.now() + token.expires_in * 1000);

    await prisma.qboToken.deleteMany();

    await prisma.qboToken.create({
      data: {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        realmId: realmId,
        expiresAt: expiresAt,
      },
    });

    return NextResponse.redirect('/admin');
  } catch (error) {
    console.error('Error in QBO callback:', error);
    return NextResponse.json({ error: 'Failed to complete QuickBooks connection' }, { status: 500 });
  }
}
