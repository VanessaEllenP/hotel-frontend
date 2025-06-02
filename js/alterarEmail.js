document.addEventListener('DOMContentLoaded', async () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado || !usuarioLogado.token || !usuarioLogado.idCliente) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return;
  }

  const token = usuarioLogado.token;
  const idCliente = usuarioLogado.idCliente;

  const inputEmailAtual = document.getElementById('email-atual');
  const inputNovoEmail = document.getElementById('novo-email');
  const btnAlterar = document.getElementById('alterarEmail');
  const mensagemEmail = document.getElementById('mensagemEmail');

  function mostrarMensagem(texto, sucesso = true) {
    mensagemEmail.textContent = texto;
    mensagemEmail.style.display = 'block';
    mensagemEmail.style.backgroundColor = sucesso ? 'rgba(0, 128, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
    mensagemEmail.style.color = sucesso ? '#00ff88' : '#ff6b6b';
    
    setTimeout(() => {
      mensagemEmail.style.display = 'none';
    }, 4000);
  }

  // Carregar e preencher o email atual
  async function carregarEmailAtual() {
    try {
      const res = await fetch(`https://hotel-backend-la2w.onrender.com/api/clientes/${idCliente}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao buscar o e-mail atual');

      const cliente = await res.json();
      inputEmailAtual.value = cliente.email || '';
      inputEmailAtual.disabled = true;

    } catch (error) {
      console.error(error);
      mostrarMensagem('Erro ao carregar o e-mail atual', false);
    }
  }

  // Atualizar o email do cliente
  async function alterarEmail() {
    const novoEmail = inputNovoEmail.value.trim();

    if (novoEmail === '') {
      mostrarMensagem('Por favor, insira um novo e-mail.', false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(novoEmail)) {
      mostrarMensagem('Por favor, insira um e-mail válido.', false);
      return;
    }

    try {
      const res = await fetch(`https://hotel-backend-la2w.onrender.com/api/clientes/${idCliente}/email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: novoEmail })
      });

      if (!res.ok) {
        const erroData = await res.json();
        throw new Error(erroData.erro || 'Erro ao alterar o e-mail');
      }

      mostrarMensagem('E-mail alterado com sucesso!');

    } catch (error) {
      console.error(error);
      mostrarMensagem('Erro ao alterar o e-mail: ' + error.message, false);
    }
  }

  carregarEmailAtual();

  btnAlterar.addEventListener('click', async (e) => {
    e.preventDefault();
    await alterarEmail();
  });
});
