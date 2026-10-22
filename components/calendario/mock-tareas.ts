import type { Tarea } from "./tipos";

// Datos de ejemplo: siempre caen en el mes actual.
const hoy = new Date();
const anio = hoy.getFullYear();
const mes = String(hoy.getMonth() + 1).padStart(2, "0");
const dia = (n: number) => `${anio}-${mes}-${String(n).padStart(2, "0")}`;

export const MATERIAS_MOCK: Record<number, string> = {
  4: "Sistemas Distribuidos",
  7: "Bases de Datos",
  9: "Cálculo Integral",
  12: "Ingeniería de Software",
};

export const mockTareas: Tarea[] = [
  { tarea_id: 1, titulo: "Contrato de interfaz", materia_id: 4, fecha_entrega: dia(3), hora_entrega: "18:00", prioridad: "alta", estado: "completada" },
  { tarea_id: 2, titulo: "Taller de normalización", materia_id: 7, fecha_entrega: dia(5), hora_entrega: "23:59", prioridad: "media", estado: "completada" },
  { tarea_id: 3, titulo: "Quiz de integrales", materia_id: 9, fecha_entrega: dia(8), hora_entrega: "10:00", prioridad: "baja", estado: "cancelada" },
  { tarea_id: 4, titulo: "Diagrama de arquitectura", materia_id: 4, fecha_entrega: dia(10), hora_entrega: "14:30", prioridad: "alta", estado: "en_progreso" },
  { tarea_id: 5, titulo: "Exposición de requisitos", materia_id: 12, fecha_entrega: dia(10), hora_entrega: "08:00", prioridad: "media", estado: "pendiente" },
  { tarea_id: 6, titulo: "Lectura capítulo 4", materia_id: 12, fecha_entrega: dia(10), prioridad: "baja", estado: "pendiente" },
  { tarea_id: 7, titulo: "Consultas SQL avanzadas", materia_id: 7, fecha_entrega: dia(10), hora_entrega: "20:00", prioridad: "media", estado: "en_progreso" },
  { tarea_id: 8, titulo: "Entrega del frontend", materia_id: 4, fecha_entrega: dia(15), hora_entrega: "18:00", prioridad: "alta", estado: "pendiente" },
  { tarea_id: 9, titulo: "Parcial de cálculo", materia_id: 9, fecha_entrega: dia(17), hora_entrega: "07:00", prioridad: "alta", estado: "pendiente" },
  { tarea_id: 10, titulo: "Modelo entidad-relación", materia_id: 7, fecha_entrega: dia(20), hora_entrega: "12:00", prioridad: "media", estado: "en_progreso" },
  { tarea_id: 11, titulo: "Informe de pruebas", materia_id: 12, fecha_entrega: dia(22), hora_entrega: "17:00", prioridad: "baja", estado: "pendiente" },
  { tarea_id: 12, titulo: "Taller de series", materia_id: 9, fecha_entrega: dia(25), prioridad: "media", estado: "pendiente" },
  { tarea_id: 13, titulo: "Presentación final", materia_id: 4, fecha_entrega: dia(28), hora_entrega: "09:00", prioridad: "alta", estado: "pendiente" },
];
