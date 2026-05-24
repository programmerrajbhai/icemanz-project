import OAuthClient from 'intuit-oauth';
import prisma from './prisma';

export async function getQboClient() {
  const tokenData = await prisma.qboToken.findFirst();

  if (!tokenData) {
    throw new Error('No QBO token found');
  }

  const isExpired = tokenData.expiresAt <= new Date(Date.now() + 60000); // 1min buffer

  const oauthClient = new OAuthClient({
    clientId: process.env.QBO_CLIENT_ID!,
    clientSecret: process.env.QBO_CLIENT_SECRET!,
    environment: process.env.QBO_ENVIRONMENT as 'sandbox' | 'production',
    redirectUri: process.env.QBO_REDIRECT_URI!,
    token: {
      access_token: tokenData.accessToken,
      refresh_token: tokenData.refreshToken,
      token_type: 'bearer',
      expires_in: Math.floor((tokenData.expiresAt.getTime() - Date.now()) / 1000),
      x_refresh_token_expires_in: 8726400,
    },
  });

  if (isExpired) {
    const refreshResponse = await oauthClient.refresh();
    const newToken = refreshResponse.getJson();
    const newExpiresAt = new Date(Date.now() + newToken.expires_in * 1000);

    await prisma.qboToken.update({
      where: { id: tokenData.id },
      data: {
        accessToken: newToken.access_token,
        refreshToken: newToken.refresh_token,
        expiresAt: newExpiresAt,
      },
    });
  }

  return { oauthClient, realmId: tokenData.realmId };
}
