import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    contrasena: ''
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://test-rol.onrender.com/api/postulantes/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          contrasena: formData.contrasena
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setLoginSuccess(true);
        // Guardar datos del usuario en localStorage
        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('isLoggedIn', 'true');
        // Disparar evento custom para actualizar el Navbar
        window.dispatchEvent(new Event('userLoggedIn'));
        console.log('Login exitoso. ID del usuario:', data.postulante_id);
      } else {
        setError(data.error || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    navigate('/test', { state: { userData } });
  };

  if (loginSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.formCard}>
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.successTitle}>¡Bienvenido!</h2>
            <p style={styles.successMessage}>
              ¡Hola <strong>{userData.nombre}</strong>!<br/>
              Login exitoso. Ahora puedes iniciar el test psicotécnico.
            </p>
            <button 
              onClick={handleStartTest}
              style={styles.testButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1e7e34'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
            >
              🚀 Iniciar Test
            </button>
            <button 
              onClick={() => {
                setLoginSuccess(false);
                setFormData({ nombre: '', contrasena: '' });
              }}
              style={styles.backButton}
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>🔐</div>
          <h2 style={styles.title}>Iniciar Sesión</h2>
          <p style={styles.subtitle}>Accede a tu evaluación psicotécnica</p>
        </div>
        
        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠</span>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="nombre" style={styles.label}>
              <span style={styles.labelIcon}>👤</span>
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              style={styles.input}
              required
              placeholder="Ej. Juan Pérez"
              disabled={loading}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label htmlFor="contrasena" style={styles.label}>
              <span style={styles.labelIcon}>🔑</span>
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              style={styles.input}
              required
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>

        <div style={styles.divider}></div>
        
        <p style={styles.registerText}>
          ¿No tienes cuenta? <a href="/registro" style={styles.registerLink}>Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

// --- Estilos Profesionales y Modernos ---
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    minHeight: '90vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: '3rem',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '450px',
    color: '#2d3436',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
    borderBottom: '2px solid #667eea',
    paddingBottom: '2rem',
  },
  headerIcon: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '1rem',
  },
  title: {
    textAlign: 'center',
    marginBottom: '0.5rem',
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2d3436',
  },
  subtitle: {
    textAlign: 'center',
    color: '#636e72',
    marginBottom: '0',
    fontSize: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
  },
  label: {
    fontWeight: '600',
    fontSize: '1rem',
    color: '#2d3436',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  labelIcon: {
    fontSize: '1.2rem',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '10px',
    border: '2px solid #dfe6e9',
    backgroundColor: '#f8f9fa',
    color: '#2d3436',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease-in-out',
    fontFamily: 'inherit',
  },
  button: {
    marginTop: '1.5rem',
    padding: '14px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    backgroundColor: '#ffe5e5',
    color: '#d63031',
    padding: '12px 15px',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    borderLeft: '4px solid #d63031',
  },
  errorIcon: {
    fontSize: '1.3rem',
  },
  divider: {
    height: '1px',
    backgroundColor: '#dfe6e9',
    margin: '2rem 0',
  },
  registerText: {
    textAlign: 'center',
    fontSize: '0.95rem',
    color: '#636e72',
  },
  registerLink: {
    color: '#667eea',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'color 0.3s ease-in-out',
  },
  successContainer: {
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '3.5rem',
    color: '#27ae60',
    display: 'block',
    marginBottom: '1rem',
    animation: 'scaleIn 0.6s ease-in-out',
  },
  successTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#27ae60',
    marginBottom: '1rem',
  },
  successMessage: {
    fontSize: '1rem',
    color: '#636e72',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  testButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 8px 20px rgba(39, 174, 96, 0.3)',
  },
  backButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#dfe6e9',
    color: '#2d3436',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  }
};

export default Login;