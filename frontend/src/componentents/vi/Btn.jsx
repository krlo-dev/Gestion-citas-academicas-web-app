import "../../styles/ui.css";

/**
 * Btn — botón reutilizable con variantes y tamaños.
 * @param {"primary"|"danger"|"ghost"|"outline"} variant
 * @param {"sm"|"md"|"lg"} size
 * @param {boolean} fullWidth   - ocupa el 100% del contenedor
 * @param {boolean} disabled
 * @param {function} onClick
 */
export default function Btn({
  children,
  onClick,
  variant  = "primary",
  size     = "md",
  fullWidth = false,
  disabled  = false,
  type      = "button",
  className = "",
  style,
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
