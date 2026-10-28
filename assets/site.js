(() => {
  const root = document.documentElement;
  const library = root.dataset.page === 'library';
  const bar = document.createElement('header');
  bar.className = 'sitebar';
  bar.innerHTML = '<div class="sitebar-inner"><a class="site-home" href="index.html"><span class="site-mark" aria-hidden="true">{ }</span><span class="site-name">Caderno de engenharia<small>PÓS-GRADUAÇÃO · FIAP</small></span></a><div class="site-actions"><a class="site-link" href="' + (library ? 'https://github.com/Carlos1br/tutorials_general_pos' : 'index.html') + '">' + (library ? 'GitHub ↗' : 'Todos os guias') + '</a><button class="icon-button theme-button" type="button"><span class="ui-icon" aria-hidden="true"></span></button></div></div><div class="progress-track" aria-hidden="true"><div class="progress-fill"></div></div>';
  document.body.prepend(bar);
  const themeButton = bar.querySelector('.theme-button');
  function updateThemeButton() {
    const label = root.dataset.theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
    themeButton.title = label;
    themeButton.setAttribute('aria-label', label);
  }
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('tutorials-theme', root.dataset.theme); } catch {}
    updateThemeButton();
  });
  updateThemeButton();

  const main = document.querySelector('main');
  if (!main.id) main.id = 'conteudo';
  if (!document.querySelector('.skip')) {
    const skip = document.createElement('a');
    skip.className = 'skip';
    skip.href = '#' + main.id;
    skip.textContent = 'Ir para o conteúdo';
    bar.before(skip);
  }
  const nav = main.querySelector('nav');
  if (!library && nav) {
    const contents = document.createElement('details');
    contents.className = 'contents';
    const summary = document.createElement('summary');
    summary.textContent = 'Neste guia';
    contents.append(summary);
    nav.before(contents);
    contents.append(nav);
    const breakpoint = matchMedia('(min-width: 761px)');
    const syncContents = () => { contents.open = breakpoint.matches; };
    syncContents();
    breakpoint.addEventListener('change', syncContents);
    if (root.dataset.page === 'ecr') {
      const reading = document.createElement('div');
      reading.className = 'reading-content';
      for (const node of [...main.childNodes]) if (node !== contents) reading.append(node);
      main.append(reading);
    } else main.querySelector('article').classList.add('reading-content');
    nav.addEventListener('click', (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor || breakpoint.matches) return;
      event.preventDefault();
      contents.open = false;
      const section = document.getElementById(anchor.hash.slice(1));
      if (section) {
        history.replaceState(null, '', anchor.hash);
        section.setAttribute('tabindex', '-1');
        section.focus({ preventScroll: true });
        section.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }
    });
    const anchors = [...nav.querySelectorAll('a[href^="#"]')];
    function markSection() {
      let active = anchors[0];
      for (const anchor of anchors) {
        const section = document.getElementById(anchor.hash.slice(1));
        if (section && section.getBoundingClientRect().top <= 160) active = anchor;
      }
      for (const anchor of anchors) {
        if (anchor === active) anchor.setAttribute('aria-current', 'location');
        else anchor.removeAttribute('aria-current');
      }
    }
    document.addEventListener('scroll', markSection, { passive: true });
    markSection();
    const navigation = document.createElement('nav');
    navigation.className = 'guide-navigation';
    navigation.setAttribute('aria-label', 'Navegação entre guias');
    navigation.innerHTML = root.dataset.page === 'ecr'
      ? '<a href="index.html"><small>BIBLIOTECA</small>← Todos os guias</a><a href="guia-kubernetes.html"><small>PRÓXIMO GUIA</small>Manifests Kubernetes →</a>'
      : '<a href="guia-oficina-ecr.html"><small>GUIA ANTERIOR</small>← Docker e Amazon ECR</a><a href="index.html"><small>BIBLIOTECA</small>Todos os guias →</a>';
    main.querySelector('.reading-content').append(navigation);
  }

  for (const table of document.querySelectorAll('table')) {
    if (table.parentElement.classList.contains('table-wrap')) continue;
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrap';
    table.before(wrapper);
    wrapper.append(table);
  }

  for (const pre of document.querySelectorAll('pre')) {
    const source = pre.textContent;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const label = document.createElement('span');
    label.textContent = /apiVersion:|volumeMounts:|^spec:/m.test(source) ? 'YAML' : /^(aws |docker |kubectl |set |cd |notepad )/m.test(source) ? 'TERMINAL' : 'REFERÊNCIA';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'icon-button copy-button';
    button.title = 'Copiar bloco';
    button.setAttribute('aria-label', 'Copiar bloco de ' + label.textContent.toLowerCase());
    button.innerHTML = '<span class="ui-icon" aria-hidden="true"></span>';
    const feedback = document.createElement('span');
    feedback.className = 'screen-reader';
    feedback.setAttribute('role', 'status');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(source);
        button.dataset.copied = 'true';
        button.title = 'Copiado';
        feedback.textContent = 'Bloco copiado.';
        setTimeout(() => { delete button.dataset.copied; button.title = 'Copiar bloco'; feedback.textContent = ''; }, 2000);
      } catch {
        button.title = 'Não foi possível copiar; selecione o texto do bloco.';
        feedback.textContent = 'Não foi possível copiar. Selecione o texto do bloco.';
      }
    });
    toolbar.append(label, feedback, button);
    pre.before(wrapper);
    wrapper.append(toolbar, pre);
  }
  if (!library) {
    const top = document.createElement('button');
    top.type = 'button';
    top.className = 'icon-button back-top';
    top.title = 'Voltar ao início';
    top.setAttribute('aria-label', top.title);
    top.innerHTML = '<span class="ui-icon" aria-hidden="true"></span>';
    top.hidden = true;
    top.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      bar.querySelector('a').focus({ preventScroll: true });
    });
    document.body.append(top);
    const fill = bar.querySelector('.progress-fill');
    function updateProgress() {
      const length = root.scrollHeight - innerHeight;
      fill.style.width = (length > 0 ? Math.min(100, scrollY / length * 100) : 0) + '%';
      top.hidden = scrollY < 500;
    }
    document.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }
})();
