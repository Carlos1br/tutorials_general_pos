(() => {
  let theme = 'dark';
  try {
    const saved = localStorage.getItem('tutorials-theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch {}
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.page = location.pathname.endsWith('guia-kubernetes.html') ? 'kubernetes' : location.pathname.endsWith('guia-oficina-ecr.html') ? 'ecr' : 'library';
})();
