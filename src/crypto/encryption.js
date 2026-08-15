// ============================================================
// CHIPER - MESSAGE ENCRYPTION
// ============================================================
//
// Hybrid encryption:
// 1. Generate a random AES-GCM key
// 2. Encrypt the message using AES-GCM
// 3. Encrypt the AES key using the receiver's RSA-OAEP key
//
// The final encrypted package contains:
// - encrypted AES key
// - AES IV
// - encrypted message
// ============================================================


// ============================================================
// ENCRYPT MESSAGE
// ============================================================

export async function encryptMessage(
  message,
  recipientPublicKey
) {

  if (!message) {
    throw new Error("Message cannot be empty.");
  }

  if (!recipientPublicKey) {
    throw new Error(
      "Recipient public key is required."
    );
  }


  // ----------------------------------------------------------
  // 1. Convert message to bytes
  // ----------------------------------------------------------

  const encoder = new TextEncoder();

  const messageData =
    encoder.encode(message);


  // ----------------------------------------------------------
  // 2. Generate random AES-256 key
  // ----------------------------------------------------------

  const aesKey =
    await window.crypto.subtle.generateKey(

      {
        name: "AES-GCM",
        length: 256
      },

      true,

      [
        "encrypt",
        "decrypt"
      ]
    );


  // ----------------------------------------------------------
  // 3. Generate random IV
  // ----------------------------------------------------------

  const iv =
    window.crypto.getRandomValues(
      new Uint8Array(12)
    );


  // ----------------------------------------------------------
  // 4. Encrypt message with AES-GCM
  // ----------------------------------------------------------

  const encryptedMessage =
    await window.crypto.subtle.encrypt(

      {
        name: "AES-GCM",
        iv: iv
      },

      aesKey,

      messageData
    );


  // ----------------------------------------------------------
  // 5. Export AES key
  // ----------------------------------------------------------

  const exportedAESKey =
    await window.crypto.subtle.exportKey(
      "raw",
      aesKey
    );


  // ----------------------------------------------------------
  // 6. Encrypt AES key using RSA public key
  // ----------------------------------------------------------

  const encryptedAESKey =
    await window.crypto.subtle.encrypt(

      {
        name: "RSA-OAEP"
      },

      recipientPublicKey,

      exportedAESKey
    );


  // ----------------------------------------------------------
  // 7. Convert everything to Base64
  // ----------------------------------------------------------

  const result = {

    encryptedKey:
      arrayBufferToBase64(
        encryptedAESKey
      ),

    iv:
      arrayBufferToBase64(
        iv
      ),

    ciphertext:
      arrayBufferToBase64(
        encryptedMessage
      )

  };


  // ----------------------------------------------------------
  // 8. Return encrypted package
  // ----------------------------------------------------------

  return result;
}



// ============================================================
// ARRAYBUFFER → BASE64
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