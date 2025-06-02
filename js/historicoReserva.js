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

async function carregarHistoricoReservas() {
    const container = document.querySelector('.lista-reservas');
    container.innerHTML = ''; // limpa o conteúdo atual

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado || !usuarioLogado.token || !usuarioLogado.idCliente) {
        container.innerHTML = '<p>Cliente não autenticado.</p>';
        return;
    }

    const clienteId = usuarioLogado.idCliente;
    const token = usuarioLogado.token;

    try {
        const response = await fetch('http://localhost:3000/api/reservas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });


        if (!response.ok) {
            container.innerHTML = '<p>Erro ao carregar reservas: acesso não autorizado.</p>';
            return;
        }

        const reservas = await response.json();

        if (!Array.isArray(reservas) || reservas.length === 0) {
            container.innerHTML = '<p>Você ainda não possui reservas cadastradas.</p>';
            return;
        }

        reservas.forEach((reserva) => {
            const card = document.createElement('article');
            card.classList.add('reserva-card');

            const imgSrc = imagensTipoQuarto[reserva.FK_TIPOQUARTO_idTipoQuarto] || 'img/default.jpg';

            card.innerHTML = `
        <img src="${imgSrc}" alt="Imagem do tipo de quarto" class="reserva-img">
        <div class="reserva-info">
          <h2>Reserva #${reserva.idReserva}</h2>
          <p>Data de check-in: ${formatarData(reserva.dtInicial)}</p>
          <p>Data de check-out: ${formatarData(reserva.dtFinal)}</p>
          <p>Status: ${reserva.statusReserva}</p>
        </div>
        <button class="btn-reserva" onclick="verDetalhes(${reserva.idReserva})">Ver Detalhes</button>
      `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao carregar histórico de reservas:', error);
        container.innerHTML = '<p>Erro ao carregar histórico de reservas.</p>';
    }
}

// Utilitário para formatar data
function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
}

// Redireciona para a página de detalhes (se desejar implementar)
function verDetalhes(idReserva) {
    window.location.href = `detalhesReserva.html?id=${idReserva}`;
}

window.onload = carregarHistoricoReservas;
