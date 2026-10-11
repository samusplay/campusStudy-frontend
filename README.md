# CampusStudy — Frontend

Interfaz web de **CampusStudy**, plataforma distribuida para la organización de actividades académicas de estudiantes. El Frontend es el punto de interacción con el usuario: integra y presenta la información de los seis microservicios del sistema (usuarios, materias, tareas, grupos, notificaciones y estadísticas) y no administra datos propios.

**Repositorio:** https://github.com/samusplay/campusStudy-frontend (rama `develop`)
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
| [Next.js](https://nextjs.org) 16 (App Router) | Framework de React con renderizado del lado del servidor (SSR) |
| React 19 | Construcción de la interfaz basada en componentes |
| TypeScript | Tipado estático |
| Server Actions | Comunicación con los microservicios desde el servidor |
| [Zod](https://zod.dev) 4 | Validación de las respuestas según los contratos de interfaz |
| Tailwind CSS 4 | Estilos |
| shadcn/ui + Radix UI | Componentes de interfaz reutilizables y accesibles |
| Lucide React | Íconos |
| Motion | Animaciones de la interfaz |

## Arquitectura

El Frontend sigue una **arquitectura basada en componentes** con Next.js:

- **Server Components**: se ejecutan en el servidor, consultan los microservicios y envían la vista ya construida al navegador.
- **Client Components**: se ejecutan en el navegador y manejan la interactividad (formularios, menú lateral, estado).
- **Server Actions** (`actions/`): concentran las llamadas HTTP al API Gateway. El token de sesión y la URL del gateway no quedan expuestos en el navegador.

El Frontend **no se conecta directamente** a los microservicios: todas sus peticiones pasan por el **API Gateway**, que actúa como punto de entrada único y las enruta al microservicio correspondiente mediante API REST (`/api/v1/`, formato JSON), según el contrato de interfaz e integración v1.0.

```
Navegador ──HTTPS──▶ Servidor Next.js ──REST──▶ API Gateway ──▶ usuarios-service
                     (rutas, componentes,                       materias-service
                      Server Actions, Zod)                      tareas-service
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

- [Node.js](https://nodejs.org) 20.9 o superior (requerido por Next.js 16)
- npm (incluido con Node.js)
- Git
- El API Gateway y los microservicios de CampusStudy en ejecución (ver [Dependencias](#dependencias))

Verifica las versiones instaladas:

```bash
node -v
npm -v
```

## Instalación

```bash
git clone https://github.com/samusplay/campusStudy-frontend.git
cd campusStudy-frontend
git checkout develop
npm install
```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con la URL base del API Gateway:

```env
# URL base del API Gateway (sin barra final)
API_GATEWAY_URL=http://localhost:8080
```

> El Frontend solo necesita conocer la dirección del API Gateway; es el gateway quien conoce y enruta hacia cada microservicio. La variable se lee únicamente en el servidor (Server Actions), por eso **no** lleva el prefijo `NEXT_PUBLIC_`.

## Ejecución

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Genera la versión optimizada de producción |
| `npm run start` | Ejecuta la versión de producción (requiere `build` previo) |
| `npm run lint` | Revisa el código con ESLint |

## Vistas y endpoints consumidos

Todas las rutas se consumen a través del API Gateway (`API_GATEWAY_URL` + endpoint), que las dirige al microservicio indicado.

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

Con el API Gateway y los microservicios en ejecución, y el Frontend en `npm run dev`:

1. Iniciar sesión con credenciales válidas → se recibe el token y se redirige a `/admin`.
2. Iniciar sesión con contraseña incorrecta → se muestra el error de credenciales.
3. Entrar a `/admin` sin sesión → se redirige a `/login`.
4. Crear una materia y luego una tarea asociada → ambas aparecen en sus listados.
5. Detener `tareas-service` y abrir `/admin/tareas` → se muestra "servicio no disponible" y las demás vistas siguen funcionando.
6. Detener `usuarios-service` e intentar iniciar sesión → se muestra "servicio de autenticación no disponible temporalmente".

## Dependencias

### Librerías principales

Ver `package.json` para la lista completa y las versiones exactas.

| Paquete | Versión | Uso |
|---|---|---|
| `next` | 16.3.5 | Framework |
| `react`, `react-dom` | 19.2.8 | Interfaz |
| `zod` | ^4.6.5 | Validación de contratos |
| `shadcn`, `radix-ui`, `class-variance-authority` | ^4.21.0 / ^1.6.7 / ^0.7.1 | Componentes de interfaz |
| `lucide-react` | ^1.50.0 | Íconos |
| `motion`, `tw-animate-css` | ^13.4.0 / ^1.4.0 | Animaciones |
| `tailwindcss` (dev) | ^4 | Estilos |
| `typescript` (dev) | ^5 | Tipado |
| `eslint`, `eslint-config-next` (dev) | ^9 / 16.3.5 | Revisión de código |

### Servicios que deben estar activos

| Servicio | Necesario para |
|---|---|
| API Gateway | Punto de entrada de todas las peticiones (**obligatorio**) |
| usuarios-service | Inicio de sesión, registro y validación del token (**obligatorio**) |
| materias-service | Vista de materias |
| tareas-service | Vistas de tareas y calendario |
| grupos-service | Vista de grupos |
| notificaciones-service | Centro de notificaciones |
| estadisticas-service | Panel de inicio |

Sin el API Gateway o sin `usuarios-service` no es posible iniciar sesión; los demás servicios pueden fallar de forma independiente sin detener la plataforma.