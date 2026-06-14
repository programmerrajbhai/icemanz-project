import fs from 'fs';
import path from 'path';

const getLogoBase64 = () => {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const base64Logo = logoBuffer.toString('base64');
    return `data:image/png;base64,${base64Logo}`;
  } catch (error) {
    console.error('Error loading logo:', error);
    return '';
  }
};

export const logoBase64 = getLogoBase64();
