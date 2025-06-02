document.addEventListener('DOMContentLoaded', async function () {
    function getQuartoIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    const checkinInput = document.querySelector('input[name="checkin"]');
    const checkoutInput = document.querySelector('input[name="checkout"]');
    const pessoasInput = document.querySelector('input[name="pessoas"]');
    const totalDiv = document.querySelector('.total strong');
    const precoElemento = document.querySelector('.quarto-reserva h2');
    const descricaoElemento = document.querySelector('.topo-info p');
    const comodidadesLista = document.querySelector('.comodidades ul');
    const imagemQuarto = document.getElementById('imagem-quarto');

    const noitesInput = document.createElement('input');
    noitesInput.type = 'hidden';
    noitesInput.name = 'noites';
    document.querySelector('form').appendChild(noitesInput);

    const nomeTipoInput = document.createElement('input'); // CAMPO OCULTO PARA O NOME DO TIPO DE QUARTO
    nomeTipoInput.type = 'hidden';
    nomeTipoInput.name = 'nomeTipoQuarto';
    document.querySelector('form').appendChild(nomeTipoInput);

    let precoPorNoite = 0;

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

    const iconesComodidades = {
        "Wifi": "fa-wifi",
        "Ar-condicionado": "fa-snowflake",
        "TV": "fa-tv",
        "Ducha": "fa-shower",
        "Toalhas": "fa-bath",
        "Cozinha": "fa-utensils",
        "Frigobar": "fa-wine-bottle",
        "default": "fa-circle"
    };

    async function buscarDadosQuarto(id) {
        try {
            const res = await fetch(`http://localhost:3000/api/quartos/detalhes/${id}`);
            if (!res.ok) throw new Error('Erro ao buscar dados do quarto');
            const dados = await res.json();
            return dados;
        } catch (error) {
            console.error(error);
            alert('Não foi possível carregar os dados do quarto.');
            return null;
        }
    }

    function preencherDadosQuarto(dados, idQuarto) {
        precoPorNoite = parseFloat(dados.precoNoite) || 0;
        precoElemento.innerHTML = `R$${precoPorNoite.toFixed(2).replace('.', ',')} <small>/ noite</small>`;
        descricaoElemento.textContent = dados.tipoDescricao || '';
        nomeTipoInput.value = dados.tipoDescricao || ''; // Preenche campo oculto com nome do tipo de quarto

        comodidadesLista.innerHTML = '';
        if (Array.isArray(dados.comodidades) && dados.comodidades.length) {
            dados.comodidades.forEach(c => {
                const li = document.createElement('li');
                const icone = iconesComodidades[c] || iconesComodidades["default"];
                li.innerHTML = `<i class="fas ${icone}"></i> ${c}`;
                comodidadesLista.appendChild(li);
            });
        }

        imagemQuarto.src = imagensMap[idQuarto] || 'img/default.jpg';
        imagemQuarto.alt = `Imagem do quarto ${dados.nomeQuarto || idQuarto}`;

        noitesInput.value = 1;
        atualizarTotal();
    }

    function calcularNoites() {
        const checkin = new Date(checkinInput.value);
        const checkout = new Date(checkoutInput.value);

        if (!isNaN(checkin.getTime()) && !isNaN(checkout.getTime())) {
            const diffMs = checkout - checkin;
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            noitesInput.value = diffDays > 0 ? diffDays : 1;
        } else {
            noitesInput.value = 1;
        }
        atualizarTotal();
    }

    function atualizarTotal() {
        const noites = parseInt(noitesInput.value) || 1;
        const total = noites * precoPorNoite;
        totalDiv.textContent = `R$${total.toFixed(2).replace('.', ',')}`;
    }

    const reservarBtn = document.getElementById('reservarBtn');
    if (reservarBtn) {
        reservarBtn.addEventListener('click', async function () {
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            const token = usuarioLogado?.token;
            const clienteId = usuarioLogado?.idCliente;

            if (!token || !clienteId) {
                alert('Você precisa estar logado para fazer a reserva.');
                return;
            }

            const checkin = checkinInput.value;
            const checkout = checkoutInput.value;
            const pessoas = parseInt(pessoasInput.value, 10);
            const quartoId = getQuartoIdFromUrl();

            if (!checkin || !checkout) {
                alert('Preencha as datas de check-in e check-out.');
                return;
            }

            if (isNaN(pessoas) || pessoas <= 0) {
                alert('Informe um número válido de pessoas.');
                return;
            }

            try {
                const resCriar = await fetch('http://localhost:3000/api/reservas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        dtInicial: checkin,
                        dtFinal: checkout,
                        qntPessoas: pessoas,
                        FK_TIPOQUARTO_idTipoQuarto: quartoId,
                        FK_CLIENTE_idCliente: clienteId
                    })
                });

                if (!resCriar.ok) throw new Error('Erro ao criar reserva');

                const reserva = await resCriar.json();
                const reservaId = reserva.id; // <-- Aqui a correção

                const total = (parseInt(noitesInput.value || '1') * precoPorNoite).toFixed(2);
                window.location.href = `checkout.html?reserva=${reservaId}&total=${total}&quarto=${encodeURIComponent(nomeTipoInput.value)}&checkin=${checkin}&checkout=${checkout}`;
            } catch (error) {
                console.error(error);
                alert('Erro ao realizar reserva. Tente novamente.');
            }
        });
    }

    const quartoId = getQuartoIdFromUrl();
    if (quartoId) {
        const dadosQuarto = await buscarDadosQuarto(quartoId);
        if (dadosQuarto) {
            preencherDadosQuarto(dadosQuarto, Number(quartoId));
        }
    } else {
        alert('ID do quarto não fornecido na URL.');
    }

    checkinInput.addEventListener('change', calcularNoites);
    checkoutInput.addEventListener('change', calcularNoites);
});
