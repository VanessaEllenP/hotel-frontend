document.addEventListener('DOMContentLoaded', async function () {
  const params = new URLSearchParams(window.location.search);
  const reservaId = params.get('reserva');
  const nomeQuarto = params.get('quarto') || 'Quarto não especificado';
  const checkin = params.get('checkin') || '--';
  const checkout = params.get('checkout') || '--';
  const total = parseFloat(params.get('total')) || 0;

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const clienteId = usuarioLogado?.idCliente;
  const token = usuarioLogado?.token;

  if (!clienteId || !token) {
    alert('Você precisa estar logado para continuar.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('reservaId').textContent = `Reserva #${reservaId}`;
  document.getElementById('tipoQuarto').textContent = nomeQuarto;
  document.getElementById('dataCheckin').textContent = formatarData(checkin);
  document.getElementById('dataCheckout').textContent = formatarData(checkout);
  document.getElementById('valorTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

  const metodoPagamento = document.getElementById('metodoPagamento');
  const formularioPagamento = document.getElementById('formularioPagamento');
  const confirmarBtn = document.getElementById('confirmarBtn');
  const mensagemErro = document.getElementById('mensagemErro');

  function formatarData(dataStr) {
    if (!dataStr) return '--';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function atualizarFormularioPagamento() {
    const metodo = metodoPagamento.value;
    if (metodo === 'pix') {
      formularioPagamento.innerHTML = `
        <input type="text" placeholder="Nome" required />
        <input type="text" placeholder="Sobrenome" required />
        <input type="text" placeholder="CPF" required />
      `;
    } else if (metodo === 'cartao') {
      formularioPagamento.innerHTML = `
        <input type="text" placeholder="Nome no Cartão" required />
        <input type="text" placeholder="Número do Cartão" required />
        <input type="text" placeholder="Validade (MM/AA)" required />
        <input type="text" placeholder="CVV" required />
        <select id="seletorParcelas" required>
          <option value="">Quantidade de Parcelas</option>
          ${[...Array(12)].map((_, i) => {
            const qtd = i + 1;
            const valorParcela = total / qtd;
            return `<option value="${qtd}">${qtd}x de R$ ${valorParcela.toFixed(2).replace('.', ',')}</option>`;
          }).join('')}
        </select>
      `;
    } else {
      formularioPagamento.innerHTML = '';
    }
  }

  metodoPagamento.addEventListener('change', atualizarFormularioPagamento);
  atualizarFormularioPagamento();

  confirmarBtn.addEventListener('click', async function () {
    const metodo = metodoPagamento.value;

    if (metodo === 'pix') {
      const nome = formularioPagamento.querySelector('input[placeholder="Nome"]');
      const sobrenome = formularioPagamento.querySelector('input[placeholder="Sobrenome"]');
      const cpf = formularioPagamento.querySelector('input[placeholder="CPF"]');

      if (!nome.value.trim() || !sobrenome.value.trim() || !cpf.value.trim()) {
        mostrarErro('Por favor, preencha todos os campos para o pagamento via PIX.');
        return;
      }

    } else if (metodo === 'cartao') {
      const nomeCartao = formularioPagamento.querySelector('input[placeholder="Nome no Cartão"]');
      const numeroCartao = formularioPagamento.querySelector('input[placeholder="Número do Cartão"]');
      const validade = formularioPagamento.querySelector('input[placeholder="Validade (MM/AA)"]');
      const cvv = formularioPagamento.querySelector('input[placeholder="CVV"]');
      const parcelas = formularioPagamento.querySelector('select');

      if (!nomeCartao.value.trim() || !numeroCartao.value.trim() || !validade.value.trim() || !cvv.value.trim() || !parcelas.value) {
        mostrarErro('Por favor, preencha todos os campos para o pagamento com cartão.');
        return;
      }

    } else {
      mostrarErro('Selecione um método de pagamento válido.');
      return;
    }

    try {
      const response = await fetch(`https://hotel-backend-la2w.onrender.com/api/reservas/${reservaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          statusReserva: 'CONFIRMADA',
          FK_CLIENTE_idCliente: clienteId
        })
      });

      if (!response.ok) throw new Error('Falha ao confirmar reserva');

      window.location.href = `pagamento-confirmado.html?reserva=${reservaId}&total=${total}&quarto=${encodeURIComponent(nomeQuarto)}&checkin=${checkin}&checkout=${checkout}`;

    } catch (error) {
      mostrarErro('Erro ao confirmar reserva: ' + error.message);
    }
  });

  function mostrarErro(mensagem) {
    mensagemErro.textContent = mensagem;
    mensagemErro.style.display = 'block';
    setTimeout(() => {
      mensagemErro.style.display = 'none';
    }, 5000);
  }
});
