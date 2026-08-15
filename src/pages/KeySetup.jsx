function KeySetup() {
  return (
    <section className="page">

      <div className="page-header">

        <div className="tag">
          CRYPTOGRAPHIC IDENTITY
        </div>

        <h1>
          My Keys
        </h1>

        <p>
          Generate and manage your Chiper public and
          private key pair.
        </p>

      </div>

      <div className="key-card">

        <div className="key-icon">
          🔑
        </div>

        <h2>
          Create Your Key Pair
        </h2>

        <p>
          Chiper will generate a public key for sharing
          and a private key that remains on your device.
        </p>

        <button className="primary-button">
          Generate Key Pair
        </button>

      </div>

    </section>
  );
}

export default KeySetup;