import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(Array(37).fill(0));
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapeo de preguntas a letras (A, B, C, D)
  const questionLetters = [
    'C', 'C', 'A', 'D', 'C', 'B', 'A', 'A', 'B', 'C',
    'C', 'D', 'C', 'B', 'A', 'B', 'B', 'A', 'D', 'A',
    'B', 'A', 'C', 'D', 'D', 'D', 'D', 'A', 'B', 'D',
    'C', 'A', 'C', 'B', 'B', 'C', 'D'
  ];

  // Mapeo de roles
  const roleMap = {
    A: { name: 'Clarificador', descripcion: 'Especialista en identifcar problemas y definir soluciones' },
    B: { name: 'Ideador', descripcion: 'Experto en generar ideas creativas e innovadoras' },
    C: { name: 'Desarrollador', descripcion: 'Profesional en transformar ideas en planes concretos' },
    D: { name: 'Implementador', descripcion: 'Especialista en ejecutar y concretar proyectos' }
  };

  useEffect(() => {
    // Verificar si hay datos del usuario en locationState o localStorage
    const user = location.state?.userData || JSON.parse(localStorage.getItem('userData'));
    
    if (user) {
      setUserData(user);
      setLoading(false);
    } else {
      // Si no hay sesión, redirigir a login
      navigate('/login');
    }
  }, [navigate, location]);

  // Convertir respuesta (1-10) a puntos (1-5)
  const convertResponseToScore = (response) => {
    if (response <= 2) return 1;
    if (response <= 4) return 2;
    if (response <= 6) return 3;
    if (response <= 8) return 4;
    return 5;
  };

  // Calcular puntuación por categoría
  const calculateScores = (responsesData) => {
    const scores = { A: 0, B: 0, C: 0, D: 0 };
    responsesData.forEach((response, index) => {
      const letter = questionLetters[index];
      const score = convertResponseToScore(response);
      scores[letter] += score;
    });
    return scores;
  };

  // Determinar el rol principal
  const determineRole = (scores) => {
    let maxScore = 0;
    let mainRole = 'A';
    
    Object.keys(scores).forEach(letter => {
      if (scores[letter] > maxScore) {
        maxScore = scores[letter];
        mainRole = letter;
      }
    });
    
    return { role: mainRole, scores };
  };

  const questions = [
    "Generalmente no me acerco a los problemas en forma creativa",
    "Me gusta probar y luego revisar mis ideas antes de generar la solución o el producto final",
    "Me gusta tomarme el tiempo para clarificar la naturaleza exacta del problema",
    "Disfruto de tomar los pasos necesarios para poner mis ideas en acción.",
    "Me gusta separar un problema amplio en partes para examinarlo desde todos los ángulos",
    "Tengo dificultad en tener ideas inusuales para resolver un problema",
    "Me gusta identificar los hechos mas relevantes relativos al problema",
    "No tengo el temperamento para tratar de aislar las causas especificas de un problema",
    "Disfruto de generar formas únicas de mirar un problema",
    "Me gusta generar todos los pros y los contras de una solución potencial",
    "Antes de implementar una solución me gusta separarla en pasos.",
    "Transformar ideas en acción no es lo que disfruto más",
    "Me gusta superar el criterio que puede usarse para identificar la mejor opción o solución",
    "Disfruto de pasar tiempo profundizando el analisis inicial del problema",
    "Por naturaleza no paso mucho tiempo emocionandome en definir el problema exacto a resolver",
    "Me gusta entender una situación al mirar el panorama general",
    "Disfruto de trabajar en problemas mal definidos y novedosos",
    "Cuando trabajo en un problema me gusta encontrar la mejor forma de enunciarlo",
    "Disfruto de hacer que las cosas se concreten",
    "Me gusta enfocarme en enunciar un problema en forma precisa",
    "Disfruto de usar mi imaginación para producir muchas ideas",
    "Me gusta enfocarme en la información clave de una situación desafiante",
    "Disfruto de tomarme el tiempo para perfeccionar una idea",
    "Me resulta difícil implementar mis ideas",
    "Disfruto de transformar ideas en bruto en soluciones concretas",
    "No paso el tiempo en todas las cosas que necesito hacer para implementar una idea",
    "Realmente disfruto de implementar una idea",
    "Antes de avanzar me gusta tener una clara comprensión del problema",
    "Me gusta trabajar con ideas únicas",
    "Disfruto de poner mis ideas en acción",
    "Me gusta explorar las fortalezas y debilidades de una solución potencial",
    "Disfruto de reunir información para identificar el origen de un problema particular",
    "Disfruto el análisis y el esfuerzo que lleva a transformar un concepto preliminar en una idea factible",
    "Mi tendencia natural no es generar muchas ideas para los problemas",
    "Encuentro que tengo poca paciencia para el esfuerzo que lleva pulir o refinar una idea",
    "Tiendo a buscar una solución rápida y luego implementarla",
    "Disfruto de usar metáforas y analogías para generar nuevas ideas para los problemas."
  ];

  const handleRatingChange = (value) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Verifica que todas las preguntas tengan respuesta
    if (responses.includes(0)) {
      alert('Por favor, responde todas las preguntas antes de enviar.');
      return;
    }

    // Calcular resultados
    const scores = calculateScores(responses);
    const { role, scores: finalScores } = determineRole(scores);
    
    // Guardar resultados
    setTestResults({
      role,
      scores: finalScores,
      roleName: roleMap[role].name,
      rolDescription: roleMap[role].descripcion,
      timestamp: new Date().toLocaleString('es-ES')
    });

    // Enviar datos al backend (opcional)
    try {
      await fetch('https://test-rol.onrender.com/api/postulantes/guardar-test/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postulante_id: userData.postulante_id,
          respuestas: responses,
          scores: finalScores,
          rol_principal: role,
        }),
      });
    } catch (error) {
      console.error('Error al guardar test:', error);
    }

    setTestCompleted(true);
  };

  if (testCompleted && testResults) {
    return (
      <div style={styles.container}>
        <div style={styles.resultsCard}>
          <div style={styles.resultsHeader}>
            <div style={styles.resultsIcon}>🎯</div>
            <h2 style={styles.resultsTitle}>¡Test Completado!</h2>
            <p style={styles.resultsGreeting}>Gracias, <strong>{userData.nombre}</strong></p>
          </div>

          {/* Rol Principal */}
          <div style={styles.mainRoleContainer}>
            <p style={styles.mainRoleLabel}>Tu Rol Principal:</p>
            <div style={styles.rolBadge}>
              <h3 style={styles.rolName}>{testResults.rolName}</h3>
              <p style={styles.rolDescription}>{testResults.rolDescription}</p>
            </div>
          </div>

          {/* Desglose de puntuación */}
          <div style={styles.scoresContainer}>
            <p style={styles.scoresTitle}>Desglose de Puntuación:</p>
            <div style={styles.scoresGrid}>
              {Object.entries(testResults.scores).map(([letter, score]) => {
                const rolName = roleMap[letter].name;
                return (
                  <div 
                    key={letter}
                    style={{
                      ...styles.scoreCard,
                      ...(letter === testResults.role ? styles.scoreCardActive : {})
                    }}
                  >
                    <p style={styles.scoreLetter}>{letter}</p>
                    <p style={styles.scoreValue}>{score} pts</p>
                    <p style={styles.scoreType}>{rolName}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Información adicional */}
          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              Tu perfil indica que tienes fortalezas como <strong>{testResults.rolName}</strong>. 
              Esto significa que tu forma natural de trabajar y pensar se alinea con las características de este rol.
            </p>
          </div>

          {/* Botones de acción */}
          <div style={styles.actionButtons}>
            <button 
              onClick={() => navigate('/')}
              style={styles.homeButton}
            >
              ← Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras se verifica la sesión
  if (loading || !userData) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Cargando tu evaluación...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.testCard}>
        {/* Header del test */}
        <div style={styles.header}>
          <h1 style={styles.title}>Test Psicotécnico de Rol</h1>
          <p style={styles.userGreeting}>¡Hola, {userData.nombre}!</p>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${((currentQuestion + 1) / questions.length) * 100}%`
              }}
            />
          </div>
          <p style={styles.progressText}>
            Pregunta {currentQuestion + 1} de {questions.length}
          </p>
        </div>

        {/* Pregunta actual */}
        <div style={styles.questionContainer}>
          <h3 style={styles.questionNumber}>Pregunta #{currentQuestion + 1}</h3>
          <p style={styles.questionText}>{questions[currentQuestion]}</p>

          {/* Escala de calificación */}
          <div style={styles.ratingContainer}>
            <p style={styles.ratingLabel}>
              ¿Qué tan de acuerdo estás? (1 = Totalmente en desacuerdo, 5 = Neutro, 10 = Totalmente de acuerdo)
            </p>
            <div style={styles.ratingScale}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRatingChange(value)}
                  style={{
                    ...styles.ratingButton,
                    ...(responses[currentQuestion] === value ? styles.ratingButtonActive : {})
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Labels para los extremos */}
          <div style={styles.ratingLabels}>
            <span style={styles.ratingLabelLeft}>En desacuerdo</span>
            <span style={styles.ratingLabelRight}>De acuerdo</span>
          </div>
        </div>

        {/* Botones de navegación */}
        <div style={styles.navigationContainer}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            style={{
              ...styles.navButton,
              ...(currentQuestion === 0 ? styles.navButtonDisabled : {})
            }}
          >
            ← Anterior
          </button>

          <div style={styles.responseIndicators}>
            {responses.map((response, index) => (
              <div
                key={index}
                style={{
                  ...styles.indicator,
                  ...(response > 0 ? styles.indicatorFilled : styles.indicatorEmpty),
                  ...(index === currentQuestion ? styles.indicatorActive : {})
                }}
                title={`Pregunta ${index + 1}: ${response > 0 ? `Calificación ${response}` : 'Sin respuesta'}`}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              style={styles.submitButton}
            >
              Enviar Test
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={styles.navButton}
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '2rem',
    paddingBottom: '3rem',
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  testCard: {
    backgroundColor: '#2d3436',
    borderRadius: '15px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7)',
    padding: '3rem',
    width: '100%',
    maxWidth: '800px',
    color: 'white',
  },
  header: {
    marginBottom: '3rem',
    textAlign: 'center',
    borderBottom: '2px solid #0984e3',
    paddingBottom: '2rem',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#00cec9',
  },
  userGreeting: {
    fontSize: '1.1rem',
    color: '#b2bec3',
    marginBottom: '1.5rem',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#636e72',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0984e3',
    transition: 'width 0.3s ease-in-out',
  },
  progressText: {
    fontSize: '0.9rem',
    color: '#b2bec3',
    margin: '0.5rem 0 0 0',
  },
  questionContainer: {
    marginBottom: '2rem',
  },
  questionNumber: {
    fontSize: '1rem',
    color: '#00cec9',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  questionText: {
    fontSize: '1.3rem',
    lineHeight: '1.6',
    color: '#ecf0f1',
    marginBottom: '2rem',
    fontWeight: '500',
  },
  ratingContainer: {
    backgroundColor: '#34495e',
    padding: '2rem',
    borderRadius: '10px',
    marginBottom: '1.5rem',
  },
  ratingLabel: {
    fontSize: '0.95rem',
    color: '#bdc3c7',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  ratingScale: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    flexWrap: 'wrap',
  },
  ratingButton: {
    flex: '1',
    minWidth: '45px',
    padding: '12px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    border: '2px solid #55596b',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  ratingButtonActive: {
    backgroundColor: '#0984e3',
    color: 'white',
    borderColor: '#0984e3',
    transform: 'scale(1.1)',
    boxShadow: '0 5px 15px rgba(9, 132, 227, 0.4)',
  },
  ratingLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#95a5a6',
    paddingTop: '0.5rem',
  },
  ratingLabelLeft: {
    marginLeft: '0',
  },
  ratingLabelRight: {
    marginRight: '0',
  },
  navigationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid #455a64',
  },
  navButton: {
    flex: '0 1 150px',
    padding: '12px 20px',
    backgroundColor: '#0984e3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  navButtonDisabled: {
    backgroundColor: '#636e72',
    cursor: 'not-allowed',
    opacity: '0.6',
  },
  submitButton: {
    flex: '0 1 150px',
    padding: '12px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  responseIndicators: {
    flex: '1',
    display: 'flex',
    useWrap: 'wrap',
    gap: '4px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    minWidth: '0',
  },
  indicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '1px solid #55596b',
    transition: 'all 0.2s ease-in-out',
    flexShrink: 0,
  },
  indicatorFilled: {
    backgroundColor: '#0984e3',
    borderColor: '#0984e3',
  },
  indicatorEmpty: {
    backgroundColor: 'transparent',
    borderColor: '#55596b',
  },
  indicatorActive: {
    transform: 'scale(1.4)',
    boxShadow: '0 0 8px rgba(9, 132, 227, 0.6)',
  },
  completedCard: {
    backgroundColor: '#2d3436',
    borderRadius: '15px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7)',
    padding: '4rem 3rem',
    width: '100%',
    maxWidth: '600px',
    color: 'white',
    textAlign: 'center',
  },
  completedIcon: {
    fontSize: '4rem',
    color: '#27ae60',
    marginBottom: '1.5rem',
  },
  completedTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#27ae60',
    marginBottom: '1rem',
  },
  completedMessage: {
    fontSize: '1.1rem',
    color: '#ecf0f1',
    marginBottom: '1rem',
    lineHeight: '1.6',
  },
  completedSubtext: {
    fontSize: '1rem',
    color: '#b2bec3',
    lineHeight: '1.6',
  },
  // Estilos para resultados
  resultsCard: {
    backgroundColor: '#2d3436',
    borderRadius: '15px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7)',
    padding: '3rem',
    width: '100%',
    maxWidth: '700px',
    color: 'white',
  },
  resultsHeader: {
    textAlign: 'center',
    marginBottom: '2.5rem',
    borderBottom: '2px solid #0984e3',
    paddingBottom: '2rem',
  },
  resultsIcon: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
  },
  resultsTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#00cec9',
    marginBottom: '0.5rem',
  },
  resultsGreeting: {
    fontSize: '1.1rem',
    color: '#b2bec3',
    margin: '0',
  },
  mainRoleContainer: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    border: '2px solid #667eea',
    textAlign: 'center',
  },
  mainRoleLabel: {
    color: '#00cec9',
    fontSize: '0.9rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: '1rem',
    letterSpacing: '0.5px',
  },
  rolBadge: {
    backgroundColor: '#0984e3',
    padding: '1.5rem',
    borderRadius: '10px',
  },
  rolName: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 0.5rem 0',
  },
  rolDescription: {
    fontSize: '1rem',
    color: '#ecf0f1',
    margin: '0',
    lineHeight: '1.5',
  },
  scoresContainer: {
    marginBottom: '2rem',
  },
  scoresTitle: {
    color: '#00cec9',
    fontSize: '1rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: '1rem',
    letterSpacing: '0.5px',
  },
  scoresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
  },
  scoreCard: {
    backgroundColor: '#34495e',
    padding: '1.5rem',
    borderRadius: '10px',
    textAlign: 'center',
    border: '2px solid #55596b',
    transition: 'all 0.3s ease-in-out',
  },
  scoreCardActive: {
    backgroundColor: '#0984e3',
    borderColor: '#00cec9',
    boxShadow: '0 8px 20px rgba(9, 132, 227, 0.4)',
    transform: 'scale(1.05)',
  },
  scoreLetter: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#00cec9',
    margin: '0 0 0.5rem 0',
  },
  scoreValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 0.5rem 0',
  },
  scoreType: {
    fontSize: '0.85rem',
    color: '#b2bec3',
    margin: '0',
  },
  infoBox: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    padding: '1.5rem',
    borderRadius: '10px',
    borderLeft: '4px solid #27ae60',
    marginBottom: '2rem',
  },
  infoText: {
    fontSize: '1rem',
    color: '#ecf0f1',
    lineHeight: '1.6',
    margin: '0',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  homeButton: {
    padding: '14px 30px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
  loadingCard: {
    backgroundColor: '#2d3436',
    borderRadius: '15px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7)',
    padding: '4rem 3rem',
    width: '100%',
    maxWidth: '400px',
    color: 'white',
    textAlign: 'center',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #636e72',
    borderTop: '4px solid #0984e3',
    borderRadius: '50%',
    margin: '0 auto 2rem',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '1.1rem',
    color: '#b2bec3',
  },
};

// Agregar animación CSS para el spinner
const loadingStyleSheet = document.createElement('style');
loadingStyleSheet.textContent = `
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(loadingStyleSheet);
}

export default Test;
