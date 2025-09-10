/**
 * Cierra un modal identificado por su atributo `data-modal`.
 *
 * Busca en el documento un elemento cuyo atributo `data-modal` coincida
 * con la clave proporcionada. Si existe, lo elimina del DOM.
 *
 * @param {string} modalKey  Clave que coincide con el valor de `data-modal`.
 * @returns {void}
 */
export const cerrarModal = (modalKey) => {
  const modal = document.querySelector(`[data-modal="${modalKey}"]`);
  if (!modal) return;

  modal.remove();
};
