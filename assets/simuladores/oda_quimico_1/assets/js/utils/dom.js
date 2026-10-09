/**
 * Cria um elemento HTML de forma curta.
 * el('div', { class: 'x', onClick: fn }, 'texto', outroEl)
 */
export function el(tag, props = {}, ...filhos) {
  const node = document.createElement(tag);

  Object.entries(props).forEach(([chave, valor]) => {
    if (valor === undefined || valor === null || valor === false) return;
    if (chave === 'class') node.className = valor;
    else if (chave === 'html') node.innerHTML = valor;
    else if (chave === 'style' && typeof valor === 'object') Object.assign(node.style, valor);
    else if (chave.startsWith('on')) node.addEventListener(chave.slice(2).toLowerCase(), valor);
    else node.setAttribute(chave, valor);
  });

  filhos.flat(Infinity).forEach((f) => {
    if (f === undefined || f === null || f === false) return;
    node.append(f instanceof Node ? f : document.createTextNode(f));
  });

  return node;
}

/** Remove todos os filhos de um elemento. */
export function limpar(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/** Promessa simples de espera. */
export const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
