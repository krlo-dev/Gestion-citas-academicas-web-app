import "../../styles/ui.css";

/**
 * Spinner — indicador de carga.
 * @param {string} text - texto opcional debajo del spinner
 */
export default function Spinner({ text = "Cargando..." }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" aria-label="Cargando" />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
