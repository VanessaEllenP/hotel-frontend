document.addEventListener('DOMContentLoaded', async () => {
    // Pega o objeto usuarioLogado do localStorage e converte para objeto JS
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Validação: se não estiver logado, redireciona para login
    if (!usuarioLogado || !usuarioLogado.token || !usuarioLogado.idCliente) {
        alert('Você precisa estar logado para ver sua conta.');
        window.location.href = 'login.html';
        return;
    }

    const token = usuarioLogado.token;
    const idCliente = usuarioLogado.idCliente;

    try {
        // Busca dados do cliente na API usando token no header
        const resposta = await fetch(`http://localhost:3000/api/clientes/${idCliente}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error('Erro ao buscar dados do cliente');
        }

        const cliente = await resposta.json();

        // Preenche o e-mail do cliente na página
        const emailElement = document.getElementById('emailUsuario');
        emailElement.textContent = cliente.email || 'Não cadastrado';

        // Busca telefones do cliente, rota separada, também protegida
        const telefoneResponse = await fetch(`http://localhost:3000/api/telefones/cliente/${idCliente}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (telefoneResponse.ok) {
            const telefones = await telefoneResponse.json();
            const telefoneElement = document.getElementById('telefoneUsuario');
            if (telefones.length > 0) {
                telefoneElement.textContent = `+55 ${telefones[0].ddd} ${telefones[0].telefone}`;
            } else {
                telefoneElement.textContent = 'Não cadastrado';
            }
        } else {
            console.warn('Não foi possível carregar os telefones.');
        }

    } catch (erro) {
        console.error('Erro ao carregar dados do cliente:', erro);
    }
});
