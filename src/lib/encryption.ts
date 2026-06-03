import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET = process.env.JWT_SECRET || 'edifice-properties-default-encryption-secret-key-32-chars-long';
// Force encryption key to be exactly 32 bytes
const ENCRYPTION_KEY = crypto.createHash('sha256').update(SECRET).digest(); 
const IV_LENGTH = 16; 

export function encrypt(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  if (!text) return '';
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift() || '', 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    console.error('Password decryption failed:', err);
    return '';
  }
}
