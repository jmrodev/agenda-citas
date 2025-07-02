# Registro de usuarios (solo admin)

**IMPORTANTE:** Solo el usuario con rol `admin` puede crear nuevos usuarios a través del endpoint:

```
POST /api/auth/register
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "email": "nuevo@mail.com",
  "password": "123456",
  "role": "doctor|secretary|patient",
  "entity_id": 200001
}
```

- Si el usuario autenticado no es admin, recibirá un error 403.
- El campo `entity_id` debe referenciar el id correspondiente (doctor_id, secretary_id, patient_id) según el rol.
- El admin inicial se define en la base de datos con contraseña conocida (ver sección SQL de ejemplo).

--- 