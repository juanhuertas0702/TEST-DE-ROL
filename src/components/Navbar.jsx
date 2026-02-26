import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Verificar si hay sesión al montar el componente y escuchar cambios
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      const user = localStorage.getItem('userData');
      
      if (loggedIn === 'true' && user) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(user));
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkAuth();

    // Escuchar evento custom de login
    const handleLoginEvent = () => {
      checkAuth();
    };

    // Escuchar evento custom de logout
    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setUserData(null);
      setShowDropdown(false);
    };

    window.addEventListener('userLoggedIn', handleLoginEvent);
    window.addEventListener('userLoggedOut', handleLogoutEvent);
    return () => {
      window.removeEventListener('userLoggedIn', handleLoginEvent);
      window.removeEventListener('userLoggedOut', handleLogoutEvent);
    };
  }, []);

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    
    // Actualizar estado
    setIsLoggedIn(false);
    setUserData(null);
    setShowDropdown(false);
    
    // Disparar evento custom para actualizar otros componentes
    window.dispatchEvent(new Event('userLoggedOut'));
    
    // Redirigir a home
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo y Título */}
      <Link to="/" style={styles.logoContainer}>
        <span style={styles.logo}>🎯</span>
        <h1 style={styles.title}>Test de Rol</h1>
      </Link>
      
      {/* Links de navegación central */}
      <div style={styles.navLinksContainer}>
      </div>

      {/* Botones a la derecha - Condicional según sesión */}
      <div style={styles.buttonContainer}>
        {isLoggedIn && userData ? (
          // Usuario logueado - Mostrar dropdown
          <div style={styles.userMenu}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                ...styles.userButton,
                backgroundColor: showDropdown ? 'rgba(102, 126, 234, 0.3)' : 'transparent'
              }}
              onMouseEnter={() => setActiveNavItem('user')}
              onMouseLeave={() => {
                if (!showDropdown) setActiveNavItem('');
              }}
            >
              <span style={styles.userIcon}>👤</span>
              <span style={styles.userName}>{userData.nombre}</span>
              <span style={{ marginLeft: '0.5rem' }}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownHeader}>
                  <span style={styles.dropdownTitle}>Sesión Activa</span>
                </div>
                <Link 
                  to="/test"
                  style={styles.dropdownItem}
                  onClick={() => setShowDropdown(false)}
                >
                  <span>🚀</span> Continuar Test
                </Link>
                {userData.es_admin && (
                  <>
                    <Link 
                      to="/admin"
                      style={styles.dropdownItem}
                      onClick={() => setShowDropdown(false)}
                    >
                      <span>⚙️</span> Panel Admin
                    </Link>
                  </>
                )}
                <div style={styles.dropdownDivider}></div>
                <button
                  onClick={handleLogout}
                  style={styles.dropdownLogout}
                >
                  <span>🚪</span> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          // Usuario no logueado - Mostrar botón de login
          <>
            <Link 
              to="/login"
              style={{
                ...styles.btnLogin,
                backgroundColor: activeNavItem === 'login' ? 'rgba(102, 126, 234, 0.2)' : 'transparent'
              }}
              onMouseEnter={() => setActiveNavItem('login')}
              onMouseLeave={() => setActiveNavItem('')}
            >
              🔐 Iniciar Sesión
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Estilos modernos y profesionales
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 3rem',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    color: '#2d3436',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '2px solid #667eea',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    textDecoration: 'none',
  },
  logo: {
    fontSize: '2.2rem',
    fontWeight: '700',
  },
  title: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2d3436',
    letterSpacing: '1px',
  },
  navLinksContainer: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    color: '#2d3436',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease-in-out',
    paddingBottom: '0.5rem',
    position: 'relative',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1.2rem',
    alignItems: 'center',
    position: 'relative',
  },
  btnLogin: {
    color: '#667eea',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease-in-out',
    border: '2px solid #667eea',
  },
  btnRegister: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textDecoration: 'none',
    padding: '11px 24px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease-in-out',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
    display: 'inline-block',
  },
  userMenu: {
    position: 'relative',
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    color: '#2d3436',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    border: '2px solid #667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  userIcon: {
    fontSize: '1.3rem',
  },
  userName: {
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
    minWidth: '220px',
    border: '1px solid #dfe6e9',
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownHeader: {
    padding: '12px 16px',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderBottom: '1px solid #dfe6e9',
  },
  dropdownTitle: {
    color: '#667eea',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '12px 16px',
    color: '#2d3436',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease-in-out',
    borderLeft: '3px solid transparent',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#dfe6e9',
    margin: '8px 0',
  },
  dropdownLogout: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    justifyContent: 'flex-start',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    color: '#d63031',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};

// Agregar animación CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  [style*="userButton"]:hover {
    border-color: #667eea;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }

  [style*="dropdownItem"]:hover {
    background-color: rgba(102, 126, 234, 0.08);
    border-left-color: #667eea;
  }

  [style*="dropdownLogout"]:hover {
    background-color: rgba(214, 48, 49, 0.08);
  }

  [style*="navLink"]:hover {
    color: #667eea;
  }

  [style*="btnLogin"]:hover {
    background-color: rgba(102, 126, 234, 0.1);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }

  [style*="btnRegister"]:hover {
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}

export default Navbar;

