import { useState } from 'react';

function Registro(props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');

  const manejarRegistro = async (e) => {
    e.preventDefault();
    const datos = { nombre: nombre, email: email, password: clave };
    try {
      const resp = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const resultado = await resp.json();
      if (resp.ok) {
        alert('Usuario registrado con éxito. Ahora puede iniciar sesión.');
        props.onSwitchToLogin(); // vuelve a login
      } else {
        alert('Error al registrar: ' + (resultado.error || 'Datos inválidos'));
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo registrar. Intente más tarde.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={manejarRegistro} style={styles.form}>
        <h2 style={styles.title}>Crear Cuenta</h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre completo:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Contraseña:</label>
          <input
            type="password"
            value={clave}
            onChange={e => setClave(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.primaryButton}>Registrarse</button>

        <button
          type="button"
          onClick={props.onSwitchToLogin}
          style={styles.secondaryButton}
        >
          Ir a Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '8px',
    width: '360px',
    margin: '40px auto',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '10px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    color: '#555',
    fontSize: '14px',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f1f1f1',
    outline: 'none',
  },
  primaryButton: {
    padding: '10px',
    backgroundColor: '#6c757d',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '10px',
    backgroundColor: '#e2e6ea',
    color: '#333',
    fontSize: '14px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default Registro;
