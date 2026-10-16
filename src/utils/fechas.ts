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