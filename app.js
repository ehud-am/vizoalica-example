(() => {
  const config = window.VIZOALICA_CONFIG;

  // Embed only when the deployment has supplied public analytics settings.
  if (config?.scriptUrl && config?.endpoint && config?.source) {
    const script = document.createElement('script');
    script.async = true;
    script.src = config.scriptUrl;
    script.dataset.endpoint = config.endpoint;
    script.dataset.source = config.source;
    script.dataset.project = config.project || 'northstar-demo';
    script.dataset.consent = config.consent || 'analytics-granted';
    if (config.tokenUrl) script.dataset.tokenUrl = config.tokenUrl;
    document.head.append(script);
  }

  const track = (name, properties = {}) => {
    window.vizoalica?.track(name, { properties });
  };

  document.querySelectorAll('[data-track]').forEach((element) => {
    element.addEventListener('click', () => track(element.dataset.track, { plan: element.dataset.plan }));
  });

  const dialog = document.querySelector('#signup-dialog');
  document.querySelectorAll('[data-track$="started"], [data-track="preview_new_note"]').forEach((button) => {
    button.addEventListener('click', () => dialog?.showModal());
  });
  dialog?.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

  const search = document.querySelector('#library-search');
  const cards = [...document.querySelectorAll('.library-card')];
  const empty = document.querySelector('.empty-state');
  let category = 'all';
  const filterCards = () => {
    const query = search?.value.toLowerCase().trim() || '';
    let shown = 0;
    cards.forEach((card) => {
      const matches = (category === 'all' || card.dataset.category === category) && card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) shown += 1;
    });
    if (empty) empty.hidden = shown !== 0;
  };
  search?.addEventListener('input', filterCards);
  document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
    category = button.dataset.filter;
    document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button));
    track('library_filtered', { category });
    filterCards();
  }));

  document.querySelectorAll('[data-billing]').forEach((button) => button.addEventListener('click', () => {
    const billing = button.dataset.billing;
    document.querySelectorAll('[data-billing]').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('.price').forEach((price) => { price.textContent = price.dataset[billing]; });
    track('billing_changed', { billing });
  }));
})();
