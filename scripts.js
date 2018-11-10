const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;

  function load() {
    const container = domains.querySelector('.results');
    const div = document.createElement('div');
    const img = document.createElement('img');

    div.classList.add('loading');
    img.src = 'loading.gif';
    div.appendChild(img);
    div.appendChild(document.createTextNode('Leita að léni...'));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(div);
  }

  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }

  function el(type, text) {
    const element = document.createElement(type);
    element.appendChild(document.createTextNode(text));
    return element;
  }

  function formatDate(date) {
    const d = new Date(date);
    let month = d.getMonth() + 1;
    let day = d.getDate();
    const year = d.getFullYear();

    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    return [year, month, day].join('-');
  }

  function displayDomain(domainsList) {
    if (domainsList.length === 0) {
      displayError('Lén er ekki skráð');
      return;
    }

    const [{
      domain, registered, lastChange, expires, registrantname,
      email, address, country,
    }] = domainsList;

    const dl = document.createElement('dl');

    dl.appendChild(el('dt', 'Lén'));
    dl.appendChild(el('dd', domain));

    dl.appendChild(el('dt', 'Skráð'));
    dl.appendChild(el('dd', formatDate(registered)));

    dl.appendChild(el('dt', 'Seinast breytt'));
    dl.appendChild(el('dd', formatDate(lastChange)));

    dl.appendChild(el('dt', 'Rennur út'));
    dl.appendChild(el('dd', formatDate(expires)));

    if (registrantname) {
      dl.appendChild(el('dt', 'Skráningaraðili'));
      dl.appendChild(el('dd', registrantname));
    }

    if (email) {
      dl.appendChild(el('dt', 'Netfang'));
      dl.appendChild(el('dd', email));
    }

    if (address) {
      dl.appendChild(el('dt', 'Heimilisfang'));
      dl.appendChild(el('dd', address));
    }

    dl.appendChild(el('dt', 'Land'));
    dl.appendChild(el('dd', country));

    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(dl);
  }

  function fetchData(path) {
    fetch(`${API_URL}${path}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error();
      })
      .then((data) => {
        displayDomain(data.results);
      })
      .catch((error) => {
        displayError('Villa við að sækja gögn');
        console.error(error); /* eslint-disable-line */
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const str = input.value.replace(/\s/g, '');

    if (str.length) {
      load();
      window.onload = fetchData(input.value);
    } else {
      displayError('Lén verður að vera strengur');
      input.value = '';
    }
  }

  function init(_domains) {
    domains = _domains;
    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');

  program.init(domains);
});
