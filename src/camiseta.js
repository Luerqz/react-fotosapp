import { useState } from 'react';

function DisenoCamiseta(props) {
  // Estado para los colores de cada parte de la camiseta
  const [colorMangaIzq, setColorMangaIzq] = useState('#000000');   // negro
  const [colorTorso, setColorTorso] = useState('#000000');
  const [colorMangaDer, setColorMangaDer] = useState('#000000');

  const guardarDiseno = async () => {
    // Construir objeto de diseño con los colores actuales
    const nuevoDiseno = {
      mangaIzqColor: colorMangaIzq,
      torsoColor: colorTorso,
      mangaDerColor: colorMangaDer
    };
    try {
      const resp = await fetch('http://localhost:3000/api/camisetas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token 
        },
        body: JSON.stringify(nuevoDiseno)
      });
      const data = await resp.json();
      if (resp.ok) {
        alert('¡Diseño guardado exitosamente!');
        // (Opcionalmente podríamos limpiar o cambiar a la vista de galería)
      } else {
        alert('No se pudo guardar el diseño: ' + (data.error || 'Error desconocido'));
      }
    } catch(error) {
      console.error('Error en guardarDiseno:', error);
      alert('Error de conexión al guardar diseño.');
    }
  };

  return (
    <div>
      <h2>Diseñar Camiseta</h2>
      {/* SVG de la camiseta con partes coloreadas según el estado */}
      <svg width="200" viewBox="1 2 26 14" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M 4 8 M 5 3 L 5 6 L 3 7 L 1 5" 
          fill={colorMangaIzq} 
          className="parte-camiseta"
        />
        <path 
          d="M 9 5 L 7 3 L 5 3 L 5 6 L 5 12 L 13 12 L 13 6 L 13 3 L 11 3" 
          fill={colorTorso}
          className="parte-camiseta"
        />
        <path 
          d="M 13 6 L 13 3 L 17 5 L 15 7" 
          fill={colorMangaDer}
          className="parte-camiseta"
        />
      </svg>

      {/* Controles para elegir colores */}
      <div>
        <label>Color Manga Izquierda: </label>
        <input type="color" value={colorMangaIzq} onChange={e => setColorMangaIzq(e.target.value)} />
      </div>
      <div>
        <label>Color Torso: </label>
        <input type="color" value={colorTorso} onChange={e => setColorTorso(e.target.value)} />
      </div>
      <div>
        <label>Color Manga Derecha: </label>
        <input type="color" value={colorMangaDer} onChange={e => setColorMangaDer(e.target.value)} />
      </div>

      <button onClick={guardarDiseno}>Guardar Diseño</button>
      <button onClick={props.onVerGaleria}>Ver Galería de Camisetas</button>
      <button onClick={props.onLogout}>Cerrar Sesión</button>
    </div>
  );
}
export default DisenoCamiseta;