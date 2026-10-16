"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import {
    Children,
    createContext,
    isValidElement,
    useContext,
    useEffect,
    useRef,
    useState,
    type ComponentProps,
    type ReactNode,
} from "react";

/* ---------- Config ---------- */

type Size = "sm" | "md" | "lg";
type ImageStatus = "loading" | "loaded" | "error";

const sizes: Record<Size, { box: string; text: string; badge: string; overlap: number }> = {
  sm: { box: "size-8", text: "text-[11px]", badge: "size-3.5", overlap: -10 },
  md: { box: "size-10", text: "text-xs", badge: "size-4", overlap: -12 },
  lg: { box: "size-14", text: "text-sm", badge: "size-5", overlap: -16 },
};

// Colores del fallback: siempre el mismo para el mismo usuario
const palette = [
  "bg-ink text-amber",
  "bg-amber text-ink",
  "bg-ink-soft text-cream",
  "bg-[#2F4858] text-amber",
  "bg-[#3D5A4C] text-cream",
  "bg-[#7A4E2D] text-cream",
  "bg-[#5B4B8A] text-cream",
  "bg-[#B5523B] text-cream",
];

function colorFromSeed(seed: string | number) {
  let hash = 0;
  for (const ch of String(seed)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ---------- Contextos ---------- */

type AvatarContextValue = {
  size: Size;
  status: ImageStatus;
  setStatus: (status: ImageStatus) => void;
};

const AvatarContext = createContext<AvatarContextValue | null>(null);
const GroupContext = createContext<{ size: Size } | null>(null);

function useAvatar() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("Los componentes Avatar* deben ir dentro de <Avatar>");
  return ctx;
}

/* ---------- Avatar ---------- */

type AvatarProps = Omit<ComponentProps<typeof motion.span>, "children"> & {
  size?: Size;
  children?: ReactNode;
};

export function Avatar({ size, className, children, ...props }: AvatarProps) {
  const group = useContext(GroupContext);
  const finalSize = size ?? group?.size ?? "md";
  const [status, setStatus] = useState<ImageStatus>("loading");
  const reduceMotion = useReducedMotion();

  return (
    <AvatarContext.Provider value={{ size: finalSize, status, setStatus }}>
      <motion.span
        data-slot="avatar"
        // Dentro de un grupo la entrada la anima el grupo (en cascada)
        initial={reduceMotion || group ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={reduceMotion ? undefined : { y: -3 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        className={cx(
          "relative inline-flex shrink-0 select-none rounded-full ring-2 ring-white",
          sizes[finalSize].box,
          className,
        )}
        {...props}
      >
        {children}
      </motion.span>
    </AvatarContext.Provider>
  );
}

/* ---------- AvatarImage ---------- */

type AvatarImageProps = Omit<ComponentProps<typeof motion.img>, "onLoad" | "onError">;

export function AvatarImage({ src, alt = "", className, ...props }: AvatarImageProps) {
  const { status, setStatus } = useAvatar();
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) return setStatus("error");
    // Si la imagen ya estaba en caché, onLoad puede dispararse antes de hidratar
    const img = ref.current;
    if (img?.complete) setStatus(img.naturalWidth > 0 ? "loaded" : "error");
    else setStatus("loading");
  }, [src, setStatus]);

  if (!src || status === "error") return null;

  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      onLoad={() => setStatus("loaded")}
      onError={() => setStatus("error")}
      initial={{ opacity: 0 }}
      animate={{ opacity: status === "loaded" ? 1 : 0 }}
      className={cx("absolute inset-0 size-full rounded-full object-cover", className)}
      {...props}
    />
  );
}

/* ---------- AvatarFallback ---------- */

type AvatarFallbackProps = {
  seed?: string | number; // ej: usuario_id → define el color
  className?: string;
  children: ReactNode;
};

export function AvatarFallback({ seed = "", className, children }: AvatarFallbackProps) {
  const { size, status } = useAvatar();

  return (
    <AnimatePresence>
      {status !== "loaded" && (
        <motion.span
          key="fallback"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cx(
            "flex size-full items-center justify-center rounded-full font-mono font-semibold uppercase",
            sizes[size].text,
            className ?? colorFromSeed(seed),
          )}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ---------- AvatarBadge ---------- */

type AvatarBadgeProps = {
  label?: string; // ej: "Líder" → tooltip y lector de pantalla
  className?: string;
  children?: ReactNode;
};

export function AvatarBadge({ label, className, children }: AvatarBadgeProps) {
  const { size } = useAvatar();
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      data-slot="avatar-badge"
      role={label ? "img" : undefined}
      aria-label={label}
      title={label}
      initial={reduceMotion ? false : { scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 14, delay: 0.2 }}
      className={cx(
        "absolute -right-1 -bottom-1 z-10 flex items-center justify-center rounded-full ring-2 ring-white",
        sizes[size].badge,
        className ?? "bg-amber text-ink",
      )}
    >
      {children}
    </motion.span>
  );
}

/* ---------- AvatarGroup ---------- */

type AvatarGroupProps = {
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ItemCustom = { index: number; overlap: number; reduceMotion: boolean };

const groupVariants: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.06 } },
  abierto: { transition: { staggerChildren: 0.03 } },
  cerrado: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants: Variants = {
  oculto: { opacity: 0, scale: 0.5, y: 6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 20 } },
  // Abanico: al pasar el mouse los avatares se separan
  abierto: ({ index, reduceMotion, overlap }: ItemCustom) => ({
    marginLeft: index === 0 ? 0 : reduceMotion ? overlap : 6,
    transition: { type: "spring", stiffness: 350, damping: 24 },
  }),
  cerrado: ({ index, overlap }: ItemCustom) => ({
    marginLeft: index === 0 ? 0 : overlap,
    transition: { type: "spring", stiffness: 350, damping: 24 },
  }),
};

export function AvatarGroup({ size = "md", className, children }: AvatarGroupProps) {
  const [abierto, setAbierto] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const items = Children.toArray(children).filter(isValidElement);
  const { overlap } = sizes[size];

  return (
    <GroupContext.Provider value={{ size }}>
      <motion.div
        data-slot="avatar-group"
        role="group"
        variants={groupVariants}
        initial={reduceMotion ? false : ["oculto", "cerrado"]}
        animate={["visible", abierto ? "abierto" : "cerrado"]}
        onHoverStart={() => setAbierto(true)}
        onHoverEnd={() => setAbierto(false)}
        onFocus={() => setAbierto(true)}
        onBlur={() => setAbierto(false)}
        className={cx("flex items-center", className)}
      >
        {items.map((child, index) => (
          <motion.div
            key={child.key ?? index}
            custom={{ index, overlap, reduceMotion } satisfies ItemCustom}
            variants={itemVariants}
            style={{ zIndex: items.length - index }}
            className="relative"
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </GroupContext.Provider>
  );
}

/* ---------- AvatarGroupCount ---------- */

type AvatarGroupCountProps = {
  className?: string;
  children: ReactNode;
};

export function AvatarGroupCount({ className, children }: AvatarGroupCountProps) {
  const group = useContext(GroupContext);
  const size = group?.size ?? "md";

  return (
    <span
      data-slot="avatar-group-count"
      className={cx(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-soft font-mono font-semibold text-cream ring-2 ring-white",
        sizes[size].box,
        sizes[size].text,
        className,
      )}
    >
      {/* Si el número cambia (+3 → +4), el viejo sube y el nuevo entra desde abajo */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(children)}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}