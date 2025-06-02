const inputSenhaAtual = document.getElementById('senha-atual');
const inputNovaSenha = document.getElementById('nova-senha');
const inputConfirmarSenha = document.getElementById('confirmar-senha');
const botaoAlterarSenha = document.getElementById('alterarSenha');
const mensagemDiv = document.getElementById('mensagemSenha');

const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuarioLogado) {
  window.location.href = 'login.html';
}
const idCliente = usuarioLogado.idCliente;
const token = usuarioLogado.token;

function mostrarMensagem(texto, sucesso = true) {
  mensagemDiv.textContent = texto;
  mensagemDiv.style.display = 'block';
  mensagemDiv.style.backgroundColor = sucesso ? 'rgba(0, 128, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
  mensagemDiv.style.color = sucesso ? '#00ff88' : '#ff6b6b';
  setTimeout(() => {
    mensagemDiv.style.display = 'none';
  }, 4000);
}

// Mostrar/ocultar senhas
document.querySelectorAll('.toggle-visibility').forEach(icon => {
  icon.addEventListener('click', () => {
    const inputId = icon.getAttribute('data-input');
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
});

botaoAlterarSenha.addEventListener('click', async () => {
  const senhaAtual = inputSenhaAtual.value.trim();
  const novaSenha = inputNovaSenha.value.trim();
  const confirmarSenha = inputConfirmarSenha.value.trim();

  if (!senhaAtual || !novaSenha || !confirmarSenha) {
    mostrarMensagem('Preencha todos os campos.', false);
    return;
  }

  if (novaSenha !== confirmarSenha) {
    mostrarMensagem('As senhas não coincidem.', false);
    return;
  }

  if (senhaAtual === novaSenha) {
    mostrarMensagem('A nova senha deve ser diferente da senha atual.', false);
    return;
  }

  const payload = {
    senhaAtual: senhaAtual,
    senha: novaSenha
  };

  try {
    const res = await fetch(`https://hotel-backend-la2w.onrender.com/api/clientes/${idCliente}/senha`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 401) {
      alert('Sessão expirada. Faça login novamente.');
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'login.html';
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || 'Erro ao alterar a senha.');

    mostrarMensagem('Senha alterada com sucesso!');
    inputSenhaAtual.value = '';
    inputNovaSenha.value = '';
    inputConfirmarSenha.value = '';

  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro: ' + error.message, false);
  }
});
