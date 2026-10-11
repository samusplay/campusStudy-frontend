# CampusStudy — Frontend

Interfaz web de **CampusStudy**, plataforma distribuida para la organización de actividades académicas de estudiantes. El Frontend es el punto de interacción con el usuario: integra y presenta la información de los seis microservicios del sistema (usuarios, materias, tareas, grupos, notificaciones y estadísticas) y no administra datos propios.

**Equipo Frontend:** Samuel Esteban Rodríguez Vargas · Mariana Castillo Acosta · Julián Camilo Velasco
**Curso:** Sistemas Distribuidos — UNIMINUTO

---

## Tabla de contenido

1. [Tecnologías](#tecnologías)
2. [Arquitectura](#arquitectura)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos previos](#requisitos-previos)
5. [Instalación](#instalación)
6. [Configuración](#configuración)
7. [Ejecución](#ejecución)
8. [Vistas y endpoints consumidos](#vistas-y-endpoints-consumidos)
9. [Manejo de errores](#manejo-de-errores)
10. [Pruebas](#pruebas)
11. [Dependencias](#dependencias)

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| [Next.js](https://nextjs.org) (App Router) | Framework de React con renderizado del lado del servidor (SSR) |
| React | Construcción de la interfaz basada en componentes |
| TypeScript | Tipado estático |
| Server Actions | Comunicación con los microservicios desde el servidor |
| [Zod](https://zod.dev) | Validación de las respuestas según los contratos de interfaz |
| Tailwind CSS | Estilos |
| shadcn/ui | Componentes de interfaz reutilizables |

## Arquitectura

El Frontend sigue una **arquitectura basada en componentes** con Next.js:

- **Server Components**: se ejecutan en el servidor, consultan los microservicios y envían la vista ya construida al navegador.
- **Client Components**: se ejecutan en el navegador y manejan la interactividad (formularios, menú lateral, estado).
- **Server Actions** (`actions/`): concentran las llamadas HTTP a cada microservicio. El token de sesión y las URL de los servicios no quedan expuestos en el navegador.

El Frontend consume **directamente** cada microservicio mediante API REST (`/api/v1/`, formato JSON), según el contrato de interfaz e integración v1.0.

```
Navegador ──HTTPS──▶ Servidor Next.js ──REST /api/v1──▶ usuarios-service
                     (rutas, componentes,              materias-service
                      Server Actions, Zod)             tareas-service
                                                       grupos-service
                                                       notificaciones-service
                                                       estadisticas-service
```

## Estructura del proyecto

```
campusstudy/
├── actions/             # Server Actions: comunicación con los microservicios
├── app/                 # Rutas (App Router)
│   ├── (auth)/          # Vistas públicas: inicio de sesión y registro
│   ├── admin/           # Vistas privadas del estudiante
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/            # Componentes de autenticación
│   └── ui/              # Componentes de interfaz por dominio (admin, auth, home)
├── lib/                 # Configuración y utilidades compartidas
├── public/              # Archivos estáticos
├── src/
│   ├── schemas/         # Esquemas Zod de los contratos de interfaz
│   └── utils/           # Funciones auxiliares
├── .env.local           # Variables de entorno (no se sube al repositorio)
└── next.config.ts
```

## Requisitos previos

- [Node.js](https://nodejs.org) 20 o superior
- npm (incluido con Node.js)
- Git
- Los microservicios de CampusStudy en ejecución y accesibles por red (ver [Dependencias](#dependencias))

Verifica las versiones instaladas:

```bash
node -v
npm -v
```

## Instalación

```bash
git clone [URL del repositorio]
cd campusstudy
npm install
```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con la URL base de cada microservicio:

```env
# URL base de cada microservicio (sin barra final)
USUARIOS_SERVICE_URL=http://localhost:8001
MATERIAS_SERVICE_URL=http://localhost:8002
TAREAS_SERVICE_URL=http://localhost:8003
GRUPOS_SERVICE_URL=http://localhost:8004
NOTIFICACIONES_SERVICE_URL=http://localhost:8005
ESTADISTICAS_SERVICE_URL=http://localhost:8006
```

> Estas variables se leen solo en el servidor (Server Actions), por eso **no** llevan el prefijo `NEXT_PUBLIC_`. Ajusta los puertos según dónde esté desplegado cada servicio.

## Ejecución

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Genera la versión optimizada de producción |
| `npm run start` | Ejecuta la versión de producción (requiere `build` previo) |
| `npm run lint` | Revisa el código con ESLint |

## Vistas y endpoints consumidos

| Vista | Ruta | Microservicio | Endpoints |
|---|---|---|---|
| Inicio de sesión | `/login` | usuarios-service | `POST /api/v1/auth/login` |
| Registro | `/registro` | usuarios-service | `POST /api/v1/auth/registro` |
| Protección de rutas | `/admin/*` | usuarios-service | `POST /api/v1/auth/validate` |
| Inicio | `/admin` | estadisticas-service | `GET /api/v1/estadisticas/usuario/{id}` |
| Calendario | `/admin/calendario` | tareas-service | `GET /api/v1/tareas?usuario_id=` |
| Materias | `/admin/materias` | materias-service | `GET`, `POST /api/v1/materias` · `PUT`, `DELETE /api/v1/materias/{materia_id}` |
| Tareas | `/admin/tareas` | tareas-service | `GET`, `POST /api/v1/tareas` · `PUT /api/v1/tareas/{tarea_id}` · `PUT /api/v1/tareas/{tarea_id}/estado` · `DELETE /api/v1/tareas/{tarea_id}` |
| Grupos | `/admin/grupos` | grupos-service | `GET`, `POST /api/v1/grupos` · `GET /api/v1/grupos/{grupo_id}` · `POST /api/v1/grupos/{grupo_id}/integrantes` |
| Notificaciones | `/admin/notificaciones` | notificaciones-service | `GET /api/v1/notification/{usuario_id}` |

Todas las peticiones a vistas privadas envían el token de sesión en el encabezado:

```
Authorization: Bearer <token>
```

## Manejo de errores

Comportamiento del Frontend ante las respuestas de los microservicios, según el contrato:

| Código | Situación | Comportamiento en el Frontend |
|---|---|---|
| `400` | Datos inválidos | Muestra los errores junto al formulario |
| `401` | Credenciales inválidas o token vencido | Redirige al inicio de sesión |
| `404` | Recurso inexistente | Informa que el recurso no existe |
| `500` | Error interno del servicio | Muestra un mensaje genérico de error |
| `503` | Servicio no disponible | Muestra "servicio temporalmente no disponible" sin bloquear las demás vistas |

Si un servicio cae, solo se afecta su vista: por ejemplo, si `estadisticas-service` no responde, el resto de la plataforma sigue funcionando.

## Pruebas

### Revisión estática

```bash
npm run lint
```

### Pruebas de integración (manuales)

Con los microservicios en ejecución y el Frontend en `npm run dev`:

1. Iniciar sesión con credenciales válidas → se recibe el token y se redirige a `/admin`.
2. Iniciar sesión con contraseña incorrecta → se muestra el error de credenciales.
3. Entrar a `/admin` sin sesión → se redirige a `/login`.
4. Crear una materia y luego una tarea asociada → ambas aparecen en sus listados.
5. Detener `tareas-service` y abrir `/admin/tareas` → se muestra "servicio no disponible" y las demás vistas siguen funcionando.
6. Detener `usuarios-service` e intentar iniciar sesión → se muestra "servicio de autenticación no disponible temporalmente".

## Dependencias

### Librerías principales

Ver `package.json` para la lista completa y las versiones exactas.

- `next`, `react`, `react-dom`
- `zod`
- `tailwindcss`
- Componentes de `shadcn/ui`

### Servicios que deben estar activos

| Servicio | Necesario para |
|---|---|
| usuarios-service | Inicio de sesión, registro y validación del token (**obligatorio**) |
| materias-service | Vista de materias |
| tareas-service | Vistas de tareas y calendario |
| grupos-service | Vista de grupos |
| notificaciones-service | Centro de notificaciones |
| estadisticas-service | Panel de inicio |

Sin `usuarios-service` no es posible iniciar sesión; los demás servicios pueden fallar de forma independiente sin detener la plataforma.