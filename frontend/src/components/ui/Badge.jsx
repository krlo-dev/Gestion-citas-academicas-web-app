import "../../styles/ui.css";

const VARIANTS = ["default", "danger", "success", "warning", "info", "gray"];

/**
 * Badge — etiqueta de estado pequeña con color semántico.
 * @param {"default"|"danger"|"success"|"warning"|"info"|"gray"} variant
 */
export default function Badge({ children, variant = "default" }) {
  const safeVariant = VARIANTS.includes(variant) ? variant : "default";
  return (
    <span className={`badge badge-${safeVariant}`}>
      {children}
    </span>
  );
}
