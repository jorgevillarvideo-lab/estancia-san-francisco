'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginAdmin() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || 'Error al ingresar');
        setCargando(false);
        return;
      }
      router.push('/gestion-7k2m9p/dashboard');
    } catch (err) {
      setError('No se pudo conectar. Probá de nuevo.');
      setCargando(false);
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <img src="/logo.png" alt="Estancia San Francisco" style={styles.logo} />
          <h1 style={styles.titulo}>Panel de gestión</h1>
          <p style={styles.sub}>Sucursal El Cano · Av. El Cano 3202</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            <span style={styles.labelText}>Usuario</span>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoFocus
              autoComplete="username"
              style={styles.input}
              disabled={cargando}
            />
          </label>

          <label style={styles.label}>
            <span style={styles.labelText}>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={styles.input}
              disabled={cargando}
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            style={{ ...styles.boton, opacity: cargando ? 0.6 : 1 }}
            disabled={cargando || !usuario || !password}
          >
            {cargando ? 'Verificando...' : 'Ingresar →'}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    background: '#0F0F0F',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '3rem 1.25rem',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '24rem',
    background: '#FFFFFF',
    padding: '2rem 1.5rem',
    position: 'relative',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
  },
  brand: {
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px dashed #d8d4c8',
  },
  logo: {
    width: '160px',
    height: 'auto',
    marginBottom: '1rem',
  },
  titulo: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#0F0F0F',
    margin: '0 0 0.4rem',
    letterSpacing: '-0.02em',
  },
  sub: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: '#5c5c5c',
    margin: 0,
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  labelText: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: '#0F0F0F',
    fontWeight: 600,
  },
  input: {
    border: '1px solid #d8d4c8',
    background: '#fff',
    padding: '0.75rem',
    fontFamily: 'inherit',
    fontSize: '1rem',
    color: '#0F0F0F',
    outline: 'none',
  },
  error: {
    background: 'rgba(200, 32, 44, 0.1)',
    borderLeft: '3px solid #C8202C',
    padding: '0.6rem 0.8rem',
    color: '#C8202C',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  boton: {
    background: '#0F0F0F',
    color: '#fff',
    border: 'none',
    padding: '0.9rem',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
};
