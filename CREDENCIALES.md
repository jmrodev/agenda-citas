# Credenciales del Proyecto Agenda de Citas

## Base de Datos MySQL
- **Usuario**: jmro
- **Contraseña**: jmro1975
- **Base de datos**: agenda_citas
- **Host**: localhost
- **Puerto**: 3306

### Comando de conexión:
```bash
mysql -u jmro -pjmro1975 agenda_citas
```

## Usuario Administrador
- **Usuario**: admin
- **Contraseña**: Admin1234
- **Email**: admin@mail.com
- **Rol**: admin

### Comando de prueba de login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin1234"}'
```

## URLs de la Aplicación
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

## Comandos Útiles

### Iniciar la aplicación:
```bash
./start-app.sh
```

### Verificar estado de servicios:
```bash
sudo systemctl status mariadb
sudo systemctl status httpd
```

### Conectar a MySQL y ver datos:
```bash
mysql -u jmro -pjmro1975 agenda_citas -e "SELECT COUNT(*) as total_patients FROM patients;"
```

### Probar endpoints:
```bash
# Health check
curl http://localhost:3001/api/health

# Login admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin1234"}'
```

## Notas Importantes
- La contraseña Admin1234 cumple con los requisitos de validación del backend
- La base de datos está poblada con datos de prueba reales
- Las relaciones paciente-doctor están implementadas y funcionando
- El hash de la contraseña está guardado en la base de datos 