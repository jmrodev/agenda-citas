import React, { useState, useEffect } from 'react';

const HealthInsuranceComponent = () => {
  const [obrasSociales, setObrasSociales] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingObra, setEditingObra] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    telefono: '',
    email: '',
    direccion: '',
    sitioWeb: '',
    cobertura: '',
    observaciones: ''
  });

  useEffect(() => {
    // Cargar obras sociales desde localStorage
    const savedObras = localStorage.getItem('obrasSociales');
    if (savedObras) {
      setObrasSociales(JSON.parse(savedObras));
    } else {
      // Datos iniciales de ejemplo
      const obrasIniciales = [
        {
          id: '1',
          nombre: 'OSDE',
          codigo: 'OSDE',
          telefono: '0810-333-3673',
          email: 'info@osde.com.ar',
          direccion: 'Av. Leandro N. Alem 1067, CABA',
          sitioWeb: 'https://www.osde.com.ar',
          cobertura: 'Nacional',
          observaciones: 'Obra social líder en Argentina',
          fechaCreacion: new Date().toISOString()
        },
        {
          id: '2',
          nombre: 'Swiss Medical',
          codigo: 'SWISS',
          telefono: '0810-777-7794',
          email: 'info@swissmedical.com.ar',
          direccion: 'Av. Corrientes 3195, CABA',
          sitioWeb: 'https://www.swissmedical.com.ar',
          cobertura: 'Nacional',
          observaciones: 'Cobertura integral de salud',
          fechaCreacion: new Date().toISOString()
        },
        {
          id: '3',
          nombre: 'Galeno',
          codigo: 'GALENO',
          telefono: '0810-888-4253',
          email: 'info@galeno.com.ar',
          direccion: 'Av. Santa Fe 1843, CABA',
          sitioWeb: 'https://www.galeno.com.ar',
          cobertura: 'Nacional',
          observaciones: 'Especializada en medicina prepaga',
          fechaCreacion: new Date().toISOString()
        }
      ];
      setObrasSociales(obrasIniciales);
      localStorage.setItem('obrasSociales', JSON.stringify(obrasIniciales));
    }
  }, []);

  const handleSave = () => {
    if (editingObra) {
      // Actualizar obra social existente
      const updatedObras = obrasSociales.map(obra =>
        obra.id === editingObra.id
          ? { ...obra, ...formData, fechaModificacion: new Date().toISOString() }
          : obra
      );
      setObrasSociales(updatedObras);
      localStorage.setItem('obrasSociales', JSON.stringify(updatedObras));
    } else {
      // Agregar nueva obra social
      const nuevaObra = {
        id: Date.now().toString(),
        ...formData,
        fechaCreacion: new Date().toISOString()
      };
      const updatedObras = [...obrasSociales, nuevaObra];
      setObrasSociales(updatedObras);
      localStorage.setItem('obrasSociales', JSON.stringify(updatedObras));
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta obra social?')) {
      const updatedObras = obrasSociales.filter(obra => obra.id !== id);
      setObrasSociales(updatedObras);
      localStorage.setItem('obrasSociales', JSON.stringify(updatedObras));
    }
  };

  const handleEdit = (obra) => {
    setEditingObra(obra);
    setFormData({
      nombre: obra.nombre,
      codigo: obra.codigo,
      telefono: obra.telefono,
      email: obra.email,
      direccion: obra.direccion,
      sitioWeb: obra.sitioWeb,
      cobertura: obra.cobertura,
      observaciones: obra.observaciones
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingObra(null);
    setFormData({
      nombre: '',
      codigo: '',
      telefono: '',
      email: '',
      direccion: '',
      sitioWeb: '',
      cobertura: '',
      observaciones: ''
    });
  };

  const handleAddNew = () => {
    setEditingObra(null);
    setFormData({
      nombre: '',
      codigo: '',
      telefono: '',
      email: '',
      direccion: '',
      sitioWeb: '',
      cobertura: '',
      observaciones: ''
    });
    setShowAddModal(true);
  };

  const filteredObras = obrasSociales.filter(obra =>
    obra.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '1rem'
        }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>
            🏥 Gestión de Obras Sociales
          </h1>
          <button
            onClick={handleAddNew}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ➕ Agregar Obra Social
          </button>
        </div>

        {/* Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{obrasSociales.length}</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Total Obras Sociales</p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
              {obrasSociales.filter(obra => obra.cobertura === 'Nacional').length}
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Cobertura Nacional</p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
              {obrasSociales.filter(obra => obra.sitioWeb).length}
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Con Sitio Web</p>
          </div>
        </div>

        {/* Buscador */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="🔍 Buscar obra social por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          />
        </div>

        {/* Lista de Obras Sociales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredObras.map(obra => (
            <div key={obra.id} style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #e9ecef',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    color: '#2c3e50',
                    fontSize: '1.3rem',
                    fontWeight: '600'
                  }}>
                    {obra.nombre}
                  </h3>
                  <p style={{
                    margin: 0,
                    color: '#6c757d',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    Código: {obra.codigo}
                  </p>
                </div>
                <div style={{
                  background: '#28a745',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {obra.cobertura}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                {obra.telefono && (
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    📞 {obra.telefono}
                  </p>
                )}
                {obra.email && (
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    ✉️ {obra.email}
                  </p>
                )}
                {obra.direccion && (
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    📍 {obra.direccion}
                  </p>
                )}
                {obra.sitioWeb && (
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    🌐 {obra.sitioWeb}
                  </p>
                )}
              </div>

              {obra.observaciones && (
                <p style={{
                  margin: '0.5rem 0',
                  color: '#6c757d',
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
                }}>
                  {obra.observaciones}
                </p>
              )}

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1rem'
              }}>
                <button
                  onClick={() => handleEdit(obra)}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(obra.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredObras.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6c757d'
          }}>
            <h3>No se encontraron obras sociales</h3>
            <p>Intenta con otros términos de búsqueda o agrega una nueva obra social.</p>
          </div>
        )}
      </div>

      {/* Modal para Agregar/Editar */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              borderBottom: '2px solid #e9ecef',
              paddingBottom: '1rem'
            }}>
              <h2 style={{ margin: 0, color: '#2c3e50' }}>
                {editingObra ? '✏️ Editar Obra Social' : '➕ Agregar Obra Social'}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    Nombre: *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                    placeholder="Ej: OSDE"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    Código: *
                  </label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    required
                    placeholder="Ej: OSDE"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    Teléfono:
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    placeholder="Ej: 0810-333-3673"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Ej: info@osde.com.ar"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  Dirección:
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  placeholder="Ej: Av. Leandro N. Alem 1067, CABA"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    Sitio Web:
                  </label>
                  <input
                    type="url"
                    value={formData.sitioWeb}
                    onChange={(e) => setFormData({...formData, sitioWeb: e.target.value})}
                    placeholder="Ej: https://www.osde.com.ar"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    Cobertura:
                  </label>
                  <select
                    value={formData.cobertura}
                    onChange={(e) => setFormData({...formData, cobertura: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Seleccionar cobertura</option>
                    <option value="Nacional">Nacional</option>
                    <option value="Provincial">Provincial</option>
                    <option value="Local">Local</option>
                    <option value="Internacional">Internacional</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  Observaciones:
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Información adicional sobre la obra social..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ❌ Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  💾 {editingObra ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthInsuranceComponent; 