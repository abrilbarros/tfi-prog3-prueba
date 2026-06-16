# tfi-prog3-turnos

Trabajo Final Integrador de Programación III - UNER

API REST para la gestión de turnos de una clínica médica, desarrollada con Node.js, Express y MySQL.

## Descripción

El sistema permite administrar usuarios, médicos, pacientes, especialidades, obras sociales, turnos/reservas y estadísticas de atención.

La API utiliza autenticación con JWT y autorización por roles:

- `1`: Médico
- `2`: Paciente
- `3`: Administrador

La documentación interactiva está disponible mediante Swagger cuando el servidor está en ejecución.

---

## Importante

Para ejecutar correctamente el proyecto, importar la base de datos:

`database/prog3-turnos-modificado.sql`

Este archivo incluye:

- estructura final de la base de datos utilizada por el proyecto;
- datos de prueba para reportes y estadísticas;
- procedimientos almacenados necesarios para funcionalidades específicas.

---

## Instalación y ejecución

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env` con las variables necesarias para la conexión a MySQL.

Ejemplo:

```env
PUERTO=3000
DB_HOST=localhost
DB_DATABASE=prog3_turnos
DB_USER=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=tu_clave_secreta
```

### 3. Ejecutar el servidor

```bash
npm run dev
```

### 4. Acceder a Swagger

Abrir en el navegador:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Tecnologías principales

- Node.js
- Express
- MySQL
- JWT
- Swagger

---

## Grupo I

### Integrantes

- Barros, Abril Ivon
- Charriere, Emanuel
- Conti, Esteban
- Silvestri, Isaias
- Toledo, Gabriel Hernan

---

## Base de datos utilizada

El proyecto utiliza la base de datos provista por la cátedra, con ajustes y extensiones necesarias para adaptarla a los requerimientos funcionales implementados.

Las modificaciones que se implementaron son las siguientes:

- Se corrigió la columna `turnos_reservas.atentido` a `turnos_reservas.atendido`.
- Se agregó la obra social PARTICULAR con `id_obra_social = 1`.
- Se incorporaron procedimientos almacenados para estadísticas.

---

## División de tareas

- Barros Abril Ivon: BREAD especialidades, GET todos y GET por id de médicos y asociación de médicos con obras sociales mediante tabla intermedia `medicos_obras_sociales`.
- Charriere, Emanuel: BREAD obras sociales y GET todos y GET por id de pacientes.
- Conti, Esteban: BREAD usuarios, login, JWT, roles, cambio de contraseña, reinicio de contraseña.
- Hernán e Isaías: BREAD turnos reservas, stored procedures, estadísticas y PDF.

---

Facultad de Ciencias de la Administración - UNER
Tecnicatura Universitaria en Desarrollo Web
Año 2026 - 1er Cuatrimestre
