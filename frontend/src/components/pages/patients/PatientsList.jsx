import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { authFetch } from '../../../auth/authFetch';
import SearchBar from '../../molecules/SearchBar/SearchBar';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import CardBase from '../../atoms/CardBase/CardBase';
import CardContent from '../../atoms/CardContent/CardContent';
import CardHeader from '../../molecules/CardHeader/CardHeader';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Badge from '../../atoms/Badge/Badge';
import PatientFormModal from '../../organisms/PatientFormModal/PatientFormModal';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // This will be the debounced term for filtering
  const [inputValue, setInputValue] = useState(''); // This is the immediate value from the input
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    obra_social_id: '',
    metodo_pago: '',
    persona_referencia: ''
  });
  const [healthInsurances, setHealthInsurances] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [searchStats, setSearchStats] = useState(null);

  useEffect(() => {
    fetchPatients();
    fetchHealthInsurances();
    fetchFilterOptions();
  }, []);

  // Debounce for searchTerm
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchTerm(inputValue); // Update the actual search term after the delay
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId); // Clear timeout if inputValue changes before delay is met
    };
  }, [inputValue]); // This effect runs whenever inputValue changes


  const fetchPatients = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Agregar filtros avanzados si están activos
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim()) {
          queryParams.append(key, value.trim());
        }
      });
      
      const url = filters && Object.keys(filters).length > 0 
        ? `/api/patients?${queryParams.toString()}`
        : '/api/patients';
        
      const res = await authFetch(url);
      if (!res.ok) throw new Error('Error al cargar pacientes');
      const data = await res.json();
      setPatients(data);
      
      // Obtener estadísticas si hay filtros
      if (Object.keys(filters).length > 0) {
        fetchSearchStats(filters);
      } else {
        setSearchStats(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthInsurances = async () => {
    try {
      const res = await authFetch('/api/health-insurances');
      if (res.ok) {
        const data = await res.json();
        setHealthInsurances(data);
      }
    } catch (err) {
      console.error('Error al cargar obras sociales:', err);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const res = await authFetch('/api/patients/search/options');
      if (res.ok) {
        const data = await res.json();
        setFilterOptions(data);
      }
    } catch (err) {
      console.error('Error al cargar opciones de filtros:', err);
    }
  };

  const fetchSearchStats = async (filters) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim()) {
          queryParams.append(key, value.trim());
        }
      });
      
      const res = await authFetch(`/api/patients/search/stats?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSearchStats(data);
      }
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
    }
  };

  const handleSearchChange = (e) => {
    setInputValue(e.target.value || ''); // Update inputValue immediately
  };

  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdvancedSearch = () => {
    const activeFilters = {};
    Object.entries(advancedFilters).forEach(([key, value]) => {
      if (value && value.trim()) {
        activeFilters[key] = value.trim();
      }
    });
    fetchPatients(activeFilters);
  };

  const handleClearFilters = () => {
    setAdvancedFilters({
      dni: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      fecha_nacimiento: '',
      obra_social_id: '',
      metodo_pago: '',
      persona_referencia: ''
    });
    fetchPatients();
  };

  // filteredPatients now uses 'searchTerm' (the debounced value)
  // and is memoized
  const filteredPatients = useMemo(() => patients.filter(patient => {
    if (!searchTerm) return true; // searchTerm is the debounced value
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (patient.first_name || '').toLowerCase().includes(searchLower) ||
      (patient.last_name || '').toLowerCase().includes(searchLower) ||
      (patient.email || '').toLowerCase().includes(searchLower) ||
      (patient.phone || '').toLowerCase().includes(searchLower) ||
      (patient.address || '').toLowerCase().includes(searchLower) ||
      (patient.dni || '').toLowerCase().includes(searchLower)
    );
  }), [patients, searchTerm]); // Dependencies: patients and the debounced searchTerm


  if (loading) {
    return (
      <div>
        <h2>Gestión de Pacientes</h2>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Spinner size={32} color="primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Gestión de Pacientes</h2>
        <Alert type="error">{error}</Alert>
        <Button onClick={() => fetchPatients()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div>
      <h2>Gestión de Pacientes</h2>
      
      {/* Estadísticas de búsqueda */}
      {searchStats && (
        <CardBase style={{ marginBottom: '1rem' }}>
          <CardContent>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Badge variant="primary">{searchStats.total} pacientes encontrados</Badge>
              {searchStats.filters.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>Filtros aplicados:</span>
                  {searchStats.filters.map(filter => (
                    <Badge key={filter} variant="secondary">{filter}</Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </CardBase>
      )}
      
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <SearchBar
            placeholder="Búsqueda rápida por nombre, apellido, email, teléfono, dirección o DNI..."
            value={inputValue} /* Use inputValue for the text field */
            onChange={handleSearchChange}
            style={{ flex: 1 }}
          />
          <Button 
            onClick={() => setShowPatientModal(true)}
          >
            Nuevo Paciente
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            {showAdvancedSearch ? 'Ocultar' : 'Mostrar'} Búsqueda Avanzada
          </Button>
        </div>

        {showAdvancedSearch && (
          <CardBase>
            <CardHeader title="Búsqueda Avanzada" />
            <CardContent>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <FormGroup title="DNI">
                  <Input
                    type="text"
                    placeholder="DNI exacto"
                    value={advancedFilters.dni}
                    onChange={(e) => handleAdvancedFilterChange('dni', e.target.value)}
                  />
                </FormGroup>

                <FormGroup title="Nombre">
                  <Input
                    type="text"
                    placeholder="Nombre del paciente"
                    value={advancedFilters.nombre}
                    onChange={(e) => handleAdvancedFilterChange('nombre', e.target.value)}
                  />
                </FormGroup>

                <FormGroup title="Apellido">
                  <Input
                    type="text"
                    placeholder="Apellido del paciente"
                    value={advancedFilters.apellido}
                    onChange={(e) => handleAdvancedFilterChange('apellido', e.target.value)}
                  />
                </FormGroup>

                <FormGroup title="Email">
                  <Input
                    type="email"
                    placeholder="Email del paciente"
                    value={advancedFilters.email}
                    onChange={(e) => handleAdvancedFilterChange('email', e.target.value)}
                  />
                </FormGroup>

                <FormGroup title="Teléfono">
                  <Input
                    type="text"
                    placeholder="Teléfono del paciente"
                    value={advancedFilters.telefono}
                    onChange={(e) => handleAdvancedFilterChange('telefono', e.target.value)}
                  />
                </FormGroup>

                <FormGroup title="Dirección">
                  <Input
                    type="text"
                    placeholder="Dirección del paciente"
                    value={advancedFilters.direccion}
                    onChange={(e) => handleAdvancedFilterChange('direccion', e.target.value)}
                  />
                </FormGroup>

                <FormGroup title="Fecha de Nacimiento">
                  <Input
                    type="date"
                    value={advancedFilters.fecha_nacimiento}
                    onChange={(e) => handleAdvancedFilterChange('fecha_nacimiento', e.target.value)}
                  />
                </FormGroup>

                <FormGroup title="Obra Social">
                  <Select
                    value={advancedFilters.obra_social_id}
                    onChange={(e) => handleAdvancedFilterChange('obra_social_id', e.target.value)}
                  >
                    <option value="">Todas las obras sociales</option>
                    {healthInsurances.map(insurance => (
                      <option key={insurance.insurance_id} value={insurance.insurance_id}>
                        {insurance.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup title="Método de Pago">
                  <Select
                    value={advancedFilters.metodo_pago}
                    onChange={(e) => handleAdvancedFilterChange('metodo_pago', e.target.value)}
                  >
                    <option value="">Todos los métodos</option>
                    {filterOptions.paymentMethods?.map(method => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup title="Persona de Referencia">
                  <Input
                    type="text"
                    placeholder="Nombre o apellido de referencia"
                    value={advancedFilters.persona_referencia}
                    onChange={(e) => handleAdvancedFilterChange('persona_referencia', e.target.value)}
                  />
                </FormGroup>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={handleClearFilters}>
                  Limpiar Filtros
                </Button>
                <Button onClick={handleAdvancedSearch}>
                  Buscar
                </Button>
              </div>
            </CardContent>
          </CardBase>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
      }}>
        {filteredPatients.map(patient => (
          <CardBase
            key={patient.patient_id}
            style={{ cursor: 'pointer' }}
                          onClick={() => window.location.href = `/app/patients/${patient.patient_id}`}
          >
            <CardContent>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>
                {patient.first_name} {patient.last_name}
              </h3>
              
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                {patient.dni && (
                  <div>
                    <strong>DNI:</strong> {patient.dni}
                  </div>
                )}
                
                {patient.email && (
                  <div>
                    <strong>Email:</strong> {patient.email}
                  </div>
                )}
                
                {patient.phone && (
                  <div>
                    <strong>Teléfono:</strong> {patient.phone}
                  </div>
                )}
                
                {patient.date_of_birth && (
                  <div>
                    <strong>Fecha de Nacimiento:</strong> {new Date(patient.date_of_birth).toLocaleDateString('es-ES')}
                  </div>
                )}
                
                {patient.address && (
                  <div>
                    <strong>Dirección:</strong> {patient.address}
                  </div>
                )}
                
                {patient.preferred_payment_methods && (
                  <div>
                    <strong>Método de Pago:</strong> {patient.preferred_payment_methods}
                  </div>
                )}
              </div>
            </CardContent>
          </CardBase>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No se encontraron pacientes</p>
        </div>
      )}

      {/* Modal para nuevo paciente */}
      <PatientFormModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSuccess={(patientData) => {
          // Recargar la lista de pacientes
          fetchPatients();
          setShowPatientModal(false);
        }}
      />
    </div>
  );
};

export default PatientsList; 