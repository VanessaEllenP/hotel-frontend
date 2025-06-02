document.addEventListener('DOMContentLoaded', async () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado || !usuarioLogado.token || !usuarioLogado.idCliente) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    const token = usuarioLogado.token;
    const idCliente = usuarioLogado.idCliente;

    function mostrarMensagem(texto, sucesso = true) {
        const mensagem = document.getElementById('mensagemSucesso');
        mensagem.textContent = texto;
        mensagem.style.display = 'block';
        mensagem.style.backgroundColor = sucesso ? 'rgba(0, 128, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
        mensagem.style.color = sucesso ? '#00ff88' : '#ff6b6b';

        setTimeout(() => {
            mensagem.style.display = 'none';
        }, 4000);
    }


    // Função para preencher os inputs com os dados do cliente
    async function carregarDados() {
        try {
            const res = await fetch(`http://localhost:3000/api/clientes/${idCliente}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Erro ao buscar dados do cliente');

            const cliente = await res.json();

            document.getElementById('nome').value = cliente.nome || '';
            document.getElementById('sobrenome').value = cliente.sobrenome || '';
            document.getElementById('logradouro').value = cliente.logradouro || '';
            document.getElementById('bairro').value = cliente.bairro || '';
            document.getElementById('cidade').value = cliente.cidade || '';
            document.getElementById('uf').value = cliente.uf || '';
            document.getElementById('cep').value = cliente.cep || '';
            document.getElementById('numero').value = cliente.numero || '';
            document.getElementById('complemento').value = cliente.complemento || '';

            if (cliente.dataNascimento) {
                const data = new Date(cliente.dataNascimento);
                const dataFormatada = data.toISOString().split('T')[0];
                document.getElementById('dataNascimento').value = dataFormatada;
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar seus dados. Tente novamente.');
        }
    }

    // Função para enviar alterações para o backend
    async function salvarAlteracoes() {
        const dadosAtualizados = {
            nome: document.getElementById('nome').value.trim(),
            sobrenome: document.getElementById('sobrenome').value.trim(),
            logradouro: document.getElementById('logradouro').value.trim(),
            bairro: document.getElementById('bairro').value.trim(),
            cidade: document.getElementById('cidade').value.trim(),
            uf: document.getElementById('uf').value.trim(),
            cep: document.getElementById('cep').value.trim(),
            numero: document.getElementById('numero').value.trim(),
            complemento: document.getElementById('complemento').value.trim(),
            dataNascimento: document.getElementById('dataNascimento').value
        };

        try {
            const res = await fetch(`http://localhost:3000/api/clientes/${idCliente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosAtualizados)
            });

            if (!res.ok) {
                const erroData = await res.json();
                throw new Error(erroData.mensagem || erroData.erro || 'Erro ao salvar alterações');
            }

            mostrarMensagem('Dados atualizados com sucesso!', true);
        } catch (error) {
            console.error(error);
            mostrarMensagem('Erro ao salvar alterações.', false);
        }
    }

    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', () => {
        let value = cepInput.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        value = value.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
        cepInput.value = value;
    });

    carregarDados();

    document.getElementById('salvarAlteracoes').addEventListener('click', (e) => {
        e.preventDefault();
        salvarAlteracoes();
    });
});
