import "../../styles/ui.css";

/**
 * Card — superficie elevada genérica.
 * @param {string} className  - clases CSS adicionales
 * @param {object} style      - estilos inline extra (p.ej. border-left dinámico)
 * @param {React.ReactNode} children
 */
export default function Card({ children, className = "", style }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}
