const inputTelefoneAtual = document.getElementById('telefone-atual');
const inputNovoTelefone = document.getElementById('novo-telefone');
const botaoAlterar = document.getElementById('alterarTelefone');
const mensagemDiv = document.getElementById('mensagemTelefone');

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

// Aplica máscara ao campo de telefone
inputNovoTelefone.addEventListener('input', () => {
  let valor = inputNovoTelefone.value.replace(/\D/g, '');

  if (valor.length > 11) valor = valor.slice(0, 11);

  let formatado = '';

  if (valor.length > 0) {
    formatado += '(' + valor.slice(0, 2);
  }
  if (valor.length >= 3) {
    formatado += ') ' + valor.slice(2, valor.length >= 7 ? 7 : valor.length);
  }
  if (valor.length >= 7) {
    formatado += '-' + valor.slice(7);
  }

  inputNovoTelefone.value = formatado;
});

function formatarTelefone(ddd, telefone) {
  if (telefone.length === 9) {
    return `(${ddd}) ${telefone.slice(0, 5)}-${telefone.slice(5)}`;
  } else if (telefone.length === 8) {
    return `(${ddd}) ${telefone.slice(0, 4)}-${telefone.slice(4)}`;
  }
  return `(${ddd}) ${telefone}`;
}

async function carregarTelefoneAtual() {
  try {
    const res = await fetch(`http://localhost:3000/api/telefones/cliente/${idCliente}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 401) {
      alert('Sua sessão expirou. Faça login novamente.');
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'login.html';
      return;
    }

    if (!res.ok) throw new Error('Erro ao buscar o telefone atual');

    const telefones = await res.json();

    if (telefones.length === 0) {
      inputTelefoneAtual.value = '';
      return;
    }

    const { ddd, telefone } = telefones[0];
    inputTelefoneAtual.value = formatarTelefone(ddd, telefone);
    inputTelefoneAtual.disabled = true;

  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao carregar o telefone atual', false);
  }
}

async function alterarTelefone() {
  const novoTelefoneRaw = inputNovoTelefone.value.trim();

  if (novoTelefoneRaw === '') {
    mostrarMensagem('Por favor, insira o novo número de telefone.', false);
    return;
  }

  // Validação: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
  const telefoneRegex = /^\((\d{2})\)\s\d{4,5}-\d{4}$/;

  const match = novoTelefoneRaw.match(telefoneRegex);
  if (!match) {
    mostrarMensagem('Formato inválido. Use: (DD) XXXXX-XXXX ou (DD) XXXX-XXXX', false);
    return;
  }

  const telefoneNumerico = novoTelefoneRaw.replace(/\D/g, '');
  const ddd = telefoneNumerico.slice(0, 2);
  const telefoneSemMascara = telefoneNumerico.slice(2);

  const payload = {
    telefones: [
      { ddd: ddd, telefone: telefoneSemMascara }
    ]
  };

  try {
    const res = await fetch(`http://localhost:3000/api/telefones/cliente/${idCliente}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 401) {
      alert('Sua sessão expirou. Faça login novamente.');
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'login.html';
      return;
    }

    if (!res.ok) {
      const erroData = await res.json();
      throw new Error(erroData.erro || 'Erro ao alterar o telefone');
    }

    mostrarMensagem('Telefone alterado com sucesso!');
    inputNovoTelefone.value = '';
    await carregarTelefoneAtual();

  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao alterar o telefone: ' + error.message, false);
  }
}

botaoAlterar.addEventListener('click', alterarTelefone);
carregarTelefoneAtual();
