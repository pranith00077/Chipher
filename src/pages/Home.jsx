function Home() {
  return (
    <section className="home">

      <div className="hero">

        <div className="hero-content">

          <div className="tag">
            SECURE COMMUNICATION
          </div>

          <h1>
            Your message.
            <br />
            <span>Your secret.</span>
          </h1>

          <p>
            CHiPER is a secure communication system that
            encrypts confidential messages and conceals the
            encrypted data inside ordinary images.
          </p>

          <div className="hero-actions">

            <button className="primary-button">
              Send Secure Message
            </button>

            <button className="secondary-button">
              Receive Message
            </button>

          </div>

        </div>

        <div className="security-panel">

          <div className="security-icon">
            🔐
          </div>

          <h2>
            Secure by Design
          </h2>

          <p>
            Encryption + Steganography
          </p>

          <div className="security-flow">

            <span>MESSAGE</span>
            <b>→</b>
            <span>ENCRYPT</span>
            <b>→</b>
            <span>IMAGE</span>

          </div>

          <div className="secure-status">

            <span className="status-dot"></span>

            Secure system ready

          </div>

        </div>

      </div>

    </section>
  );
}

export default Home;