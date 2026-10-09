/**
 * Centraliza os caminhos das imagens.
 * Se trocar a pasta de assets, altere apenas aqui.
 */
export const IMG = 'assets/img/';

/** Pasta dos renders da situação. Troque aqui para usar outro conjunto. */
export const PASTA_RENDERS = 'renders';

/** Render numerado: render('07') -> assets/img/renders/07.png */
export const render = (id) => `${IMG}${PASTA_RENDERS}/${id}.png`;

/** Imagem solta da pasta img */
export const img = (arquivo) => `${IMG}${arquivo}`;

/** Resolve qualquer valor de imagem vindo dos dados. */
export function resolverImagem(valor) {
  if (!valor) return '';
  if (/^\d+(_\d+)?$/.test(valor)) return render(valor); // "07" ou "01_1"
  if (valor.startsWith('assets/')) return valor; // caminho completo
  return img(valor); // "cenario_introducao.png" ou "export img oda/x.png"
}
