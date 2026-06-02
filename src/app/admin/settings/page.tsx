import prisma from '@/lib/prisma';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const qboToken = await prisma.qboToken.findFirst();
  const isConnected = !!qboToken && new Date(qboToken.expiresAt) > new Date();

  return (
    <div className="max-w-5xl mx-auto">
      <SettingsClient isConnected={isConnected} />
    </div>
  );
}
