#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
  echo -e "${GREEN}[INFO]${NC} $1"
}
print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}
print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}
print_header() {
  echo -e "${BLUE}================================${NC}"
  echo -e "${BLUE}  AGENDA DE CITAS - LAUNCHER${NC}"
  echo -e "${BLUE}================================${NC}"
}

# Matar procesos en un puerto
kill_port() {
  local port=$1
  print_warning "Matando procesos en puerto $port..."
  fuser -k ${port}/tcp 2>/dev/null
}

# Matar procesos Node.js relacionados
kill_node_processes() {
  print_warning "Buscando y matando procesos de Node.js relacionados..."
  pkill -f 'node.*agenda-citas' 2>/dev/null
  pkill -f 'server.js' 2>/dev/null
  pkill -f 'react-scripts' 2>/dev/null
  pkill -f 'npm start' 2>/dev/null
}

# Limpieza completa
echo ""
cleanup_all_processes() {
  print_message "Iniciando limpieza completa de procesos..."
  kill_node_processes
  kill_port 3000
  kill_port 3001
}

# Lanzar backend y frontend en terminales separadas usando xfce4-terminal
launch_backend_and_frontend() {
  print_message "Abriendo backend en nueva terminal..."
  xfce4-terminal --title="Backend" --hold --command="bash -c 'cd backend && pnpm dev'"
  print_message "Abriendo frontend en nueva terminal..."
  xfce4-terminal --title="Frontend" --hold --command="bash -c 'cd frontend && pnpm dev'"
}

# Mostrar instrucciones para monitoreo
show_monitoring_instructions() {
  echo -e "${BLUE}--------------------------------${NC}"
  echo "Para monitorear logs de systemd en otra terminal usa:"
  echo "  sudo journalctl -u backend.service -u frontend.service --follow"
  echo -e "${BLUE}--------------------------------${NC}"
}

# MAIN
print_header
cleanup_all_processes
launch_backend_and_frontend
show_monitoring_instructions 