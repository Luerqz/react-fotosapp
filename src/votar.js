import { useState, useEffect } from 'react';

function GaleriaCamisetas(props) {
  const [camisetas, setCamisetas] = useState([]);

  useEffect(() => {
    // Al montar el componente, obtener la lista de camisetas
    const fetchCamisetas = async () => {
      try {
        const resp = await fetch('http://localhost:8080/api/camisetas');
        const data = await resp.json();
        if (resp.ok) {
          setCamisetas(data);  // data se asume que es un array de camisetas
        } else {
          console.error('Error al cargar camisetas:', data);
        }
      } catch(error) {
        console.error('Error de red al cargar camisetas:', error);
      }
    };
    fetchCamisetas();
  }, []);  // [] hace que solo se ejecute una vez al inicio

  const votarCamiseta = async (id) => {
    try {
      const resp = await fetch(`http://localhost:3000/api/camisetas/vota/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token 
        },
        body: JSON.stringify({ calificacion: 1 })
      });
      const data = await resp.json();
      if (resp.ok) {
        // Actualizar la camiseta correspondiente en el estado con la nueva calificación
        setCamisetas(prevCamisetas => prevCamisetas.map(c => 
          c._id === id ? { ...c, calificacion: data.calificacion } : c
        ));
      } else {
        alert('No se pudo votar: ' + (data.error || 'Error desconocido'));
      }
    } catch(error) {
      console.error('Error al votar camiseta:', error);
      alert('Error de conexión al intentar votar.');
    }
  };

  return (
    <div>
      <h2>Galería de Camisetas</h2>
      {camisetas.length === 0 ? (
        <p>No hay diseños de camisetas todavía.</p>
      ) : (
        <div>
          {camisetas.map(c => (
            <div key={c._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
              {/* Miniatura SVG de la camiseta */}
              <svg width="100" viewBox="1 2 26 14" xmlns="http://www.w3.org/2000/svg">
                <path d="M 4 8 M 5 3 L 5 6 L 3 7 L 1 5" fill={c.mangaIzqColor} />
                <path d="M 9 5 L 7 3 L 5 3 L 5 6 L 5 12 L 13 12 L 13 6 L 13 3 L 11 3" fill={c.torsoColor} />
                <path d="M 13 6 L 13 3 L 17 5 L 15 7" fill={c.mangaDerColor} />
              </svg>
              <p><b>Diseño #{c._id.slice(-4)}</b></p>
              <p>Calificación: {c.calificacion}</p>
              <button onClick={() => votarCamiseta(c._id)}>👍 Me gusta</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={props.onVolverDiseño}>Volver a Diseñar</button>
      <button onClick={props.onLogout}>Cerrar Sesión</button>
    </div>
  );
}
export default GaleriaCamisetas;