// Função para extrair o ID da reserva da URL
function getIdReservaFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Função utilitária para formatar datas em pt-BR
function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
}

// Função principal para carregar os detalhes da reserva
async function carregarDetalhesReserva() {
    const idReserva = getIdReservaFromUrl();
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    const container = document.querySelector('.detalhes-reserva-container');
    container.innerHTML = '<p>Carregando detalhes da reserva...</p>';

    if (!usuarioLogado || !usuarioLogado.token) {
        container.innerHTML = '<p>Cliente não autenticado.</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/reservas/${idReserva}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${usuarioLogado.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes da reserva.');
        }

        const reserva = await response.json();
        preencherDetalhes(reserva);

    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        container.innerHTML = '<p>Erro ao carregar detalhes da reserva.</p>';
    }
}

// Função para preencher a tela com os dados da reserva
function preencherDetalhes(reserva) {
        console.log("Dados da reserva recebidos:", reserva);
    const imagensTipoQuarto = {
        1: 'img/quarto 1.jpg',
        2: 'img/quarto 2.jpg',
        3: 'img/quarto 3.jpg',
        4: 'img/quarto 4.jpg',
        5: 'img/quarto 5.png',
        6: 'img/quarto 6.png',
        7: 'img/quarto 7.png',
        8: 'img/quarto 8.png'
    };

    const imagem = imagensTipoQuarto[reserva.FK_TIPOQUARTO_idTipoQuarto] || 'img/default.jpg';

    const container = document.querySelector('.detalhes-reserva-container');
    container.innerHTML = `
        <h1 class="titulo-detalhes">
            <a href="historicoReserva.html"><i class="fa-solid fa-chevron-left"></i></a>
            Detalhes da Reserva
        </h1>

        <div class="reserva-detalhes">
            <img src="${imagem}" alt="Imagem do quarto" class="imagem-quarto">
            <div class="info-quarto">
                <h2>Reserva #${reserva.idReserva}</h2>
                <p><strong>Check-in:</strong> ${formatarData(reserva.dtInicial)}</p>
                <p><strong>Check-out:</strong> ${formatarData(reserva.dtFinal)}</p>
                <p><strong>Status:</strong> ${reserva.statusReserva}</p>
                <p><strong>Hóspedes:</strong> ${reserva.qntPessoas}</p>
                <p>Total: R$ ${parseFloat(reserva.valorTotal).toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    `;
}

// Chama a função ao carregar a página
window.onload = carregarDetalhesReserva;
