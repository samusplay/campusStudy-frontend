// Quién "envía" cada carta, según el tipo de notificación
const REMITENTES: Record<string, string> = {
  tarea: "Tareas",
  grupo: "Grupos",
  materia: "Materias",
};

export const remitenteDe = (tipo: string) => REMITENTES[tipo] ?? "CampusStudy";