document.addEventListener('DOMContentLoaded', () => {
  const btnEntrar = document.querySelector('.button');
  const emailInput = document.querySelector('.email');
  const senhaInput = document.querySelector('.senha');
  const toggleSenhaIcon = document.getElementById('toggleSenha');
  const campoSenha = document.getElementById('campoSenha');

  // Alternar visibilidade da senha
  toggleSenhaIcon.addEventListener('click', () => {
    const tipoAtual = campoSenha.getAttribute('type');
    if (tipoAtual === 'password') {
      campoSenha.setAttribute('type', 'text');
      toggleSenhaIcon.classList.remove('fa-eye');
      toggleSenhaIcon.classList.add('fa-eye-slash');
    } else {
      campoSenha.setAttribute('type', 'password');
      toggleSenhaIcon.classList.remove('fa-eye-slash');
      toggleSenhaIcon.classList.add('fa-eye');
    }
  });

  btnEntrar.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
      mostrarMensagem('Por favor, preencha todos os campos.', 'erro');
      return;
    }

    try {
      const response = await fetch('https://hotel-backend-la2w.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarMensagem(data.erro || 'Erro ao fazer login', 'erro');
        return;
      }

      // Armazena os dados no localStorage
      localStorage.setItem('usuarioLogado', JSON.stringify({
        nome: data.cliente.nome,
        email: data.cliente.email,
        idCliente: data.cliente.id,
        token: data.token
      }));

      localStorage.setItem('idCliente', data.cliente.id);

      mostrarMensagem('Login realizado com sucesso!', 'sucesso');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      mostrarMensagem('Erro de conexão com o servidor.', 'erro');
    }
  });
});

// Função para exibir mensagens personalizadas
function mostrarMensagem(texto, tipo = 'sucesso') {
  const msgDiv = document.getElementById('mensagem');
  msgDiv.textContent = texto;
  msgDiv.className = `mensagem ${tipo} visivel`;

  setTimeout(() => {
    msgDiv.classList.remove('visivel');
    msgDiv.classList.add('oculto');
  }, 3000);
}
