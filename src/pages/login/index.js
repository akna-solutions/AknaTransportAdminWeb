import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState < string > "";
  const [password, setPassword] = useState < string > "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email ve şifre zorunlu.");
      return;
    }

    console.log("Login request:", { email, password });
    // TODO: API call buraya gelecek
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Giriş Yap</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
