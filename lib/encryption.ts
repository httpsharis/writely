/**
 * Content Encryption Utility for Writely
 *
 * Encrypts chapter content before storing in MongoDB and decrypts
 * when reading. Uses AES-256-GCM (authenticated encryption).
 *
 * ─── How It Works ───────────────────────────────────────────────
 *
 * AES-256-GCM explained simply:
 *
 *   AES   = the encryption algorithm (industry standard)
 *   256   = key length in bits (very strong, used by governments)
 *   GCM   = "Galois/Counter Mode" — authenticated encryption
 *
 * What "authenticated" means:
 *   Regular encryption only hides data. GCM also creates an
 *   "auth tag" — a fingerprint of the encrypted data. If anyone
 *   tampers with the ciphertext, decryption will FAIL instead of
 *   returning garbage. This prevents silent data corruption.
 *
 * ─── Storage Format ─────────────────────────────────────────────
 *
 * Encrypted content is stored as a single string:
 *
 *   "iv:authTag:encryptedData"
 *
 *   iv            = Initialization Vector (random, unique per encryption)
 *   authTag       = Authentication tag (tamper detection)
 *   encryptedData = The actual encrypted content
 *
 * All three parts are hex-encoded strings.
 *
 * ─── Why a Random IV Each Time? ─────────────────────────────────
 *
 * If you encrypt the same text twice with the same key + same IV,
 * you get identical ciphertext — an attacker could detect repeated
 * content. A random IV ensures every encryption is unique, even for
 * identical input.
 *
 * ─── Environment Variable ───────────────────────────────────────
 *
 * Requires ENCRYPTION_KEY in .env.local:
 *   - Must be exactly 64 hex characters (= 32 bytes = 256 bits)
 *   - Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import crypto from 'crypto';

// ─── Config ─────────────────────────────────────────────────────────

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;        // 16 bytes = 128 bits (standard for AES-GCM)
const AUTH_TAG_LENGTH = 16;  // 16 bytes = 128 bits (maximum GCM auth tag)
const ENCODING = 'hex' as const;
const SEPARATOR = ':';

// ─── Key Validation ─────────────────────────────────────────────────

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      '[Encryption] ENCRYPTION_KEY is not set in environment variables.\n' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }

  if (key.length !== 64) {
    throw new Error(
      '[Encryption] ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes).\n' +
      `Current length: ${key.length}`
    );
  }

  return Buffer.from(key, 'hex');
}

// ─── Encrypt ────────────────────────────────────────────────────────

/**
 * Encrypt content (string or object) into a single encoded string.
 *
 * Objects are JSON-stringified first, then encrypted.
 * Returns: "iv:authTag:encryptedData" (all hex-encoded)
 */
export function encryptContent(content: unknown): string {
  // Convert to string if it's an object (e.g., Tiptap JSON)
  const plaintext = typeof content === 'string'
    ? content
    : JSON.stringify(content);

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plaintext, 'utf8', ENCODING);
  encrypted += cipher.final(ENCODING);

  const authTag = cipher.getAuthTag().toString(ENCODING);

  // Combine all parts into one string for easy storage
  return [
    iv.toString(ENCODING),
    authTag,
    encrypted,
  ].join(SEPARATOR);
}

// ─── Decrypt ────────────────────────────────────────────────────────

/**
 * Decrypt an encrypted string back to its original content.
 *
 * If the original was JSON, it's parsed back into an object.
 * If decryption fails (tampered data, wrong key), throws an error.
 */
export function decryptContent(encryptedString: string): unknown {
  const parts = encryptedString.split(SEPARATOR);

  if (parts.length !== 3) {
    throw new Error('[Encryption] Invalid encrypted format — expected iv:authTag:data');
  }

  const [ivHex, authTagHex, encryptedData] = parts;

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, ENCODING);
  const authTag = Buffer.from(authTagHex, ENCODING);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, ENCODING, 'utf8');
  decrypted += decipher.final('utf8');

  // Try to parse as JSON (for Tiptap content), fall back to string
  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
}

// ─── Helper: Check if a value is encrypted ──────────────────────────

/**
 * Quick check to see if content looks like it was encrypted by us.
 * Encrypted content is always a string in "hex:hex:hex" format.
 */
export function isEncrypted(content: unknown): boolean {
  if (typeof content !== 'string') return false;

  const parts = content.split(SEPARATOR);
  if (parts.length !== 3) return false;

  // Check that all parts are valid hex strings
  const hexPattern = /^[0-9a-f]+$/i;
  return parts.every(part => hexPattern.test(part));
}
