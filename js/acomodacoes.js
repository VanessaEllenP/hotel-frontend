let paginaAtual = 1;
const quartosPorPagina = 2;

// Mapeamento do idQuarto para a imagem correspondente
const imagensMap = {
  1: 'img/quarto 1.jpg',
  2: 'img/quarto 2.jpg',
  3: 'img/quarto 3.jpg',
  4: 'img/quarto 4.jpg',
  5: 'img/quarto 5.png',
  6: 'img/quarto 6.png',
  7: 'img/quarto 7.png',
  8: 'img/quarto 8.png'
};

async function carregarQuartos() {
  const container = document.getElementById('quartos-container');
  container.innerHTML = ''; // Limpa conteúdo atual

  try {
    const response = await fetch('https://hotel-backend-la2w.onrender.com/api/quartos/com-tipo');
    const quartos = await response.json();

    const inicio = (paginaAtual - 1) * quartosPorPagina;
    const fim = inicio + quartosPorPagina;
    const quartosPagina = quartos.slice(inicio, fim);

    quartosPagina.forEach((quarto) => {
      const card = document.createElement('div');
      card.classList.add('card-quarto');

      // Pega imagem pelo idQuarto, ou imagem padrão se não existir
      const imgSrc = imagensMap[quarto.idQuarto] || 'img/default.jpg';

      // Link para página quarto.html com id do quarto na URL
      const pagina = `quarto.html?id=${quarto.idQuarto}`;

      // Formata preço, caso não tenha valor exibe "Indisponível"
      const precoFormatado = (quarto.tipoValor && !isNaN(Number(quarto.tipoValor)))
        ? Number(quarto.tipoValor).toFixed(2).replace('.', ',')
        : 'Indisponível';

      card.innerHTML = `
        <img src="${imgSrc}" alt="Imagem do quarto ${quarto.numero}">
        <h2>${quarto.numero}</h2>
        <p>${quarto.tipoDescricao}</p>
        <button class="btn-preco" data-pagina="${pagina}">Preço: R$ ${precoFormatado}</button>
      `;

      container.appendChild(card);
    });

    document.getElementById('numero-pagina').textContent = `Página ${paginaAtual}`;
    document.getElementById('pagina-anterior').disabled = paginaAtual === 1;
    document.getElementById('proxima-pagina').disabled = paginaAtual * quartosPorPagina >= quartos.length;

    adicionarEventosBotoesPreco();

  } catch (error) {
    console.error('Erro ao carregar quartos:', error);
    container.innerHTML = '<p>Erro ao carregar quartos.</p>';
  }
}

function adicionarEventosBotoesPreco() {
  const botoes = document.querySelectorAll('.btn-preco');
  botoes.forEach(botao => {
    botao.addEventListener('click', function () {
      const paginaDestino = this.getAttribute('data-pagina');
      window.location.href = paginaDestino;
    });
  });
}

function proximaPagina() {
  paginaAtual++;
  carregarQuartos();
}

function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    carregarQuartos();
  }
}

window.onload = carregarQuartos;
