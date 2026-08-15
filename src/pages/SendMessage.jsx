function SendMessage() {
  return (
    <section className="page">

      <div className="page-header">

        <div className="tag">
          SECURE SENDING
        </div>

        <h1>
          Send Message
        </h1>

        <p>
          Encrypt your message and hide the encrypted
          payload inside an image.
        </p>

      </div>

      <div className="message-card">

        <label>
          Recipient Public Key
        </label>

        <textarea
          placeholder="Paste the recipient's public key here..."
        ></textarea>

        <label>
          Confidential Message
        </label>

        <textarea
          className="message-input"
          placeholder="Type your confidential message..."
        ></textarea>

        <label>
          Cover Image
        </label>

        <input
          type="file"
          accept="image/png,image/jpeg"
        />

        <button className="primary-button send-button">
          🔐 Encrypt & Hide Message
        </button>

      </div>

    </section>
  );
}

export default SendMessage;