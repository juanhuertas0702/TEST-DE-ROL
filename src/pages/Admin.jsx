import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ A: 0, B: 0, C: 0, D: 0 });

  // Verificar si el usuario es admin
  useEffect(() => {
    const user = localStorage.getItem('userData');
    if (!user) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(user);
    if (!userData.es_admin) {
      alert('No tienes permisos para acceder al panel de admin');
      navigate('/');
      return;
    }
    
    setUserData(userData);
    fetchTests(userData.postulante_id);
    fetchStats(userData.postulante_id);
  }, [navigate]);

  const fetchTests = async (adminId) => {
    try {
      setLoading(true);
      const response = await fetch('https://test-rol.onrender.com/api/postulantes/admin/tests/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-ID': adminId
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTests(data.resultados || []);
        setError('');
      } else {
        setError(data.error || 'Error al cargar los tests');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (adminId) => {
    try {
      const response = await fetch('https://test-rol.onrender.com/api/postulantes/admin/estadisticas/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-ID': adminId
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStats(data.perfiles || { A: 0, B: 0, C: 0, D: 0 });
      } else {
        console.error('Error al obtener estadísticas:', data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const exportarPruebas = () => {
    const dataStr = JSON.stringify(tests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pruebas_exportadas_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importarPruebas = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedTests = JSON.parse(e.target.result);
        
        if (!Array.isArray(importedTests)) {
          alert('El archivo debe contener un array de pruebas');
          return;
        }

        // Aquí podrías hacer una llamada al backend para guardar las pruebas importadas
        // Por ahora, simplemente las agregamos al estado local
        setTests([...tests, ...importedTests]);
        alert(`Se importaron ${importedTests.length} pruebas correctamente`);
      } catch (error) {
        alert('Error al procesar el archivo: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Cargando tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚙️ Panel de Administrador</h1>
        <p style={styles.subtitle}>Visualiza todos los tests enviados por los usuarios</p>
      </div>

      {/* Botones de acción */}
      <div style={styles.actionBar}>
        <button 
          onClick={exportarPruebas}
          style={styles.exportButton}
          disabled={tests.length === 0}
        >
          📥 Exportar Pruebas
        </button>
        <label style={styles.importButton}>
          📤 Importar Pruebas
          <input 
            type="file" 
            accept=".json"
            onChange={importarPruebas}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          <span>❌ {error}</span>
        </div>
      )}

      {tests.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <h2>No hay tests disponibles</h2>
          <p>Aún no se han enviado tests para revisar</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Puntaje</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test, index) => (
                <tr key={test.id} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                  <td style={styles.td}>{test.id}</td>
                  <td style={styles.td}>
                    <span style={styles.userName}>{test.postulante_nombre || 'N/A'}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.score}>{test.puntaje_total}</span>
                  </td>
                  <td style={styles.td}>{formatDate(test.fecha_prueba)}</td>
                  <td style={styles.td}>
                    <button 
                      style={styles.viewButton}
                      onClick={() => console.log('Ver detalles del test:', test)}
                    >
                      👁️ Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gráfico de distribución de roles */}
      <div style={styles.chartContainer}>
        <h2 style={styles.chartTitle}>Distribución de Perfiles</h2>
        <div style={styles.chartWrapper}>
          {['A', 'B', 'C', 'D'].map((role) => {
            const roleNames = {
              'A': 'Clarificador',
              'B': 'Ideador',
              'C': 'Desarrollador',
              'D': 'Implementador'
            };
            const maxValue = Math.max(...Object.values(stats), 1);
            const height = (stats[role] / maxValue) * 100;
            
            return (
              <div key={role} style={styles.barContainer}>
                <div style={styles.barLabel}>{roleNames[role]}</div>
                <div style={styles.barTrack}>
                  <div 
                    style={{
                      ...styles.bar,
                      height: `${height}%`,
                      backgroundColor: {
                        'A': '#667eea',
                        'B': '#f093fb',
                        'C': '#4facfe',
                        'D': '#43e97b'
                      }[role]
                    }}
                  ></div>
                </div>
                <div style={styles.barValue}>{stats[role]}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{tests.length}</div>
          <div style={styles.statLabel}>Tests Totales</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {tests.length > 0 ? (tests.reduce((sum, t) => sum + t.puntaje_total, 0) / tests.length).toFixed(1) : '0'}
          </div>
          <div style={styles.statLabel}>Puntaje Promedio</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {tests.length > 0 ? Math.max(...tests.map(t => t.puntaje_total)) : '0'}
          </div>
          <div style={styles.statLabel}>Puntaje Máximo</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '90vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '3rem 1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
  },
  actionBar: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '2rem',
    maxWidth: '1200px',
    margin: '0 auto 2rem',
  },
  exportButton: {
    padding: '12px 24px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    fontSize: '1rem',
  },
  importButton: {
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    fontSize: '1rem',
    display: 'inline-block',
  },
  errorAlert: {
    backgroundColor: '#ffe5e5',
    color: '#d63031',
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '2rem',
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    border: '2px solid #d63031',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    maxWidth: '1200px',
    margin: '0 auto 2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #667eea',
  },
  th: {
    padding: '1.2rem',
    textAlign: 'left',
    fontWeight: '700',
    color: '#2d3436',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.9rem',
  },
  td: {
    padding: '1rem 1.2rem',
    borderBottom: '1px solid #dfe6e9',
    color: '#2d3436',
  },
  tableRowEven: {
    backgroundColor: '#ffffff',
  },
  tableRowOdd: {
    backgroundColor: '#f8f9fa',
  },
  userName: {
    fontWeight: '600',
    color: '#667eea',
  },
  score: {
    backgroundColor: '#e8f5e9',
    color: '#27ae60',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontWeight: '700',
  },
  viewButton: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    color: 'white',
    fontSize: '1.2rem',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '3rem',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto 2rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#636e72',
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
  },
  chartTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  chartWrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '300px',
    gap: '2rem',
    padding: '2rem 0',
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    maxWidth: '120px',
  },
  barLabel: {
    fontWeight: '600',
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
    color: '#2d3436',
  },
  barTrack: {
    width: '100%',
    height: '250px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bar: {
    width: '80%',
    borderRadius: '8px 8px 0 0',
    transition: 'height 0.3s ease-in-out',
  },
  barValue: {
    marginTop: '0.5rem',
    fontWeight: '700',
    fontSize: '1.2rem',
    color: '#667eea',
  },
};

// Agregar animación CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}

export default Admin;
