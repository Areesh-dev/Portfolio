
export function setPageMeta({ title, description }) {
  if (title) document.title = title;

  const ensureMeta = (attr, value, content) => {
    let el = document.head.querySelector(`meta[${attr}="${value}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, value);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  if (description) {
    ensureMeta('name', 'description', description);
    ensureMeta('property', 'og:description', description);
  }
  if (title) {
    ensureMeta('property', 'og:title', title);
  }
  ensureMeta('property', 'og:type', 'website');
}
