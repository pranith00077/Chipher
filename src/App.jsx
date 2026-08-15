import React, { useState } from "react";

import {
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey
} from "./crypto/keyManager";

import {
  encryptMessage
} from "./crypto/encryption";

import {
  decryptMessage
} from "./crypto/decryption";

import {
  encodeMessageIntoImage
} from "./steganography/encode";

import {
  decodeMessageFromImage
} from "./steganography/decode";


function App() {

  // =========================================================
  // PAGE STATE
  // =========================================================

  const [page, setPage] = useState("home");


  // =========================================================
  // KEY STATE
  // =========================================================

  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const [keyLoading, setKeyLoading] = useState(false);


  // =========================================================
  // SEND STATE
  // =========================================================

  const [recipientPublicKey, setRecipientPublicKey] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [coverImage, setCoverImage] =
    useState(null);

  const [encryptedData, setEncryptedData] =
    useState("");

  const [encryptionLoading, setEncryptionLoading] =
    useState(false);


  // =========================================================
  // RECEIVE STATE
  // =========================================================

  const [chiperImage, setChiperImage] =
    useState(null);

  const [receiverPrivateKey, setReceiverPrivateKey] =
    useState("");

  const [extractedData, setExtractedData] =
    useState("");

  const [decryptedMessage, setDecryptedMessage] =
    useState("");

  const [decryptionLoading, setDecryptionLoading] =
    useState(false);


  // =========================================================
  // GENERATE KEY PAIR
  // =========================================================

  const handleGenerateKeys = async () => {

    try {

      setKeyLoading(true);

      console.log(
        "Generating RSA-OAEP key pair..."
      );


      const keyPair =
        await generateKeyPair();


      const exportedPublicKey =
        await exportPublicKey(
          keyPair.publicKey
        );


      const exportedPrivateKey =
        await exportPrivateKey(
          keyPair.privateKey
        );


      setPublicKey(
        exportedPublicKey
      );


      setPrivateKey(
        exportedPrivateKey
      );


      console.log(
        "Key pair generated successfully."
      );


      alert(
        "✅ Key pair generated successfully!"
      );

    }

    catch (error) {

      console.error(
        "Key generation failed:",
        error
      );


      alert(
        "❌ Failed to generate keys.\n\n" +
        error.message
      );

    }

    finally {

      setKeyLoading(false);

    }

  };


  // =========================================================
  // COPY PUBLIC KEY
  // =========================================================

  const handleCopyPublicKey = async () => {

    if (!publicKey) {

      alert(
        "Generate your keys first."
      );

      return;

    }


    try {

      await navigator.clipboard.writeText(
        publicKey
      );


      alert(
        "✅ Public key copied!"
      );

    }

    catch (error) {

      console.error(
        "Failed to copy public key:",
        error
      );

      alert(
        "Failed to copy public key."
      );

    }

  };


  // =========================================================
  // COPY PRIVATE KEY
  // =========================================================

  const handleCopyPrivateKey = async () => {

    if (!privateKey) {

      alert(
        "Generate your keys first."
      );

      return;

    }


    try {

      await navigator.clipboard.writeText(
        privateKey
      );


      alert(
        "✅ Private key copied!"
      );

    }

    catch (error) {

      console.error(
        "Failed to copy private key:",
        error
      );

      alert(
        "Failed to copy private key."
      );

    }

  };


  // =========================================================
  // SEND IMAGE SELECT
  // =========================================================

  const handleImageSelect = (event) => {

    const file =
      event.target.files?.[0];


    if (!file) {

      return;

    }


    if (!file.type.startsWith("image/")) {

      alert(
        "Please select a valid image."
      );

      return;

    }


    setCoverImage(file);

    console.log(
      "Cover image selected:",
      file.name
    );

  };


  // =========================================================
  // ENCRYPT + HIDE MESSAGE
  // =========================================================

  const handleEncryptMessage = async () => {

    try {

      // ------------------------------------------------------
      // Validate recipient public key
      // ------------------------------------------------------

      if (!recipientPublicKey.trim()) {

        alert(
          "Please enter the recipient's public key."
        );

        return;

      }


      // ------------------------------------------------------
      // Validate message
      // ------------------------------------------------------

      if (!message.trim()) {

        alert(
          "Please enter a confidential message."
        );

        return;

      }


      // ------------------------------------------------------
      // Validate image
      // ------------------------------------------------------

      if (!coverImage) {

        alert(
          "Please select a cover image."
        );

        return;

      }


      setEncryptionLoading(true);

      setEncryptedData("");


      // ======================================================
      // STEP 1
      // IMPORT RECIPIENT PUBLIC KEY
      // ======================================================

      console.log(
        "STEP 1: Importing recipient public key..."
      );


      const recipientKey =
        await importPublicKey(
          recipientPublicKey.trim()
        );


      console.log(
        "STEP 1 COMPLETE"
      );


      // ======================================================
      // STEP 2
      // ENCRYPT MESSAGE
      // ======================================================

      console.log(
        "STEP 2: Encrypting message..."
      );


      const encrypted =
        await encryptMessage(
          message,
          recipientKey
        );


      console.log(
        "STEP 2 COMPLETE"
      );


      console.log(
        "Encrypted object:",
        encrypted
      );


      // ======================================================
      // STEP 3
      // CREATE ENCRYPTED PACKAGE
      // ======================================================

      const encryptedPackage =
        JSON.stringify(
          encrypted
        );


      setEncryptedData(
        encryptedPackage
      );


      console.log(
        "STEP 3 COMPLETE"
      );


      // ======================================================
      // STEP 4
      // HIDE DATA INSIDE IMAGE
      // ======================================================

      console.log(
        "STEP 4: Hiding encrypted data..."
      );


      const chiperImage =
        await encodeMessageIntoImage(
          coverImage,
          encryptedPackage
        );


      console.log(
        "STEP 4 COMPLETE"
      );


      // ======================================================
      // STEP 5
      // DOWNLOAD CHIPER IMAGE
      // ======================================================

      console.log(
        "STEP 5: Downloading CHiPER image..."
      );


      const downloadURL =
        URL.createObjectURL(
          chiperImage
        );


      const link =
        document.createElement("a");


      link.href =
        downloadURL;


      link.download =
        "chiper-image.png";


      document.body.appendChild(
        link
      );


      link.click();


      document.body.removeChild(
        link
      );


      setTimeout(() => {

        URL.revokeObjectURL(
          downloadURL
        );

      }, 1000);


      console.log(
        "STEP 5 COMPLETE"
      );


      alert(
        "✅ Message encrypted and hidden inside the image!"
      );

    }

    catch (error) {

      console.error(
        "================================================"
      );

      console.error(
        "CHIPER SEND ERROR"
      );

      console.error(
        error
      );

      console.error(
        "================================================"
      );


      alert(
        "❌ Operation failed.\n\n" +
        error.message
      );

    }

    finally {

      setEncryptionLoading(false);

    }

  };


  // =========================================================
  // RECEIVE IMAGE SELECT
  // =========================================================

  const handleChiperImageSelect = (event) => {

    const file =
      event.target.files?.[0];


    if (!file) {

      return;

    }


    if (!file.type.startsWith("image/")) {

      alert(
        "Please select a valid image."
      );

      return;

    }


    setChiperImage(file);

    setExtractedData("");

    setDecryptedMessage("");


    console.log(
      "CHiPER image selected:",
      file.name
    );

  };


  // =========================================================
  // EXTRACT + DECRYPT
  // =========================================================

  const handleExtractAndDecrypt = async () => {

    try {

      // ------------------------------------------------------
      // Validate image
      // ------------------------------------------------------

      if (!chiperImage) {

        alert(
          "Please select a CHiPER image."
        );

        return;

      }


      // ------------------------------------------------------
      // Validate private key
      // ------------------------------------------------------

      if (!receiverPrivateKey.trim()) {

        alert(
          "Please enter the receiver's private key."
        );

        return;

      }


      setDecryptionLoading(true);

      setExtractedData("");

      setDecryptedMessage("");


      // ======================================================
      // STEP 1
      // EXTRACT HIDDEN DATA
      // ======================================================

      console.log(
        "STEP 1: Extracting hidden data from image..."
      );


      const extractedPackage =
        await decodeMessageFromImage(
          chiperImage
        );


      console.log(
        "STEP 1 COMPLETE"
      );


      console.log(
        "Extracted package:",
        extractedPackage
      );


      // Convert object to formatted JSON
      const extractedJSON =
        JSON.stringify(
          extractedPackage,
          null,
          2
        );


      setExtractedData(
        extractedJSON
      );


      // ======================================================
      // STEP 2
      // IMPORT RECEIVER PRIVATE KEY
      // ======================================================

      console.log(
        "STEP 2: Importing receiver private key..."
      );


      const receiverKey =
        await importPrivateKey(
          receiverPrivateKey.trim()
        );


      console.log(
        "STEP 2 COMPLETE"
      );


      // ======================================================
      // STEP 3
      // DECRYPT MESSAGE
      // ======================================================

      console.log(
        "STEP 3: Decrypting message..."
      );


      const originalMessage =
        await decryptMessage(
          extractedPackage,
          receiverKey
        );


      console.log(
        "STEP 3 COMPLETE"
      );


      setDecryptedMessage(
        originalMessage
      );


      alert(
        "✅ Message successfully decrypted!"
      );

    }

    catch (error) {

      console.error(
        "================================================"
      );

      console.error(
        "CHIPER RECEIVE ERROR"
      );

      console.error(
        error
      );

      console.error(
        "================================================"
      );


      setDecryptedMessage("");


      alert(
        "❌ Could not decrypt the message.\n\n" +
        "Make sure:\n" +
        "1. This is a valid CHiPER image.\n" +
        "2. You are using the correct private key.\n" +
        "3. The image was not modified after encryption.\n\n" +
        "Error: " +
        error.message
      );

    }

    finally {

      setDecryptionLoading(false);

    }

  };


  // =========================================================
  // CLEAR SEND FORM
  // =========================================================

  const handleClearSendForm = () => {

    setRecipientPublicKey("");

    setMessage("");

    setCoverImage(null);

    setEncryptedData("");

  };


  // =========================================================
  // CLEAR RECEIVE FORM
  // =========================================================

  const handleClearReceiveForm = () => {

    setChiperImage(null);

    setReceiverPrivateKey("");

    setExtractedData("");

    setDecryptedMessage("");

  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="app">


      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav className="navbar">

        <div
          className="logo"
          onClick={() => setPage("home")}
        >

          CHI<span>PER</span>

        </div>


        <div className="nav-links">

          <button
            onClick={() => setPage("home")}
            className={
              page === "home"
                ? "active"
                : ""
            }
          >
            Home
          </button>


          <button
            onClick={() => setPage("send")}
            className={
              page === "send"
                ? "active"
                : ""
            }
          >
            Send
          </button>


          <button
            onClick={() => setPage("receive")}
            className={
              page === "receive"
                ? "active"
                : ""
            }
          >
            Receive
          </button>


          <button
            onClick={() => setPage("keys")}
            className={
              page === "keys"
                ? "active"
                : ""
            }
          >
            My Keys
          </button>

        </div>

      </nav>


      {/* =====================================================
          HOME
      ====================================================== */}

      {page === "home" && (

        <main className="hero">

          <div className="hero-content">

            <div className="tag">
              SECURE COMMUNICATION
            </div>


            <h1>

              Your message.

              <br />

              <span>
                Your secret.
              </span>

            </h1>


            <p>

              CHiPER protects confidential
              communication by encrypting
              your message and concealing
              the encrypted data inside an
              ordinary image.

            </p>


            <div className="buttons">

              <button
                className="primary"
                onClick={() => setPage("send")}
              >
                🔐 Send Secure Message
              </button>


              <button
                className="secondary"
                onClick={() => setPage("receive")}
              >
                🔓 Receive Message
              </button>

            </div>

          </div>


          <div className="security-card">

            <div className="lock">
              🔐
            </div>


            <h2>
              Secure Communication
            </h2>


            <p>

              Your message is encrypted
              before it leaves your device.

            </p>


            <div className="flow">

              <span>
                MESSAGE
              </span>

              <b>
                →
              </b>

              <span>
                ENCRYPT
              </span>

              <b>
                →
              </b>

              <span>
                IMAGE
              </span>

            </div>


            <div className="status">

              <span className="dot"></span>

              Chiper system ready

            </div>

          </div>

        </main>

      )}


      {/* =====================================================
          SEND PAGE
      ====================================================== */}

      {page === "send" && (

        <main className="page">

          <div className="tag">
            SECURE SENDING
          </div>


          <h1>
            Send Secure Message
          </h1>


          <p>

            Encrypt your confidential message
            and hide it inside an image.

          </p>


          <div className="card">


            <label>
              Recipient Public Key
            </label>


            <textarea
              value={recipientPublicKey}
              onChange={(event) =>
                setRecipientPublicKey(
                  event.target.value
                )
              }
              placeholder="Paste the receiver's public key here..."
            />


            <label>
              Confidential Message
            </label>


            <textarea
              className="message-box"
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              placeholder="Enter your confidential message..."
            />


            <label>
              Select Cover Image
            </label>


            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageSelect}
            />


            {coverImage && (

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "13px"
                }}
              >

                Selected image:{" "}

                <strong>
                  {coverImage.name}
                </strong>

              </p>

            )}


            <button
              className="primary send-button"
              onClick={handleEncryptMessage}
              disabled={encryptionLoading}
            >

              {encryptionLoading
                ? "Encrypting & Hiding..."
                : "🔐 Encrypt & Hide"
              }

            </button>


            <button
              className="secondary"
              onClick={handleClearSendForm}
              style={{
                marginTop: "10px"
              }}
            >

              Clear

            </button>


            {encryptedData && (

              <div className="result">

                <div>
                  ENCRYPTED DATA
                </div>


                <textarea
                  value={encryptedData}
                  readOnly
                  style={{
                    minHeight: "220px",
                    marginTop: "10px"
                  }}
                />


                <p
                  style={{
                    marginTop: "15px"
                  }}
                >

                  ✅ Encryption successful.

                  <br />

                  ✅ Encrypted data hidden
                  inside the image.

                  <br />

                  🖼️ CHiPER image downloaded.

                </p>

              </div>

            )}

          </div>

        </main>

      )}


      {/* =====================================================
          RECEIVE PAGE
      ====================================================== */}

      {page === "receive" && (

        <main className="page">

          <div className="tag">
            SECURE RECEIVING
          </div>


          <h1>
            Receive Message
          </h1>


          <p>

            Extract the hidden encrypted message
            from a CHiPER image and decrypt it.

          </p>


          <div className="card">


            {/* -------------------------------------------------
                CHiPER IMAGE
            -------------------------------------------------- */}

            <label>
              Select CHiPER Image
            </label>


            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleChiperImageSelect}
            />


            {chiperImage && (

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "13px"
                }}
              >

                Selected image:{" "}

                <strong>
                  {chiperImage.name}
                </strong>

              </p>

            )}


            {/* -------------------------------------------------
                PRIVATE KEY
            -------------------------------------------------- */}

            <label>
              Receiver Private Key
            </label>


            <textarea
              value={receiverPrivateKey}
              onChange={(event) =>
                setReceiverPrivateKey(
                  event.target.value
                )
              }
              placeholder="Paste the receiver's private key here..."
            />


            <p
              style={{
                fontSize: "12px",
                opacity: 0.7,
                marginTop: "5px"
              }}
            >

              🔒 Your private key is required
              to decrypt the message.

            </p>


            {/* -------------------------------------------------
                EXTRACT + DECRYPT
            -------------------------------------------------- */}

            <button
              className="primary send-button"
              onClick={handleExtractAndDecrypt}
              disabled={decryptionLoading}
            >

              {decryptionLoading
                ? "Extracting & Decrypting..."
                : "🔓 Extract & Decrypt"
              }

            </button>


            {/* -------------------------------------------------
                CLEAR
            -------------------------------------------------- */}

            <button
              className="secondary"
              onClick={handleClearReceiveForm}
              style={{
                marginTop: "10px"
              }}
            >

              Clear

            </button>


            {/* -------------------------------------------------
                EXTRACTED DATA
            -------------------------------------------------- */}

            {extractedData && (

              <div
                className="result"
                style={{
                  marginTop: "20px"
                }}
              >

                <div>
                  EXTRACTED ENCRYPTED DATA
                </div>


                <textarea
                  value={extractedData}
                  readOnly
                  style={{
                    minHeight: "180px",
                    marginTop: "10px"
                  }}
                />

              </div>

            )}


            {/* -------------------------------------------------
                DECRYPTED MESSAGE
            -------------------------------------------------- */}

            {decryptedMessage && (

              <div
                className="result"
                style={{
                  marginTop: "20px"
                }}
              >

                <div>
                  🔓 DECRYPTED MESSAGE
                </div>


                <div
                  style={{
                    marginTop: "15px",
                    padding: "20px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word"
                  }}
                >

                  {decryptedMessage}

                </div>


                <p
                  style={{
                    marginTop: "15px"
                  }}
                >

                  ✅ Only the receiver with
                  the correct private key
                  can decrypt this message.

                </p>

              </div>

            )}

          </div>

        </main>

      )}


      {/* =====================================================
          MY KEYS PAGE
      ====================================================== */}

      {page === "keys" && (

        <main className="page">

          <div className="tag">
            CRYPTOGRAPHIC IDENTITY
          </div>


          <h1>
            My Keys
          </h1>


          <p>

            Generate a cryptographic key pair
            for secure communication.

          </p>


          <div className="card">

            <div className="key-icon">
              🔑
            </div>


            <h2>
              Key Pair
            </h2>


            <p>

              Your public key can be shared
              with other users.

              <br />

              Your private key must remain secret.

            </p>


            <button
              className="primary"
              onClick={handleGenerateKeys}
              disabled={keyLoading}
            >

              {keyLoading
                ? "Generating..."
                : "Generate Key Pair"
              }

            </button>


            {publicKey && (

              <div className="key-output">


                {/* PUBLIC KEY */}

                <label>
                  YOUR PUBLIC KEY
                </label>


                <textarea
                  value={publicKey}
                  readOnly
                />


                <button
                  className="secondary"
                  onClick={handleCopyPublicKey}
                  style={{
                    marginTop: "10px"
                  }}
                >

                  Copy Public Key

                </button>


                {/* PRIVATE KEY */}

                <label>
                  YOUR PRIVATE KEY
                </label>


                <textarea
                  value={privateKey}
                  readOnly
                />


                <button
                  className="secondary"
                  onClick={handleCopyPrivateKey}
                  style={{
                    marginTop: "10px"
                  }}
                >

                  Copy Private Key

                </button>


                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    borderRadius: "8px",
                    background: "rgba(255, 80, 80, 0.08)"
                  }}
                >

                  ⚠️ Never share your private key.

                  <br />

                  Anyone with your private key
                  could potentially decrypt messages
                  intended for you.

                </div>

              </div>

            )}

          </div>

        </main>

      )}

    </div>

  );

}


export default App;