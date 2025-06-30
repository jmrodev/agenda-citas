#!/usr/bin/env node

/**
 * Script de Node.js para iniciar la aplicación de Agenda de Citas
 * Autor: JMRO
 * Fecha: 2024
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Función para imprimir mensajes con colores
function printMessage(message, color = 'green') {
  console.log(`${colors[color]}[INFO]${colors.reset} ${message}`);
}

function printWarning(message) {
  console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
}

function printError(message) {
  console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

function printHeader() {
  console.log(`${colors.blue}================================${colors.reset}`);
  console.log(`${colors.blue}  AGENDA DE CITAS - LAUNCHER${colors.reset}`);
  console.log(`${colors.blue}================================${colors.reset}`);
}

// Función para ejecutar comandos
function executeCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Comando falló con código ${code}`));
      }
    });
    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Función para ejecutar comandos y obtener salida
function executeCommandWithOutput(command, args = []) {
  return new Promise((resolve, reject) => {
    exec(`${command} ${args.join(' ')}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Función para verificar si un puerto está en uso
async function isPortInUse(port) {
  try {
    const output = await executeCommandWithOutput('lsof', ['-ti', `:${port}`]);
    return output.length > 0;
  } catch (error) {
    return false;
  }
}

// Función para matar procesos en un puerto
async function killPort(port) {
  try {
    printWarning(`Matando procesos en puerto ${port}...`);
    
    const pids = await executeCommandWithOutput('lsof', ['-ti', `:${port}`]);
    if (pids) {
      const pidArray = pids.split('\n').filter(pid => pid.trim());
      printWarning(`Matando PIDs: ${pidArray.join(', ')}`);
      
      for (const pid of pidArray) {
        try {
          await executeCommandWithOutput('kill', ['-9', pid]);
        } catch (error) {
          printWarning(`No se pudo matar PID ${pid}: ${error.message}`);
        }
      }
      
      // Esperar un poco y verificar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (await isPortInUse(port)) {
        printError(`Puerto ${port} aún está en uso después de intentar matar procesos`);
        return false;
      } else {
        printMessage(`Procesos en puerto ${port} terminados exitosamente`);
        return true;
      }
    } else {
      printMessage(`No hay procesos en puerto ${port}`);
      return true;
    }
  } catch (error) {
    printMessage(`No hay procesos en puerto ${port}`);
    return true;
  }
}

// Función para matar procesos de Node.js relacionados
async function killNodeProcesses() {
  try {
    printWarning('Buscando y matando procesos de Node.js relacionados...');
    
    // Matar procesos que contengan "server.js" o "react-scripts"
    const nodePids = await executeCommandWithOutput('ps', ['aux']);
    const lines = nodePids.split('\n');
    const targetPids = [];
    
    for (const line of lines) {
      if (line.includes('server.js') || line.includes('react-scripts') || 
          (line.includes('node') && line.includes('agenda-citas'))) {
        const parts = line.trim().split(/\s+/);
        if (parts.length > 1) {
          targetPids.push(parts[1]);
        }
      }
    }
    
    if (targetPids.length > 0) {
      printWarning(`Matando procesos de Node.js: ${targetPids.join(', ')}`);
      for (const pid of targetPids) {
        try {
          await executeCommandWithOutput('kill', ['-9', pid]);
        } catch (error) {
          // Ignorar errores si el proceso ya no existe
        }
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Matar procesos de npm
    const npmPids = await executeCommandWithOutput('ps', ['aux']);
    const npmLines = npmPids.split('\n');
    const npmTargetPids = [];
    
    for (const line of npmLines) {
      if ((line.includes('npm') && line.includes('start')) || 
          (line.includes('npm') && line.includes('server'))) {
        const parts = line.trim().split(/\s+/);
        if (parts.length > 1) {
          npmTargetPids.push(parts[1]);
        }
      }
    }
    
    if (npmTargetPids.length > 0) {
      printWarning(`Matando procesos de npm: ${npmTargetPids.join(', ')}`);
      for (const pid of npmTargetPids) {
        try {
          await executeCommandWithOutput('kill', ['-9', pid]);
        } catch (error) {
          // Ignorar errores si el proceso ya no existe
        }
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
  } catch (error) {
    printWarning(`Error matando procesos de Node.js: ${error.message}`);
  }
}

// Función para limpiar completamente todos los procesos
async function cleanupAllProcesses() {
  printMessage('Iniciando limpieza completa de procesos...');
  
  // Matar procesos específicos de la aplicación
  await killNodeProcesses();
  
  // Matar procesos en puertos específicos
  await killPort(3000);
  await killPort(3001);
  
  // Esperar un poco para asegurar que los procesos se terminen
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Verificar que los puertos estén libres
  if (await isPortInUse(3000)) {
    printError('Puerto 3000 aún está en uso después de la limpieza');
    return false;
  }
  
  if (await isPortInUse(3001)) {
    printError('Puerto 3001 aún está en uso después de la limpieza');
    return false;
  }
  
  printMessage('Limpieza de procesos completada exitosamente');
  return true;
}

// Función para esperar a que un puerto esté disponible
async function waitForPort(port, maxAttempts = 30) {
  printMessage(`Esperando a que el puerto ${port} esté disponible...`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (await isPortInUse(port)) {
      printMessage(`Puerto ${port} está disponible`);
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  printError(`Timeout esperando puerto ${port}`);
  return false;
}

// Función para abrir navegador
async function openBrowser(url) {
  printMessage(`Abriendo navegador en: ${url}`);
  
  try {
    // Detectar el navegador disponible
    const browsers = ['google-chrome', 'firefox', 'chromium', 'xdg-open'];
    
    for (const browser of browsers) {
      try {
        await executeCommandWithOutput('which', [browser]);
        if (browser === 'xdg-open') {
          await executeCommand(browser, [url]);
        } else {
          await executeCommand(browser, ['--new-window', url]);
        }
        return;
      } catch (error) {
        continue;
      }
    }
    
    printWarning(`No se pudo detectar un navegador. Abre manualmente: ${url}`);
  } catch (error) {
    printWarning(`Error abriendo navegador: ${error.message}`);
  }
}

// Función principal
async function main() {
  try {
    printHeader();
    
    // Verificar que estamos en el directorio correcto
    if (!fs.existsSync('frontend/package.json') || !fs.existsSync('server/server.js')) {
      printError('Este script debe ejecutarse desde el directorio agenda-citas');
      process.exit(1);
    }
    
    printMessage('Iniciando aplicación de Agenda de Citas...');
    
    // Limpieza completa de procesos existentes
    if (!(await cleanupAllProcesses())) {
      printError('No se pudo completar la limpieza de procesos. Abortando...');
      process.exit(1);
    }
    
    // Verificar dependencias del frontend
    if (!fs.existsSync('frontend/node_modules')) {
      printWarning('Instalando dependencias del frontend...');
      try {
        await executeCommand('npm', ['install'], { cwd: 'frontend' });
        printMessage('Dependencias del frontend instaladas correctamente');
      } catch (error) {
        printError(`Error instalando dependencias del frontend: ${error.message}`);
        throw error;
      }
    }
    
    // Iniciar servidor backend
    printMessage('Iniciando servidor backend (puerto 3001)...');
    const backendProcess = spawn('npm', ['start'], { 
      stdio: 'inherit',
      detached: false,
      cwd: 'server'
    });

    backendProcess.on('exit', (code, signal) => {
      printError(`El servidor backend se detuvo (código: ${code}, señal: ${signal})`);
    });
    backendProcess.on('error', (err) => {
      printError(`Error en el servidor backend: ${err.message}`);
    });

    // Esperar a que el backend esté listo
    if (await waitForPort(3001)) {
      printMessage('Servidor backend iniciado correctamente');
    } else {
      printError('Error al iniciar servidor backend');
      backendProcess.kill();
      process.exit(1);
    }
    
    // Iniciar servidor frontend
    printMessage('Iniciando servidor frontend (puerto 3000)...');
    const frontendProcess = spawn('npm', ['start'], { 
      stdio: 'inherit',
      detached: false,
      cwd: 'frontend'
    });

    frontendProcess.on('exit', (code, signal) => {
      printError(`El servidor frontend se detuvo (código: ${code}, señal: ${signal})`);
    });
    frontendProcess.on('error', (err) => {
      printError(`Error en el servidor frontend: ${err.message}`);
    });

    // Esperar a que el frontend esté listo
    if (await waitForPort(3000)) {
      printMessage('Servidor frontend iniciado correctamente');
    } else {
      printError('Error al iniciar servidor frontend');
      frontendProcess.kill();
      backendProcess.kill();
      process.exit(1);
    }
    
    // Esperar un poco más para que React compile completamente
    printMessage('Esperando compilación completa...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Abrir navegador
    await openBrowser('http://localhost:3000');
    
    printMessage('Aplicación iniciada correctamente!');
    printMessage('Frontend: http://localhost:3000');
    printMessage('Backend: http://localhost:3001');
    printMessage('');
    printMessage('Presiona Ctrl+C para detener todos los servidores');
    
    // Manejar Ctrl+C
    process.on('SIGINT', async () => {
      printMessage('Limpiando procesos al salir...');
      frontendProcess.kill();
      backendProcess.kill();
      await cleanupAllProcesses();
      printMessage('Limpieza completada');
      process.exit(0);
    });
    
    // Mantener el script corriendo
    await new Promise(() => {});
    
  } catch (error) {
    printError(`Error en la aplicación: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar función principal
main(); 