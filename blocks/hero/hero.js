/* eslint-disable indent */
/* eslint-disable no-plusplus */
// create a function that is a tag template lieral for html and just retruns the same string
/**
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 */
function html(strings, ...values) {
  let str = '';
  strings.forEach((string, i) => {
    str += string + (values[i] || '');
  });
  return str;
}

export default async function hero(block) {
  const blockCpy = block.cloneNode(true);
  const title = block.querySelector('h1');
  const slides = [...blockCpy.children].slice(0, -1);

  const div = document.createElement('div');
  div.innerHTML = html`
    <div class="slides-wrapper">
      <div class="slides"></div>
      <div class="slides-control"></div>
    </div>
    <div class="content">
      <div class="title">
        <h1>${title.innerHTML}</h1>
      </div>
    </div>
  `;

  // add slides
  const slidesDiv = div.querySelector('.slides');
  slides.forEach((slide, idx) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slide');
    if (idx === 0) slideDiv.classList.add('active');
    slideDiv.innerHTML = slide.innerHTML;
    const maybeYTLink = slideDiv.firstElementChild?.querySelector('a');
    if (maybeYTLink && maybeYTLink.href.includes('youtube.com')) {
      const ytEmbed = document.createElement('div');
      ytEmbed.classList.add('yt-embed');
      ytEmbed.innerHTML = html`
        <iframe
          loading="lazy"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/${maybeYTLink.href
            .split('/')
            .pop()}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen=""></iframe>
      `;
      slideDiv.firstElementChild?.replaceWith(ytEmbed);
    }
    slidesDiv?.appendChild(slideDiv);
  });

  // const ul = document.createElement('ul');
  const slidesControl = div.querySelector('.slides-control');
  for (let i = 0; i < slides.length; i++) {
    const btn = document.createElement('button');
    btn.setAttribute('data-slide', i.toString());
    if (i === 0) btn.classList.add('active');
    slidesControl?.appendChild(btn);
  }

  slidesControl?.addEventListener('click', (e) => {
    const { target } = e;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest('button');
    if (!btn) return;
    const idx = btn.dataset.slide ?? 0;
    const activeSlide = slidesDiv?.querySelector('.active');
    const activeBtn = slidesControl.querySelector('.active');
    activeSlide?.classList.remove('active');
    activeBtn?.classList.remove('active');
    slidesDiv?.children[idx]?.classList.add('active');
    btn.classList.add('active');
  });

  block.textContent = '';
  block.appendChild(div);
}
