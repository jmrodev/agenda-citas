// Script de prueba para verificar funcionalidades
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';

async function testCitas() {
  console.log('=== Test de Funcionalidades de Citas ===\n');

  try {
    // 1. Cargar citas existentes
    console.log('1. Cargando citas existentes...');
    const response = await fetch(`${API_BASE}/citas`);
    const data = await response.json();
    const citas = Array.isArray(data) ? data : data.citas || [];
    console.log(`✅ Citas cargadas: ${citas.length} citas\n`);

    if (citas.length === 0) {
      console.log('❌ No hay citas para probar. Creando una cita de prueba...');
      
      // Crear una cita de prueba
      const nuevaCita = {
        nombre: 'Cita de Prueba',
        fecha: new Date().toISOString(),
        notas: 'Esta es una cita de prueba para testing'
      };
      
      const createResponse = await fetch(`${API_BASE}/citas/agregar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cita: nuevaCita })
      });
      
      const createdCita = await createResponse.json();
      console.log('✅ Cita de prueba creada:', createdCita.cita.id);
      
      // Recargar citas
      const reloadResponse = await fetch(`${API_BASE}/citas`);
      const reloadData = await reloadResponse.json();
      const reloadCitas = Array.isArray(reloadData) ? reloadData : reloadData.citas || [];
      console.log(`✅ Citas recargadas: ${reloadCitas.length} citas\n`);
      
      return reloadCitas;
    }

    return citas;
  } catch (error) {
    console.error('❌ Error al cargar citas:', error.message);
    return [];
  }
}

async function testEditarCita(citaId) {
  console.log(`2. Probando edición de cita ${citaId}...`);
  
  try {
    const datosActualizados = {
      title: 'Cita Editada - ' + new Date().toLocaleTimeString(),
      notes: 'Notas actualizadas - ' + new Date().toLocaleTimeString()
    };
    
    const response = await fetch(`${API_BASE}/citas/${citaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datosActualizados })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Cita editada exitosamente:', result.message);
      return true;
    } else {
      console.log('❌ Error al editar cita:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error al editar cita:', error.message);
    return false;
  }
}

async function testEliminarCita(citaId) {
  console.log(`3. Probando eliminación de cita ${citaId}...`);
  
  try {
    const response = await fetch(`${API_BASE}/citas/${citaId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Cita eliminada exitosamente:', result.message);
      return true;
    } else {
      console.log('❌ Error al eliminar cita:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error al eliminar cita:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Iniciando tests de funcionalidades...\n');
  
  // Test 1: Cargar citas
  const citas = await testCitas();
  
  if (citas.length > 0) {
    const primeraCita = citas[0];
    console.log(`📋 Primera cita encontrada: ${primeraCita.title} (ID: ${primeraCita.id})\n`);
    
    // Test 2: Editar cita
    const editado = await testEditarCita(primeraCita.id);
    
    if (editado) {
      // Test 3: Eliminar cita
      await testEliminarCita(primeraCita.id);
    }
  }
  
  console.log('\n✅ Tests completados');
}

// Ejecutar tests
runTests().catch(console.error); 