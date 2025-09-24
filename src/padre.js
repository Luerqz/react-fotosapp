import React, { useState } from 'react';
import Login from './login';             // asumimos que los componentes están en archivos separados
import Registro from './registro';
import DisenoCamiseta from './camiseta';
import GaleriaCamisetas from './votar';

function App() {
  const [vistaActual, setVistaActual] = useState('login');
  const [token, setToken] = useState(null);

  // Cuando el login es exitoso:
  const handleLoginSuccess = (tokenRecibido) => {
    setToken(tokenRecibido);
    setVistaActual('diseno');   // pasamos a la vista principal de diseño
  };

  // Funciones para cambiar entre vistas (login/registro)
  const irARegistro = () => setVistaActual('registro');
  const irALogin = () => setVistaActual('login');

  // Cerrar sesión
  const handleLogout = () => {
    setToken(null);
    setVistaActual('login');
  };

  // Cambio a galería
  const irAGaleria = () => setVistaActual('galeria');

  // Volver de galería a diseño
  const volverADiseno = () => setVistaActual('diseno');

  return (
    <div className="App">
      {token ? (
        // Si hay token (usuario autenticado), mostrar la interfaz principal
        <>
          {vistaActual === 'diseno' && 
            <DisenoCamiseta token={token} onVerGaleria={irAGaleria} onLogout={handleLogout} />
          }
          {vistaActual === 'galeria' && 
            <GaleriaCamisetas token={token} onVolverDiseño={volverADiseno} onLogout={handleLogout} />
          }
        </>
      ) : (
        // Si no hay token, mostrar formulario de login o registro
        <>
          {vistaActual === 'login' && 
            <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={irARegistro} />
          }
          {vistaActual === 'registro' && 
            <Registro onSwitchToLogin={irALogin} />
          }
        </>
      )}
    </div>
  );
}

export default App;