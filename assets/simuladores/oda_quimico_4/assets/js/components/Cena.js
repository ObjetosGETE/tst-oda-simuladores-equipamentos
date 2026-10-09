import { el } from '../utils/dom.js';
import { resolverImagem } from '../utils/caminhos.js';

/**
 * Fundo do palco: imagem ou vídeo.
 * Se "video" vier preenchido, toca o vídeo (sem som, uma vez) no lugar da imagem;
 * a imagem fica como "poster" enquanto o vídeo carrega.
 * Se "placeholder" vier preenchido, desenha uma área tracejada com o texto
 * (usado enquanto um render ainda não existe).
 * frente: imagem transparente por cima (ex.: vidro em primeiro plano do cenário).
 * fundo: imagem desfocada atrás (para close-ups em PNG transparente).
 * zoom: amplia a parte de cima da imagem (esconde o texto que vem
 * gravado no rodapé de cenario_introducao.png).
 */
export function Cena({ imagem, placeholder, zoom, video, fundo, frente }) {
  let midia;
  if (video) {
    midia = el('video', {
      class: 'cena__img',
      src: video,
      poster: resolverImagem(imagem),
      autoplay: '',
      playsinline: '',
      preload: 'auto',
    });
    midia.muted = true; // necessário para o autoplay funcionar em todos os navegadores
  } else {
    midia = el('img', { class: 'cena__img', src: resolverImagem(imagem), alt: '', draggable: 'false' });
  }

  return el(
    'div',
    { class: `cena ${zoom || placeholder ? 'cena--zoom' : ''}` },
    fundo && el('img', { class: 'cena__fundo', src: resolverImagem(fundo), alt: '', draggable: 'false' }),
    midia,
    frente && el('img', { class: 'cena__frente', src: resolverImagem(frente), alt: '', draggable: 'false' }),
    placeholder && el('div', { class: 'cena__placeholder' }, placeholder),
  );
}

/** Pré-carrega uma lista de imagens para evitar "piscadas". */
export function preCarregar(lista) {
  lista.forEach((src) => {
    const i = new Image();
    i.src = resolverImagem(src);
  });
}
