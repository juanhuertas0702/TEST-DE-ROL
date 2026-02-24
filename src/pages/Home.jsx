import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está logueado
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleStartTest = () => {
    navigate('/test');
  };

  return (
    <div style={styles.container}>
      {/* Sección Hero */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.heroIcon}>🎯</div>
          <h1 style={styles.heroTitle}>Sistema de Evaluación Psicotécnica</h1>
          <p style={styles.heroSubtitle}>
            Descubre tu perfil de pensamiento y recibe una evaluación personalizada con el Test de Rol
          </p>
          
          <div style={styles.ctaButtons}>
            {!isLoggedIn ? (
              <>
                <Link to="/registro" style={styles.ctaPrimary}>
                  Comenzar Ahora ✨
                </Link>
                <Link to="/login" style={styles.ctaSecondary}>
                  Ya tengo cuenta 🔐
                </Link>
              </>
            ) : (
              <button onClick={handleStartTest} style={styles.ctaPrimary}>
                Ir al Test 🚀
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Sección de Características */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>¿Cómo funciona?</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Información */}
      <section style={styles.infoSection}>
        <div style={styles.infoContent}>
          <h2 style={styles.infoTitle}>Evaluación Integral de Habilidades</h2>
          <p style={styles.infoText}>
            Nuestro test psicotécnico está diseñado para evaluar tus habilidades cognitivas, 
            tu perfil de pensamiento y tu capacidad para resolver problemas. Consiste en 37 preguntas 
            cuidadosamente seleccionadas que te permitirán conocer mejor tu forma de pensar y actuar.
          </p>
          <div style={styles.infoStats}>
            <div style={styles.stat}>
              <p style={styles.statNumber}>37</p>
              <p style={styles.statLabel}>Preguntas</p>
            </div>
            <div style={styles.stat}>
              <p style={styles.statNumber}>10</p>
              <p style={styles.statLabel}>Escala</p>
            </div>
            <div style={styles.stat}>
              <p style={styles.statNumber}>∞</p>
              <p style={styles.statLabel}>Precisión</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          &copy; 2025 Sistema de Evaluación Psicotécnica. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: '📱',
    title: 'Fácil de Usar',
    description: 'Interfaz intuitiva y simple para completar tu evaluación en pocos minutos.'
  },
  {
    icon: '🎯',
    title: 'Preciso',
    description: 'Metodología científica para evaluar tu perfil de pensamiento de manera confiable.'
  },
  {
    icon: '⚡',
    title: 'Rápido',
    description: 'Completa el test en tu propio ritmo, sin presiones ni límites de tiempo.'
  },
  {
    icon: '📊',
    title: 'Resultados Inmediatos',
    description: 'Recibe un análisis detallado de tu perfil y recomendaciones personalizadas.'
  }
];

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#ecf0f1',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '6rem 2rem',
    textAlign: 'center',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    maxWidth: '700px',
    animation: 'slideInDown 0.6s ease-in-out',
  },
  heroIcon: {
    fontSize: '5rem',
    marginBottom: '1rem',
    animation: 'bounce 2s infinite',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '1rem',
    color: '#ffffff',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '2.5rem',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.6',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '16px 40px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '700',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    display: 'inline-block',
  },
  ctaSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '16px 40px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '700',
    transition: 'all 0.3s ease-in-out',
    border: '2px solid white',
    display: 'inline-block',
  },
  featuresSection: {
    padding: '5rem 2rem',
    backgroundColor: '#16213e',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '3rem',
    color: '#00cec9',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    backgroundColor: '#2d3436',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease-in-out',
    border: '1px solid #3f4e5e',
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#00cec9',
  },
  featureDescription: {
    fontSize: '1rem',
    color: '#bdc3c7',
    lineHeight: '1.6',
  },
  infoSection: {
    padding: '5rem 2rem',
    backgroundColor: '#1a1a2e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '500px',
  },
  infoContent: {
    maxWidth: '900px',
    textAlign: 'center',
  },
  infoTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    color: '#00cec9',
  },
  infoText: {
    fontSize: '1.1rem',
    color: '#bdc3c7',
    lineHeight: '1.8',
    marginBottom: '3rem',
  },
  infoStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  stat: {
    padding: '2rem',
    backgroundColor: '#2d3436',
    borderRadius: '10px',
    border: '2px solid #667eea',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#00cec9',
    margin: '0',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#bdc3c7',
    marginTop: '0.5rem',
  },
  footer: {
    backgroundColor: '#0f0f1e',
    padding: '2rem',
    textAlign: 'center',
    borderTop: '1px solid #3f4e5e',
  },
  footerText: {
    color: '#95a5a6',
    fontSize: '0.9rem',
  },
};

// Agregar animaciones CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}

export default Home;
