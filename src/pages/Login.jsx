import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const [esAdmin, setEsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    id_usuario: '',
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

  const handleToggleAdmin = () => {
    setEsAdmin(!esAdmin);
    setFormData({ nombre: '', id_usuario: '', contrasena: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const requestBody = {
        nombre: formData.nombre,
        es_admin: esAdmin
      };

      if (esAdmin) {
        requestBody.contrasena = formData.contrasena;
      } else {
        requestBody.id_usuario = formData.id_usuario;
      }

      const response = await fetch('https://test-rol.onrender.com/api/postulantes/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
    if (userData.es_admin) {
      navigate('/admin', { state: { userData } });
    } else {
      navigate('/test', { state: { userData } });
    }
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
              {userData.es_admin ? 'Acceso como Administrador' : 'Login exitoso. Ahora puedes iniciar el test psicotécnico.'}
            </p>
            <button 
              onClick={handleStartTest}
              style={styles.testButton}
              onMouseOver={(e) => e.target.style.backgroundColor = userData.es_admin ? '#5a3d9f' : '#1e7e34'}
              onMouseOut={(e) => e.target.style.backgroundColor = userData.es_admin ? '#667eea' : '#27ae60'}
            >
              {userData.es_admin ? '⚙️ Panel Admin' : '🚀 Iniciar Test'}
            </button>
            <button 
              onClick={() => {
                setLoginSuccess(false);
                setFormData({ nombre: '', id_usuario: '', contrasena: '' });
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
          <div style={styles.headerIcon}>{esAdmin ? '👮' : '🔐'}</div>
          <h2 style={styles.title}>Iniciar Sesión</h2>
          <p style={styles.subtitle}>{esAdmin ? 'Acceso de Administrador' : 'Accede a tu evaluación psicotécnica'}</p>
        </div>

        {/* Toggle Admin/Normal */}
        <div style={styles.toggleContainer}>
          <span style={{...styles.toggleLabel, opacity: esAdmin ? 0.5 : 1}}>👤 Usuario Normal</span>
          <button
            type="button"
            style={{...styles.toggle, backgroundColor: esAdmin ? '#667eea' : '#dfe6e9'}}
            onClick={handleToggleAdmin}
            disabled={loading}
          >
            <div style={{...styles.toggleDot, left: esAdmin ? '50%' : '2px'}}></div>
          </button>
          <span style={{...styles.toggleLabel, opacity: esAdmin ? 1 : 0.5}}>👮 Administrador</span>
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
              placeholder={esAdmin ? "Ej. María" : "Ej. Juan"}
              disabled={loading}
            />
          </div>
          
          {esAdmin ? (
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
          ) : (
            <div style={styles.inputGroup}>
              <label htmlFor="id_usuario" style={styles.label}>
                <span style={styles.labelIcon}>🆔</span>
                ID Usuario
              </label>
              <input
                type="text"
                id="id_usuario"
                name="id_usuario"
                value={formData.id_usuario}
                onChange={handleChange}
                style={styles.input}
                required
                placeholder="Ej. 12345"
                disabled={loading}
              />
            </div>
          )}
          
          <button 
            type="submit" 
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>

        <div style={styles.divider}></div>
        
        <div style={styles.credentialsContainer}>
          <div style={styles.credentialBox}>
            <h4 style={styles.credentialTitle}>👤 Usuario Normal</h4>
            <p style={styles.credentialText}>Nombre: <strong>Juan</strong></p>
            <p style={styles.credentialText}>ID: <strong>12345</strong></p>
          </div>
          <div style={styles.credentialBox}>
            <h4 style={styles.credentialTitle}>👮 Administrador</h4>
            <p style={styles.credentialText}>Usuario: <strong>María</strong></p>
            <p style={styles.credentialText}>Contraseña: <strong>12345</strong></p>
          </div>
        </div>
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
    maxWidth: '500px',
    color: '#2d3436',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
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
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: '#f0f3ff',
    borderRadius: '10px',
    border: '2px solid #667eea',
  },
  toggleLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2d3436',
    transition: 'opacity 0.3s ease-in-out',
  },
  toggle: {
    position: 'relative',
    width: '60px',
    height: '32px',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: '#dfe6e9',
  },
  toggleDot: {
    position: 'absolute',
    top: '2px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'white',
    transition: 'left 0.3s ease-in-out',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
    marginTop: '1rem',
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
  credentialsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  credentialBox: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #dfe6e9',
  },
  credentialTitle: {
    margin: '0 0 0.8rem 0',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#667eea',
  },
  credentialText: {
    margin: '0.4rem 0',
    fontSize: '0.85rem',
    color: '#636e72',
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