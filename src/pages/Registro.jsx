import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();
  
  // 1. Estado para guardar los datos que escribe el usuario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    documento: '',
    contrasena: '',
  });
  const [loading, setLoading] = useState(false);
  const [registroSuccess, setRegistroSuccess] = useState(false);
  const [userData, setUserData] = useState(null);

  // 2. Función que se ejecuta cada vez que el usuario escribe en un campo
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // Actualiza el campo correspondiente
    });
  };

  // 3. Función que se ejecuta al hacer clic en "Registrarse"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setLoading(true);
    
    try {
      // Hacemos la petición POST al backend de Django
      const response = await fetch('https://test-rol.onrender.com/api/postulantes/registro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Convertimos los datos del frontend al formato que espera tu modelo en Django
        body: JSON.stringify({
          nombre_completo: formData.nombre, // Emparejamos 'nombre' con 'nombre_completo'
          correo: formData.correo,
          documento: formData.documento,
          contrasena: formData.contrasena,
        }),
      });

      if (response.ok) {
        // Si el servidor responde con éxito (código 201 Created)
        const data = await response.json();
        
        // Guardar datos del usuario en localStorage
        const userData = {
          nombre: formData.nombre,
          postulante_id: data.postulante_id || data.id
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        // Disparar evento custom para actualizar el Navbar
        window.dispatchEvent(new Event('userLoggedIn'));
        
        setUserData(userData);
        setRegistroSuccess(true);
        console.log('Registro exitoso:', data);
        
        // Limpiar el formulario después del éxito
        setFormData({ nombre: '', correo: '', documento: '', contrasena: '' });
        
      } else {
        const errorData = await response.json();
        console.error('Detalles del error:', errorData);
        
        // Revisamos si el error viene del documento o del correo
        if (errorData.documento) {
          alert('Este documento ya está registrado en el sistema.');
        } else if (errorData.correo) {
          alert('Este correo electrónico ya está en uso.');
        } else {
          alert('Hubo un error al registrarse. Revisa los datos.');
        }
      }
    } catch (error) {
      // Si el servidor de Django está apagado o hay un problema de red
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor. ¿Está encendido Django?');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito después del registro
  if (registroSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.formCard}>
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.successTitle}>¡Registro Exitoso!</h2>
            <p style={styles.successMessage}>
              ¡Bienvenido, <strong>{userData.nombre}</strong>!<br/>
              Tu cuenta ha sido creada exitosamente.
            </p>
            <button 
              onClick={() => navigate('/test', { state: { userData } })}
              style={styles.testButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1e7e34'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
            >
              🚀 Iniciar Test Ahora
            </button>
            <button 
              onClick={() => {
                setRegistroSuccess(false);
                navigate('/');
              }}
              style={styles.backButton}
            >
              ← Volver al Inicio
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
          <div style={styles.headerIcon}>✨</div>
          <h2 style={styles.title}>Crear Cuenta</h2>
          <p style={styles.subtitle}>Ingresa tus datos para comenzar la evaluación</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Campo Nombre */}
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
          
          {/* Campo Correo */}
          <div style={styles.inputGroup}>
            <label htmlFor="correo" style={styles.label}>
              <span style={styles.labelIcon}>📧</span>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              style={styles.input}
              required
              placeholder="Ej. juan@email.com"
              disabled={loading}
            />
          </div>
          
          {/* Campo Documento */}
          <div style={styles.inputGroup}>
            <label htmlFor="documento" style={styles.label}>
              <span style={styles.labelIcon}>🪪</span>
              Documento de Identidad
            </label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              style={styles.input}
              required
              placeholder="Ej. 123456789"
              disabled={loading}
            />
          </div>

          {/* Campo Contraseña */}
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
              placeholder="Crea una contraseña segura"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit"
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div style={styles.divider}></div>
        
        <p style={styles.registerText}>
          ¿Ya tienes cuenta? <a href="/login" style={styles.registerLink}>Inicia sesión aquí</a>
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
    minHeight: '100vh',
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

export default Registro;