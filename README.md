# Funkoshop

¡Bienvenido a Funkoshop!

Esta es una aplicación web moderna que simula un E-Commerce real de figuras coleccionables. El proyecto ha evolucionado a una arquitectura separada (Frontend y Backend) para ofrecer una experiencia más robusta, escalable y dinámica.

Ofrece funcionalidades completas de búsqueda, filtrado, carrito de compras y panel de administración para la gestión de productos (CRUD, Actividad y Reportes).

![377shots_so](https://github.com/MarkoTeixido/FunkoshopCaC-Backend/assets/89801822/d0f4e578-46e3-47e7-a9dc-1922f162e6e4)
![373shots_so](https://github.com/MarkoTeixido/FunkoshopCaC-Backend/assets/89801822/5ec3d463-f93c-413f-88e0-4f2decc3a982)
![118shots_so](https://github.com/MarkoTeixido/FunkoshopCaC-Backend/assets/89801822/8a8ec40a-8bc6-4a6e-96ca-d051ea5d5c15)

## Stack de Tecnologías 🎇

El proyecto está dividido en dos grandes áreas:

### Frontend (Cliente)
- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Estado:** React Hooks
- **Librerías:** Axios, Swiper, SweetAlert2

### Backend (Servidor)
- **Entorno:** Node.js
- **Framework:** Express
- **Base de Datos:** MySQL
- **ORM:** Sequelize
- **Autenticación:** JWT & Cookie Sessions
- **Seguridad:** BcryptJS, CORS, Helmet

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local._

### Prerrequisitos

> [!IMPORTANT]
> Es necesario tener instalado **Node.js** (v18+ recomendado), **NPM** y **MySQL** en tu máquina.

### Clonar el Repositorio

```bash
git clone https://github.com/MarkoTeixido/Funkoshop.git
```
*(Asegúrate de usar la URL correcta de tu repositorio)*

---

### Configuración del Backend

1. Navega a la carpeta del backend e instala las dependencias:
   ```bash
   cd backend
   npm install
   ```

2. Configura tu base de datos. Puedes usar el script `funkoshopdb.sql` incluido en la carpeta `backend` para crear la estructura inicial en tu gestor MySQL favorito (Workbench, DBeaver, etc.).

3. Crea un archivo `.env` en `backend/` con las credenciales:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=tu_password
   DB_NAME=funkoshop
   SESSION_SECRET_1=secreto1
   JWT_SECRET=secretojwt
   ```

4. Inicia el servidor:
   ```bash
   npm run dev
   ```

---

### Configuración del Frontend

1. Abre una nueva terminal, navega a la carpeta del frontend e instala dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. Crea un archivo `.env.local` en `frontend/` para conectar con el backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. Inicia la aplicación cliente:
   ```bash
   npm run dev
   ```

¡Listo! Accede a la aplicación en `http://localhost:3000` (o el puerto que indique Next.js).

## Documentación Detallada 📚

Para más detalles sobre cada parte del proyecto, consulta los archivos específicos:
- [Documentación Backend](./backend/BACKEND.md)
- [Documentación Frontend](./frontend/FRONTEND.md)

## Autor

* **Marko Teixido** - [https://github.com/MarkoTeixido](https://github.com/MarkoTeixido)
