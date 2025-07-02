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

# Frontend: Agenda de Citas

Este README describe cómo crear, probar y desplegar el frontend de la Agenda de Citas usando React, Vite y pnpm, siguiendo buenas prácticas para despliegue en Vercel.

---

## 1. Crear el proyecto React con Vite

Desde la raíz del repositorio, ejecuta:

```bash
pnpm create vite frontend --template react
```

Esto creará la carpeta `frontend/` con un proyecto React moderno usando Vite.

---

## 2. Instalar dependencias

Entra a la carpeta del frontend e instala las dependencias:

```bash
cd frontend
pnpm install
```

---

## 3. Verificar scripts en package.json

Asegúrate de que el archivo `package.json` incluya estos scripts (deberían estar por defecto):

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## 4. Probar el proyecto localmente

Arranca el servidor de desarrollo:

```bash
pnpm dev
```

Abre tu navegador en [http://localhost:5173](http://localhost:5173) o el puerto que indique la consola.

---

## 5. Subir el código a un repositorio

Sube el proyecto a GitHub, GitLab o Bitbucket. Esto es necesario para el despliegue en Vercel.

---

## 6. Desplegar en Vercel

1. Ve a [https://vercel.com/](https://vercel.com/)
2. Inicia sesión y haz clic en 'New Project'.
3. Selecciona tu repositorio y elige la carpeta `frontend` como root del proyecto.
4. Vercel detectará automáticamente que es un proyecto Vite/React y sugerirá los comandos de build y output (`build` y `dist/`).
5. Si necesitas variables de entorno (por ejemplo, la URL del backend), agrégalas en el dashboard de Vercel en la sección 'Environment Variables'.

---

## 7. Consideraciones

- El frontend nunca debe conectarse directamente a la base de datos MySQL, solo al backend.
- Si usas React Router, asegúrate de configurar correctamente el fallback en Vercel (generalmente no es necesario cambiar nada para Vite).
- Si el backend está en Vercel Functions, intenta que ambos (frontend y backend) estén en la misma región para menor latencia.

---

## 8. Comandos útiles

- `pnpm dev`: Arranca el servidor de desarrollo.
- `pnpm build`: Genera la versión de producción en la carpeta `dist/`.
- `pnpm preview`: Previsualiza la build de producción localmente.

---

¿Dudas? Consulta la documentación oficial de [Vite](https://vitejs.dev/), [React](https://react.dev/) o [Vercel](https://vercel.com/docs). 