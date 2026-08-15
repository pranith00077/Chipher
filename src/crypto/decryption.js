// src/crypto/decryption.js

// ============================================================
// Base64 → ArrayBuffer
// ============================================================

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);

  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}


// ============================================================
// DECRYPT MESSAGE
// ============================================================

export async function decryptMessage(
  encryptedPackage,
  privateKey
) {

  // ----------------------------------------------------------
  // Validate input
  // ----------------------------------------------------------

  if (!encryptedPackage) {
    throw new Error(
      "Encrypted package is missing."
    );
  }

  if (!privateKey) {
    throw new Error(
      "Private key is missing."
    );
  }


  // ----------------------------------------------------------
  // Read encrypted package
  // ----------------------------------------------------------

  const {
    encryptedKey,
    iv,
    ciphertext
  } = encryptedPackage;


  if (
    !encryptedKey ||
    !iv ||
    !ciphertext
  ) {
    throw new Error(
      "Invalid encrypted package."
    );
  }


  console.log(
    "Decrypting AES key using RSA private key..."
  );


  // ----------------------------------------------------------
  // Convert encrypted AES key
  // ----------------------------------------------------------

  const encryptedAESKey =
    base64ToArrayBuffer(
      encryptedKey
    );


  // ----------------------------------------------------------
  // RSA-OAEP decrypt AES key
  // ----------------------------------------------------------

  const rawAESKey =
    await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      encryptedAESKey
    );


  console.log(
    "AES key successfully decrypted."
  );


  // ----------------------------------------------------------
  // Import AES key
  // ----------------------------------------------------------

  const aesKey =
    await crypto.subtle.importKey(
      "raw",
      rawAESKey,
      {
        name: "AES-GCM"
      },
      false,
      ["decrypt"]
    );


  // ----------------------------------------------------------
  // Decode IV
  // ----------------------------------------------------------

  const ivBuffer =
    base64ToArrayBuffer(
      iv
    );


  const ivBytes =
    new Uint8Array(
      ivBuffer
    );


  // ----------------------------------------------------------
  // Decode ciphertext
  // ----------------------------------------------------------

  const ciphertextBuffer =
    base64ToArrayBuffer(
      ciphertext
    );


  // ----------------------------------------------------------
  // AES-GCM decrypt
  // ----------------------------------------------------------

  const decryptedBuffer =
    await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: ivBytes
      },
      aesKey,
      ciphertextBuffer
    );


  // ----------------------------------------------------------
  // Convert bytes → text
  // ----------------------------------------------------------

  const decoder =
    new TextDecoder();

  const originalMessage =
    decoder.decode(
      decryptedBuffer
    );


  console.log(
    "Message decrypted successfully."
  );


  return originalMessage;
}