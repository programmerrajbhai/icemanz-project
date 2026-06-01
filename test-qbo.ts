import { getQboClient } from './src/lib/qbo';

async function test() {
  try {
    console.log('Testing QBO client...');
    const { oauthClient, realmId } = await getQboClient();
    console.log('Success! Realm ID:', realmId);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();