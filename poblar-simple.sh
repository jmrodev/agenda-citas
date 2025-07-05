#!/bin/bash

echo "🚀 POBLAMIENTO SIMPLIFICADO DE LA BASE DE DATOS"
echo "=============================================="

# Verificar backend
echo "📡 Verificando backend..."
if ! curl -s http://localhost:3001/api/health > /dev/null; then
    echo "❌ Backend no está corriendo"
    exit 1
fi
echo "✅ Backend funcionando"

# Login admin
echo "🔐 Login como admin..."
TOKEN=$(http --ignore-stdin --print=b POST :3001/api/auth/login username=admin password=Admin1234 | jq -r .token)
if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Error en login"
    exit 1
fi
echo "✅ Token obtenido"

# Crear secretarias
echo "👩‍💼 Creando secretarias..."
http --ignore-stdin POST :3001/api/secretaries \
  Authorization:"Bearer $TOKEN" \
  first_name="Ana" last_name="García" shift="mañana" entry_time="08:00:00" exit_time="16:00:00" email="ana.garcia@clinic.com"

http --ignore-stdin POST :3001/api/secretaries \
  Authorization:"Bearer $TOKEN" \
  first_name="María" last_name="López" shift="tarde" entry_time="16:00:00" exit_time="00:00:00" email="maria.lopez@clinic.com"

echo "✅ Secretarias creadas"

# Crear usuarios
echo "👤 Creando usuarios..."
http --ignore-stdin POST :3001/api/auth/register \
  Authorization:"Bearer $TOKEN" \
  username="ana_garcia" email="ana.garcia@clinic.com" password="Admin1234" role="secretary" entity_id="1" nombre="Ana García"

http --ignore-stdin POST :3001/api/auth/register \
  Authorization:"Bearer $TOKEN" \
  username="maria_lopez" email="maria.lopez@clinic.com" password="Admin1234" role="secretary" entity_id="2" nombre="María López"

http --ignore-stdin POST :3001/api/auth/register \
  Authorization:"Bearer $TOKEN" \
  username="roberto_hernandez" email="roberto.hernandez@clinic.com" password="Admin1234" role="doctor" entity_id="1" nombre="Roberto Hernández"

http --ignore-stdin POST :3001/api/auth/register \
  Authorization:"Bearer $TOKEN" \
  username="laura_diaz" email="laura.diaz@clinic.com" password="Admin1234" role="doctor" entity_id="2" nombre="Laura Díaz"

echo "✅ Usuarios creados"

# Crear citas
echo "📋 Creando citas médicas..."
http --ignore-stdin POST :3001/api/appointments \
  Authorization:"Bearer $TOKEN" \
  patient_id="1" doctor_id="1" date:='{"day":15,"month":1,"year":2024}' time="10:00:00" reason="Control cardiológico rutinario" type="consulta" status="confirmada" recorded_by_secretary_id="1" service_type="consulta_cardiológica" amount="80.00" payment_method="efectivo" payment_date:='{"day":15,"month":1,"year":2024}'

http --ignore-stdin POST :3001/api/appointments \
  Authorization:"Bearer $TOKEN" \
  patient_id="2" doctor_id="1" date:='{"day":16,"month":1,"year":2024}' time="11:00:00" reason="Dolor en el pecho" type="consulta" status="confirmada" recorded_by_secretary_id="1" service_type="consulta_cardiológica" amount="80.00" payment_method="tarjeta" payment_date:='{"day":16,"month":1,"year":2024}'

http --ignore-stdin POST :3001/api/appointments \
  Authorization:"Bearer $TOKEN" \
  patient_id="4" doctor_id="2" date:='{"day":17,"month":1,"year":2024}' time="15:00:00" reason="Revisión de manchas en la piel" type="consulta" status="confirmada" recorded_by_secretary_id="2" service_type="consulta_dermatológica" amount="75.00" payment_method="efectivo" payment_date:='{"day":17,"month":1,"year":2024}'

echo "✅ Citas creadas"

# Crear prescripciones
echo "💊 Creando prescripciones..."
http --ignore-stdin POST :3001/api/prescriptions \
  Authorization:"Bearer $TOKEN" \
  patient_id="1" doctor_id="1" date:='{"day":15,"month":1,"year":2024}' issued_by_secretary_id="1" amount="25.00" payment_method="efectivo" payment_date:='{"day":15,"month":1,"year":2024}'

http --ignore-stdin POST :3001/api/prescriptions \
  Authorization:"Bearer $TOKEN" \
  patient_id="2" doctor_id="1" date:='{"day":16,"month":1,"year":2024}' issued_by_secretary_id="1" amount="25.00" payment_method="tarjeta" payment_date:='{"day":16,"month":1,"year":2024}'

echo "✅ Prescripciones creadas"

# Verificar datos
echo "🔍 Verificando datos..."
echo "Secretarias: $(http --ignore-stdin --print=b GET :3001/api/secretaries Authorization:"Bearer $TOKEN" | jq -r '.secretaries | length // 0')"
echo "Citas: $(http --ignore-stdin --print=b GET :3001/api/appointments Authorization:"Bearer $TOKEN" | jq -r '.appointments | length // 0')"
echo "Prescripciones: $(http --ignore-stdin --print=b GET :3001/api/prescriptions Authorization:"Bearer $TOKEN" | jq -r '.prescriptions | length // 0')"

echo ""
echo "🎉 ¡POBLAMIENTO COMPLETADO!"
echo "=========================="
echo "✅ Datos básicos creados correctamente"
echo ""
echo "👤 Credenciales:"
echo "   Admin: admin / Admin1234"
echo "   Secretaria 1: ana_garcia / Admin1234"
echo "   Secretaria 2: maria_lopez / Admin1234"
echo "   Doctor 1: roberto_hernandez / Admin1234"
echo "   Doctor 2: laura_diaz / Admin1234" 