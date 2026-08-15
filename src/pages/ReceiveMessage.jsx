function ReceiveMessage() {
  return (
    <section className="page">

      <div className="page-header">

        <div className="tag">
          SECURE RECEIVING
        </div>

        <h1>
          Receive Message
        </h1>

        <p>
          Upload a Chiper image and decrypt the hidden
          confidential message.
        </p>

      </div>

      <div className="message-card">

        <label>
          Chiper Image
        </label>

        <input
          type="file"
          accept="image/png,image/jpeg"
        />

        <button className="primary-button send-button">
          🔓 Extract & Decrypt
        </button>

        <div className="decrypted-message">

          <div className="message-label">
            DECRYPTED MESSAGE
          </div>

          <p>
            Your decrypted message will appear here.
          </p>

        </div>

      </div>

    </section>
  );
}

export default ReceiveMessage;