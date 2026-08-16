
export async function generateKeyPair() {

  const keyPair =
    await window.crypto.subtle.generateKey(

      {
        name: "RSA-OAEP",

        // 2048-bit RSA key
        modulusLength: 2048,

        // Standard RSA public exponent: 65537
        publicExponent:
          new Uint8Array([1, 0, 1]),

        hash: "SHA-256"
      },

      // Allow the keys to be exported
      true,

      // Public key -> encrypt
      // Private key -> decrypt
      [
        "encrypt",
        "decrypt"
      ]
    );

  return keyPair;
}



// ============================================================
// 2. EXPORT PUBLIC KEY
// ============================================================
//
// CryptoKey
//     ↓
// SPKI
//     ↓
// ArrayBuffer
//     ↓
// Base64
//
// The resulting string can be shared with another user.
// ============================================================

export async function exportPublicKey(publicKey) {

  if (!publicKey) {
    throw new Error(
      "Public key is required."
    );
  }

  const exportedKey =
    await window.crypto.subtle.exportKey(
      "spki",
      publicKey
    );

  return arrayBufferToBase64(
    exportedKey
  );
}



// ============================================================
// 3. EXPORT PRIVATE KEY
// ============================================================
//
// The private key should NEVER be shared with another user.
//
// PKCS8 is used for exporting the private RSA key.
// ============================================================

export async function exportPrivateKey(privateKey) {

  if (!privateKey) {
    throw new Error(
      "Private key is required."
    );
  }

  const exportedKey =
    await window.crypto.subtle.exportKey(
      "pkcs8",
      privateKey
    );

  return arrayBufferToBase64(
    exportedKey
  );
}



// ============================================================
// 4. IMPORT RECIPIENT PUBLIC KEY
// ============================================================
//
// When the sender receives a public key from the receiver,
// this function converts the Base64 string back into a
// CryptoKey that can be used for encryption.
// ============================================================

export async function importPublicKey(
  publicKeyBase64
) {

  if (!publicKeyBase64) {

    throw new Error(
      "Public key is required."
    );

  }

  const keyBuffer =
    base64ToArrayBuffer(
      publicKeyBase64
    );

  const publicKey =
    await window.crypto.subtle.importKey(

      "spki",

      keyBuffer,

      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },

      true,

      [
        "encrypt"
      ]
    );

  return publicKey;
}



// ============================================================
// 5. IMPORT PRIVATE KEY
// ============================================================
//
// Used by the receiver to restore their private key.
// ============================================================

export async function importPrivateKey(
  privateKeyBase64
) {

  if (!privateKeyBase64) {

    throw new Error(
      "Private key is required."
    );

  }

  const keyBuffer =
    base64ToArrayBuffer(
      privateKeyBase64
    );

  const privateKey =
    await window.crypto.subtle.importKey(

      "pkcs8",

      keyBuffer,

      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },

      true,

      [
        "decrypt"
      ]
    );

  return privateKey;
}



// ============================================================
// 6. SAVE PUBLIC KEY LOCALLY
// ============================================================

export function savePublicKey(
  publicKey
) {

  if (!publicKey) {
    throw new Error(
      "Cannot save an empty public key."
    );
  }

  localStorage.setItem(
    "chiper_public_key",
    publicKey
  );
}



// ============================================================
// 7. GET SAVED PUBLIC KEY
// ============================================================

export function getPublicKey() {

  return localStorage.getItem(
    "chiper_public_key"
  );

}



// ============================================================
// 8. SAVE PRIVATE KEY LOCALLY
// ============================================================
//
// NOTE:
// localStorage is convenient for this development stage,
// but it is NOT ideal for a production-grade secure vault.
//
// Later we can move this to IndexedDB + Web Crypto,
// and protect access with stronger controls.
// ============================================================

export function savePrivateKey(
  privateKey
) {

  if (!privateKey) {
    throw new Error(
      "Cannot save an empty private key."
    );
  }

  localStorage.setItem(
    "chiper_private_key",
    privateKey
  );
}



// ============================================================
// 9. GET SAVED PRIVATE KEY
// ============================================================

export function getPrivateKey() {

  return localStorage.getItem(
    "chiper_private_key"
  );

}



// ============================================================
// 10. REMOVE STORED KEYS
// ============================================================

export function clearStoredKeys() {

  localStorage.removeItem(
    "chiper_public_key"
  );

  localStorage.removeItem(
    "chiper_private_key"
  );

}



// ============================================================
// 11. CONVERT ARRAYBUFFER → BASE64
// ============================================================

function arrayBufferToBase64(
  buffer
) {

  const bytes =
    new Uint8Array(buffer);

  let binary = "";

  for (
    let i = 0;
    i < bytes.length;
    i++
  ) {

    binary += String.fromCharCode(
      bytes[i]
    );

  }

  return btoa(binary);
}



// ============================================================
// 12. CONVERT BASE64 → ARRAYBUFFER
// ============================================================

function base64ToArrayBuffer(
  base64
) {

  const binaryString =
    atob(base64);

  const length =
    binaryString.length;

  const bytes =
    new Uint8Array(length);

  for (
    let i = 0;
    i < length;
    i++
  ) {

    bytes[i] =
      binaryString.charCodeAt(i);

  }

  return bytes.buffer;
}   