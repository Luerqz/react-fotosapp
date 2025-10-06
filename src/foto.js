import { useState, useEffect } from 'react';

function Foto(props) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [url, setUrl] = useState(null);
  const [usuario, setUsuario] = useState('');
  const [galeria, setGaleria] = useState([]); // Estado para la galería de fotos

  // Función para cargar las fotos ya guardadas
  const cargarGaleria = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/fotos', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + props.token },
      });
      const data = await resp.json();
      if (resp.ok) {
        setGaleria(data); // Guardamos las fotos en el estado
      } else {
        alert('Error al cargar las fotos');
      }
    } catch (error) {
      console.error('Error al cargar las fotos:', error);
      alert('Error al conectar al servidor.');
    }
  };

  // Llamamos a cargarGaleria cada vez que el componente se monta
  useEffect(() => {
    cargarGaleria();
  }, []);

  const guardarFoto = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("imagen", url); // Aquí agregamos el archivo
    formData.append("usuario", usuario);

    try {
      const resp = await fetch('http://localhost:3000/api/fotos', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + props.token },
        body: formData
      });
      const data = await resp.json();
      if (resp.ok) {
        alert('¡Foto guardada exitosamente!');
        cargarGaleria(); // Volver a cargar las fotos después de agregar una nueva
      } else {
        alert('No se pudo guardar la foto: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error en guardarFoto:', error);
      alert('Error de conexión al guardar foto.');
    }
  };

  const eliminarFoto = async (id) => {
    try {
      const resp = await fetch(`http://localhost:3000/api/fotos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + props.token },
      });
      const data = await resp.json();
      if (resp.ok) {
        alert('Foto eliminada exitosamente');
        cargarGaleria(); // Volver a cargar las fotos después de eliminar
      } else {
        alert('No se pudo eliminar la foto: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al eliminar la foto:', error);
      alert('Error de conexión al eliminar foto.');
    }
  };

  const editarFoto = async (id, nuevaImagen) => {
    const formData = new FormData();
    formData.append("imagen", nuevaImagen); // Nueva imagen a reemplazar
    try {
      const resp = await fetch(`http://localhost:3000/api/fotos/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + props.token },
        body: formData
      });
      const data = await resp.json();
      if (resp.ok) {
        alert('Foto actualizada exitosamente');
        cargarGaleria(); // Volver a cargar las fotos después de editar
      } else {
        alert('No se pudo actualizar la foto: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al editar la foto:', error);
      alert('Error de conexión al editar foto.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Subir Foto</h2> 
      <form onSubmit={guardarFoto} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Título:</label><br/>
          <input 
            type="text" 
            value={titulo} 
            onChange={e => setTitulo(e.target.value)} 
            required 
            style={styles.input} 
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Descripción:</label><br/>
          <input 
            type="text" 
            value={descripcion} 
            onChange={e => setDescripcion(e.target.value)} 
            required 
            style={styles.input} 
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Imagen:</label><br/>
          <input 
            type="file" 
            onChange={e => setUrl(e.target.files[0])}
            required 
            style={styles.inputFile} 
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Usuario:</label><br/>
          <input 
            type="text" 
            value={usuario} 
            onChange={e => setUsuario(e.target.value)} 
            required 
            style={styles.input} 
          />
        </div>
        <button type="submit" style={styles.submitButton}>Guardar Foto</button>
      </form>

      <div style={styles.gallery}>
        <h3 style={styles.galleryTitle}>Galería de Fotos</h3>
        <div style={styles.galleryGrid}>
          {galeria.length > 0 ? (
            galeria.map((foto) => (
              <div key={foto._id} style={styles.galleryItem}>
                <img 
                  src={`http://localhost:3000${foto.url}`} 
                  alt={foto.titulo} 
                  style={styles.galleryImage} 
                />
                <p>{foto.titulo}</p>
                <button 
                  onClick={() => eliminarFoto(foto._id)} 
                  style={styles.deleteButton}
                >
                  Eliminar
                </button>
                <input 
                  type="file" 
                  onChange={e => editarFoto(foto._id, e.target.files[0])}
                  style={styles.inputFile}
                />
              </div>
            ))
          ) : (
            <p>No hay fotos en la galería.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    margin: '0 auto',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    color: '#555',
    fontSize: '14px',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#f1f1f1',
  },
  inputFile: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    backgroundColor: '#f1f1f1',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  gallery: {
    marginTop: '30px',
  },
  galleryTitle: {
    fontSize: '18px',
    textAlign: 'center',
    color: '#333',
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 imágenes por fila
    gap: '15px',
    marginTop: '15px',
  },
  galleryItem: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  galleryImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '5px',
  },
  deleteButton: {
    marginTop: '10px',
    padding: '5px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },

  // Media Queries for responsiveness
  '@media (max-width: 768px)': {
    galleryGrid: {
      gridTemplateColumns: 'repeat(1, 1fr)', // 1 imagen por fila en pantallas pequeñas
    },
  },
};

export default Foto;
