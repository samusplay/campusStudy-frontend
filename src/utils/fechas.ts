const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
const MESES_LARGOS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// "2026-10-15T17:55:12" → partes numéricas, sin pasar por Date (evita zonas horarias)
function partes(iso: string) {
  const [fecha, hora = "00:00:00"] = iso.split("T");
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const [h, m] = hora.split(":").map(Number);
  return { anio, mes, dia, h, m };
}

/** "15 de oct de 2026" */
export function fechaCorta(iso: string) {
  const { anio, mes, dia } = partes(iso);
  return `${dia} de ${MESES_CORTOS[mes - 1]} de ${anio}`;
}

/** "15 de octubre de 2026" */
export function fechaLarga(iso: string) {
  const { anio, mes, dia } = partes(iso);
  return `${dia} de ${MESES_LARGOS[mes - 1]} de ${anio}`;
}

/** "15 de oct de 2026, 5:55 p. m." */
export function fechaHora(iso: string) {
  const { h, m } = partes(iso);
  const hora12 = h % 12 || 12;
  const sufijo = h < 12 ? "a. m." : "p. m.";
  return `${fechaCorta(iso)}, ${hora12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

/** "2026-10-22": hoy en Colombia. Llamarla SOLO en el servidor y pasarla como prop. */
export function hoyColombia() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
}

/** "15 de nov de 2026, 5:10 p. m." — fecha ISO en UTC mostrada en hora de Colombia (sin Intl: igual en servidor y navegador) */
export function fechaHoraColombia(isoUtc: string) {
  // Colombia es UTC-5 todo el año (no tiene horario de verano): se restan 5 h y se leen los campos en UTC
  const d = new Date(new Date(isoUtc).getTime() - 5 * 60 * 60 * 1000);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const hora12 = h % 12 || 12;
  const sufijo = h < 12 ? "a. m." : "p. m.";
  return `${d.getUTCDate()} de ${MESES_CORTOS[d.getUTCMonth()]} de ${d.getUTCFullYear()}, ${hora12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

/** "hace un momento", "hace 5 minutos", "ayer"… `ahora` viene del servidor para que no cambie al hidratar */
export function haceCuanto(isoUtc: string, ahora: number) {
  const segundos = Math.max(0, Math.round((ahora - new Date(isoUtc).getTime()) / 1000));
  if (segundos < 60) return "hace un momento";

  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return minutos === 1 ? "hace 1 minuto" : `hace ${minutos} minutos`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return horas === 1 ? "hace 1 hora" : `hace ${horas} horas`;

  const dias = Math.floor(horas / 24);
  if (dias === 1) return "ayer";
  if (dias < 7) return `hace ${dias} días`;

  return fechaHoraColombia(isoUtc).split(",")[0]; // más de una semana: "8 de nov de 2026"
}