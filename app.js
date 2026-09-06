(() => {
  const dialog = document.querySelector('#signup-dialog');
  document.querySelectorAll('[data-open-signup]').forEach((button) => {
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
    filterCards();
  }));

  document.querySelectorAll('[data-billing]').forEach((button) => button.addEventListener('click', () => {
    const billing = button.dataset.billing;
    document.querySelectorAll('[data-billing]').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('.price').forEach((price) => { price.textContent = price.dataset[billing]; });
  }));
})();
