import type { Tarea } from "./tipos";

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const DIAS_LARGOS = [
  "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado",
];

const pad = (n: number) => String(n).padStart(2, "0");

export const aISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const hoyISO = () => aISO(new Date());

export interface CeldaDia {
  iso: string;
  dia: number;
  delMes: boolean;
}

// Cuadrícula del mes, empezando en lunes. 5 o 6 semanas completas.
export function celdasDelMes(anio: number, mes: number): CeldaDia[] {
  const offset = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const diasMes = new Date(anio, mes + 1, 0).getDate();
  const total = Math.ceil((offset + diasMes) / 7) * 7;

  return Array.from({ length: total }, (_, i) => {
    const d = new Date(anio, mes, 1 - offset + i);
    return { iso: aISO(d), dia: d.getDate(), delMes: d.getMonth() === mes };
  });
}

export function agruparPorFecha(tareas: Tarea[]): Record<string, Tarea[]> {
  const mapa: Record<string, Tarea[]> = {};
  for (const t of tareas) (mapa[t.fecha_entrega] ??= []).push(t);
  for (const lista of Object.values(mapa)) {
    lista.sort(
      (a, b) =>
        (a.hora_entrega ?? "99:99").localeCompare(b.hora_entrega ?? "99:99") ||
        a.titulo.localeCompare(b.titulo)
    );
  }
  return mapa;
}

export function fechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dia = DIAS_LARGOS[new Date(y, m - 1, d).getDay()];
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} ${d} de ${MESES[m - 1].toLowerCase()} de ${y}`;
}
