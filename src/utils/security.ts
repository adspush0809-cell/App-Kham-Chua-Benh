// Security Utility: SHA-256 Hashing for Admin Password
const SALT = '_cantho_medicare_iv_secure_salt_v2';

export const INITIAL_ADMIN_HASH = '3ffca4fb8ed8fc68865b4a658c5aebdcbf862e1c01f869e371e52b18d091d422'; // Hash of 'BSPhuc@2026'

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPassword = async (input: string, storedHash: string): Promise<boolean> => {
  if (!input) return false;
  const inputHash = await hashPassword(input.trim());
  return inputHash === storedHash;
};
