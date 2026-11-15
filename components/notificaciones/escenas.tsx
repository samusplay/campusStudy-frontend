// Ilustraciones de los sellos: personajes y objetos del campus, en SVG con la paleta de CampusStudy.
// Todas usan viewBox 0 0 60 60.

const C = {
  cielo: "#f6efe3",
  sol: "#e8a33d",
  tinta: "#1b2236",
  azul: "#4a7bb5",
  mar: "#7fa7c9",
  verde: "#5f8a5b",
  arena: "#e9d3a8",
  cafe: "#8a5a3b",
  rosa: "#e0786d",
  blanco: "#fffdf8",
};

/** Michi: un gato con gafas sobre una pila de libros */
function Michi() {
  return (
    <>
      <rect width="60" height="60" fill={C.cielo} />
      <rect x="12" y="44" width="36" height="7" rx="1" fill={C.azul} />
      <rect x="15" y="37" width="30" height="7" rx="1" fill={C.sol} />
      <path d="M39 34c6 0 8-6 4-9" stroke={C.tinta} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="30" cy="31" rx="9" ry="7" fill={C.tinta} />
      <circle cx="30" cy="22" r="7" fill={C.tinta} />
      <path d="M24 18l-1-7 5 4zM36 18l1-7-5 4z" fill={C.tinta} />
      <circle cx="27.5" cy="22" r="1.4" fill={C.sol} />
      <circle cx="32.5" cy="22" r="1.4" fill={C.sol} />
      <g stroke={C.blanco} strokeWidth=".8" fill="none">
        <circle cx="27.5" cy="22" r="2.6" />
        <circle cx="32.5" cy="22" r="2.6" />
      </g>
      <path d="M29 25h2l-1 1.2z" fill={C.rosa} />
    </>
  );
}

/** Grado: un perro con birrete */
function Grado() {
  return (
    <>
      <rect width="60" height="60" fill={C.cielo} />
      <path d="M17 28c-5 2-6 12-2 16 2-3 4-8 4-12z" fill={C.cafe} />
      <path d="M43 28c5 2 6 12 2 16-2-3-4-8-4-12z" fill={C.cafe} />
      <circle cx="30" cy="34" r="13" fill={C.arena} />
      <ellipse cx="30" cy="40" rx="6" ry="4.5" fill={C.blanco} />
      <circle cx="25" cy="31" r="1.5" fill={C.tinta} />
      <circle cx="35" cy="31" r="1.5" fill={C.tinta} />
      <ellipse cx="30" cy="37.5" rx="2.2" ry="1.6" fill={C.tinta} />
      <path
        d="M30 39v2.5c-1 1.5-3 1.5-4 .5M30 41.5c1 1.5 3 1.5 4 .5"
        stroke={C.tinta}
        strokeWidth=".8"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M29 43h2v2a1 1 0 0 1-2 0z" fill={C.rosa} />
      <path d="M22 21v4c0 2 16 2 16 0v-4l-8 3z" fill={C.tinta} />
      <path d="M30 12l16 6-16 6-16-6z" fill={C.tinta} />
      <path d="M46 18v8" stroke={C.sol} strokeWidth="1" />
      <circle cx="46" cy="27" r="1.3" fill={C.sol} />
    </>
  );
}

/** Búho: el compañero de las noches de estudio */
function Buho() {
  return (
    <>
      <rect width="60" height="60" fill={C.tinta} />
      <circle cx="47" cy="12" r="6" fill={C.sol} />
      <circle cx="50" cy="10" r="6" fill={C.tinta} />
      <circle cx="12" cy="10" r=".9" fill={C.blanco} />
      <circle cx="22" cy="6" r=".7" fill={C.blanco} />
      <circle cx="8" cy="22" r=".7" fill={C.blanco} />
      <path d="M4 50h52" stroke={C.cafe} strokeWidth="3" strokeLinecap="round" />
      <path d="M19 26l2-8 5 5zM41 26l-2-8-5 5z" fill={C.arena} />
      <ellipse cx="30" cy="36" rx="12" ry="14" fill={C.arena} />
      <ellipse cx="30" cy="40" rx="7" ry="8" fill={C.blanco} />
      <circle cx="25" cy="30" r="5" fill={C.blanco} />
      <circle cx="35" cy="30" r="5" fill={C.blanco} />
      <circle cx="25" cy="30" r="2.2" fill={C.tinta} />
      <circle cx="35" cy="30" r="2.2" fill={C.tinta} />
      <path d="M28.5 34h3L30 37z" fill={C.sol} />
      <path d="M26 50v-2M28 50v-2M32 50v-2M34 50v-2" stroke={C.sol} strokeWidth="1.2" />
    </>
  );
}

/** Café: la taza de las noches de parcial, sobre un libro abierto */
function Cafe() {
  return (
    <>
      <rect width="60" height="60" fill={C.cielo} />
      <path
        d="M6 48c8-3 16-3 24 0 8-3 16-3 24 0v6c-8-3-16-3-24 0-8-3-16-3-24 0z"
        fill={C.blanco}
        stroke={C.tinta}
        strokeWidth=".8"
      />
      <path d="M30 48v6" stroke={C.tinta} strokeWidth=".8" />
      <path
        d="M24 22c-2-3 2-4 0-8M29 22c-2-3 2-4 0-8M34 22c-2-3 2-4 0-8"
        stroke={C.tinta}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity=".5"
      />
      <path d="M39 30h3a4 4 0 0 1 0 8h-3" fill="none" stroke={C.tinta} strokeWidth="1.5" />
      <path d="M19 26h20v14a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z" fill={C.sol} stroke={C.tinta} strokeWidth="1" />
      <path d="M29 33.5c-1.5-2-4-.5-2.5 1.5l2.5 2.5 2.5-2.5c1.5-2-1-3.5-2.5-1.5z" fill={C.blanco} />
    </>
  );
}

/** Apuntes: cuaderno con un lápiz y una tarea chuleada */
function Apuntes() {
  return (
    <>
      <rect width="60" height="60" fill={C.cielo} />
      <rect x="12" y="10" width="30" height="40" rx="2" fill={C.blanco} stroke={C.tinta} strokeWidth="1" />
      <path d="M16 10v40" stroke={C.rosa} strokeWidth=".8" />
      <path d="M19 20h19M19 26h19M19 32h12M19 38h16" stroke={C.mar} strokeWidth="1" />
      <path d="M33 31l2 2 4-5" stroke={C.verde} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="rotate(35 42 38)">
        <rect x="38" y="16" width="7" height="4" fill={C.rosa} stroke={C.tinta} strokeWidth=".8" />
        <rect x="38" y="20" width="7" height="26" fill={C.sol} stroke={C.tinta} strokeWidth=".8" />
        <path d="M38 46h7l-3.5 6z" fill={C.arena} stroke={C.tinta} strokeWidth=".8" />
        <path d="M40.5 50.5h2l-1 1.5z" fill={C.tinta} />
      </g>
    </>
  );
}

/** Idea: un bombillo encendido */
function Idea() {
  return (
    <>
      <rect width="60" height="60" fill={C.cielo} />
      <path
        d="M30 6v5M14 14l3.5 3.5M46 14l-3.5 3.5M8 30h5M47 30h5"
        stroke={C.sol}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M30 14a14 14 0 0 0-8 25.5V44h16v-4.5A14 14 0 0 0 30 14z" fill={C.sol} stroke={C.tinta} strokeWidth="1" />
      <path d="M23 24a8 8 0 0 1 5-5" stroke={C.blanco} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M26 36l2-6 2 4 2-4 2 6" stroke={C.tinta} strokeWidth="1" fill="none" strokeLinejoin="round" />
      <rect x="23" y="44" width="14" height="3" rx="1" fill={C.tinta} />
      <rect x="24" y="47.5" width="12" height="3" rx="1" fill={C.tinta} />
      <path d="M27 51h6l-1 3h-4z" fill={C.tinta} />
    </>
  );
}

export const ESCENAS = [
  { nombre: "Michi", Dibujo: Michi },
  { nombre: "Grado", Dibujo: Grado },
  { nombre: "Búho", Dibujo: Buho },
  { nombre: "Café", Dibujo: Cafe },
  { nombre: "Apuntes", Dibujo: Apuntes },
  { nombre: "Idea", Dibujo: Idea },
] as const;