#!/bin/bash

echo "🚀 INICIANDO POBLAMIENTO AUTOMÁTICO DE LA BASE DE DATOS"
echo "=================================================="

# Verificar que el backend esté corriendo
echo "📡 Verificando backend..."
if ! curl -s http://localhost:3001/api/health > /dev/null; then
    echo "❌ Error: El backend no está corriendo en http://localhost:3001"
    echo "Ejecuta: ./start-app.sh"
    exit 1
fi
echo "✅ Backend funcionando"

# 1. LOGIN ADMIN Y GUARDAR TOKEN
echo "🔐 Login como admin..."
TOKEN=$(http --ignore-stdin --print=b POST :3001/api/auth/login username=admin password=Admin1234 | jq -r .token)
if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Error: No se pudo obtener el token. Verifica las credenciales."
    exit 1
fi
echo "✅ Token obtenido: ${TOKEN:0:20}..."

# 2. CREAR SECRETARIAS
echo "👩‍💼 Creando secretarias..."
SEC1=$(http --ignore-stdin --print=b POST :3001/api/secretaries \
  Authorization:"Bearer $TOKEN" \
  first_name="Ana" last_name="García" shift="mañana" entry_time="08:00:00" exit_time="16:00:00" email="ana.garcia@clinic.com" | jq -r '.secretary.secretary_id // empty')

SEC2=$(http --ignore-stdin --print=b POST :3001/api/secretaries \
  Authorization:"Bearer $TOKEN" \
  first_name="María" last_name="López" shift="tarde" entry_time="16:00:00" exit_time="00:00:00" email="maria.lopez@clinic.com" | jq -r '.secretary.secretary_id // empty')

echo "✅ Secretarias creadas - ID1: $SEC1, ID2: $SEC2"

# 3. CREAR USUARIOS PARA SECRETARIAS
echo "👤 Creando usuarios para secretarias..."
http --ignore-stdin POST :3001/api/auth/register \
  Authorization:"Bearer $TOKEN" \
  username="ana_garcia" email="ana.garcia@clinic.com" password="Admin1234" role="secretary" entity_id="$SEC1" nombre="Ana García"

http --ignore-stdin POST :3001/api/auth/register \
  Authorization:"Bearer $TOKEN" \
  username="maria_lopez" email="maria.lopez@clinic.com" password="Admin1234" role="secretary" entity_id="$SEC2" nombre="María López"

echo "✅ Usuarios de secretarias creados"

# 4. CREAR USUARIOS PARA DOCTORES
echo "👨‍⚕️ Creando usuarios para doctores..."
http --ignore-stdin POST :3001/api/auth/register \
  Authorization:"Bearer $TOKEN" \
  username="roberto_hernandez" email="roberto.hernandez@clinic.com" password="Admin1234" role="doctor" entity_id="1" nombre="Roberto Hernández"

http --ignore-stdin POST :3001/api/auth/register \
  Authorization:"Bearer $TOKEN" \
  username="laura_diaz" email="laura.diaz@clinic.com" password="Admin1234" role="doctor" entity_id="2" nombre="Laura Díaz"

echo "✅ Usuarios de doctores creados"

# 5. CREAR HORARIOS DE CONSULTA (solo si no existen)
echo "📅 Creando horarios de consulta..."
# Verificar si ya existen horarios antes de crear
EXISTING_HOURS=$(http --ignore-stdin --print=b GET :3001/api/doctor-consultation-hours Authorization:"Bearer $TOKEN" | jq '.consultation_hours | length')

if [ "$EXISTING_HOURS" = "0" ]; then
    # Doctor 1 (Roberto Hernández - Cardiología)
    for dia in lunes miércoles viernes; do
        http --ignore-stdin POST :3001/api/doctor-consultation-hours \
          Authorization:"Bearer $TOKEN" \
          doctor_id="1" day_of_week="$dia" start_time="09:00:00" end_time="13:00:00"
    done

    # Doctor 2 (Laura Díaz - Dermatología)
    for dia in martes jueves; do
        http --ignore-stdin POST :3001/api/doctor-consultation-hours \
          Authorization:"Bearer $TOKEN" \
          doctor_id="2" day_of_week="$dia" start_time="14:00:00" end_time="18:00:00"
    done
    echo "✅ Horarios de consulta creados"
else
    echo "⚠️ Horarios ya existen, saltando creación"
fi

# 6. CREAR CITAS MÉDICAS
echo "📋 Creando citas médicas..."
CITAS=(
    "1,1,2024-01-15,10:00:00,Control cardiológico rutinario,consulta,confirmada,consulta_cardiológica,80.00,efectivo,2024-01-15"
    "2,1,2024-01-16,11:00:00,Dolor en el pecho,consulta,confirmada,consulta_cardiológica,80.00,tarjeta,2024-01-16"
    "4,2,2024-01-17,15:00:00,Revisión de manchas en la piel,consulta,confirmada,consulta_dermatológica,75.00,efectivo,2024-01-17"
    "3,3,2024-01-18,09:30:00,Dolor en la rodilla,consulta,confirmada,consulta_ortopédica,85.00,transferencia,2024-01-18"
    "5,4,2024-01-19,10:30:00,Control ginecológico anual,consulta,confirmada,consulta_ginecológica,90.00,efectivo,2024-01-19"
)

for cita in "${CITAS[@]}"; do
    IFS=',' read -r patient_id doctor_id date time reason type status service_type amount payment_method payment_date <<< "$cita"
    http --ignore-stdin POST :3001/api/appointments \
      Authorization:"Bearer $TOKEN" \
      patient_id="$patient_id" doctor_id="$doctor_id" date="$date" time="$time" reason="$reason" type="$type" status="$status" recorded_by_secretary_id="$SEC1" service_type="$service_type" amount="$amount" payment_method="$payment_method" payment_date="$payment_date"
done

echo "✅ Citas médicas creadas"

# 7. CREAR PRESCRIPCIONES
echo "💊 Creando prescripciones..."
PRESCRIPCIONES=(
    "1,1,2024-01-15,25.00,efectivo,2024-01-15"
    "2,1,2024-01-16,25.00,tarjeta,2024-01-16"
    "4,2,2024-01-17,20.00,efectivo,2024-01-17"
)

for presc in "${PRESCRIPCIONES[@]}"; do
    IFS=',' read -r patient_id doctor_id date amount payment_method payment_date <<< "$presc"
    http --ignore-stdin POST :3001/api/prescriptions \
      Authorization:"Bearer $TOKEN" \
      patient_id="$patient_id" doctor_id="$doctor_id" date="$date" issued_by_secretary_id="$SEC1" amount="$amount" payment_method="$payment_method" payment_date="$payment_date"
done

echo "✅ Prescripciones creadas"

# 8. CREAR HISTORIAL MÉDICO
echo "📝 Creando historial médico..."
HISTORIAL=(
    "1,1,15,1,2024,Hipertensión arterial controlada,Mantener medicación actual y dieta baja en sal,Paciente responde bien al tratamiento"
    "2,1,16,1,2024,Angina de pecho,Nitroglicerina de rescate y control estricto,Requiere seguimiento cercano"
    "4,2,17,1,2024,Dermatitis atópica,Cremas hidratantes y evitar irritantes,Mejora significativa con el tratamiento"
)

for hist in "${HISTORIAL[@]}"; do
    IFS=',' read -r patient_id doctor_id day month year diagnosis treatment observations <<< "$hist"
    http --ignore-stdin POST :3001/api/medical-history \
      Authorization:"Bearer $TOKEN" \
      patient_id="$patient_id" date:='{"day":'$day',"month":'$month',"year":'$year'}' attending_doctor_id="$doctor_id" diagnosis="$diagnosis" treatment="$treatment" observations="$observations"
done

echo "✅ Historial médico creado"

# 9. CREAR ACTIVIDADES DE SECRETARIAS
echo "📊 Creando actividades de secretarias..."
ACTIVIDADES=(
    "$SEC1,2024-01-15,08:00:00,inicio_turno,Inicio de turno matutino"
    "$SEC1,2024-01-15,10:00:00,cita_creada,Cita creada para Juan García con Dr. Hernández"
    "$SEC1,2024-01-15,16:00:00,fin_turno,Fin de turno matutino"
    "$SEC2,2024-01-15,16:00:00,inicio_turno,Inicio de turno vespertino"
    "$SEC2,2024-01-15,17:30:00,prescripción_creada,Prescripción creada para Ana Rodríguez"
)

for act in "${ACTIVIDADES[@]}"; do
    IFS=',' read -r secretary_id date time activity_type detail <<< "$act"
    http --ignore-stdin POST :3001/api/secretary-activities \
      Authorization:"Bearer $TOKEN" \
      secretary_id="$secretary_id" date="$date" time="$time" activity_type="$activity_type" detail="$detail"
done

echo "✅ Actividades de secretarias creadas"

# 10. CREAR PAGOS DE INSTALACIONES
echo "💰 Creando pagos de instalaciones..."
http --ignore-stdin POST :3001/api/facility-payments \
  Authorization:"Bearer $TOKEN" \
  doctor_id="1" payment_date="2024-01-31" payment_period="Enero 2024" hours_used="40.00" hourly_rate="15.00" total_amount="600.00" recorded_by_secretary_id="$SEC1"

http --ignore-stdin POST :3001/api/facility-payments \
  Authorization:"Bearer $TOKEN" \
  doctor_id="2" payment_date="2024-01-31" payment_period="Enero 2024" hours_used="32.00" hourly_rate="15.00" total_amount="480.00" recorded_by_secretary_id="$SEC2"

echo "✅ Pagos de instalaciones creados"

# 11. VERIFICAR DATOS CREADOS
echo "🔍 Verificando datos creados..."
echo "📊 Resumen de datos:"

SECRETARIAS_COUNT=$(http --ignore-stdin --print=b GET :3001/api/secretaries Authorization:"Bearer $TOKEN" | jq -r '.secretaries | length // 0')
echo "Secretarias: $SECRETARIAS_COUNT"

CITAS_COUNT=$(http --ignore-stdin --print=b GET :3001/api/appointments Authorization:"Bearer $TOKEN" | jq -r '.appointments | length // 0')
echo "Citas: $CITAS_COUNT"

PRESCRIPCIONES_COUNT=$(http --ignore-stdin --print=b GET :3001/api/prescriptions Authorization:"Bearer $TOKEN" | jq -r '.prescriptions | length // 0')
echo "Prescripciones: $PRESCRIPCIONES_COUNT"

HISTORIAL_COUNT=$(http --ignore-stdin --print=b GET :3001/api/medical-history Authorization:"Bearer $TOKEN" | jq -r '.records | length // 0')
echo "Historial médico: $HISTORIAL_COUNT"

RELACIONES_COUNT=$(http --ignore-stdin --print=b GET :3001/api/patient-doctors Authorization:"Bearer $TOKEN" | jq -r '.relations | length // 0')
echo "Relaciones paciente-doctor: $RELACIONES_COUNT"

echo ""
echo "🎉 ¡POBLAMIENTO COMPLETADO EXITOSAMENTE!"
echo "=================================================="
echo "✅ Base de datos poblada con datos de prueba"
echo "✅ Todas las entidades creadas correctamente"
echo "✅ Relaciones establecidas"
echo ""
echo "🔗 URLs de acceso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo ""
echo "👤 Credenciales de prueba:"
echo "   Admin: admin / Admin1234"
echo "   Secretaria 1: ana_garcia / Admin1234"
echo "   Secretaria 2: maria_lopez / Admin1234"
echo "   Doctor 1: roberto_hernandez / Admin1234"
echo "   Doctor 2: laura_diaz / Admin1234" 