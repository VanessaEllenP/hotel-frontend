document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulario");

  const senhaInput = document.querySelector(".senha");
  const confirmeSenhaInput = document.querySelector(".confirmeASenha");

  const botaoSenha = document.getElementById("toggleSenhaCadastro");
  const botaoConfirmeSenha = document.getElementById("toggleConfirmeSenhaCadastro");

    const input = document.getElementById('dataNascimento');

  input.addEventListener('input', (e) => {
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não for número

    if (value.length > 8) {
      value = value.slice(0, 8); // Limita a 8 dígitos
    }

    // Adiciona as barras
    if (value.length >= 5) {
      value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }

    input.value = value;
  });

  function configurarToggleSenha(botao, input) {
    botao.addEventListener("click", () => {
      const tipoAtual = input.getAttribute("type");
      if (tipoAtual === "password") {
        input.setAttribute("type", "text");
        botao.classList.remove("fa-eye");
        botao.classList.add("fa-eye-slash");
      } else {
        input.setAttribute("type", "password");
        botao.classList.remove("fa-eye-slash");
        botao.classList.add("fa-eye");
      }
    });
  }

  configurarToggleSenha(botaoSenha, senhaInput);
  configurarToggleSenha(botaoConfirmeSenha, confirmeSenhaInput);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.querySelector(".nome").value.trim();
    const sobrenome = document.querySelector(".sobrenome").value.trim();
    const email = document.querySelector(".email").value.trim();
    const ddd = document.querySelector(".ddd").value.trim();
    const celular = document.querySelector(".celular").value.trim();
    const dataNascimento = document.querySelector(".dataDeNascimento").value;
    const senha = senhaInput.value;
    const confirmeASenha = confirmeSenhaInput.value;

    const modal = document.getElementById("modalConfirmacao");
    const mensagemModal = document.getElementById("mensagemModal");
    const fecharModal = document.getElementById("fecharModal");

    function mostrarModal(mensagem = "Algo aconteceu...", redirecionar = false) {
      mensagemModal.textContent = mensagem;
      modal.style.display = "flex";

      fecharModal.onclick = () => {
        modal.style.display = "none";
        if (redirecionar) {
          window.location.href = "login.html";
        }
      };
    }

    if (!nome || !sobrenome || !email || !ddd || !celular || !dataNascimento || !senha || !confirmeASenha) {
      mostrarModal("Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmeASenha) {
      mostrarModal("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          sobrenome,
          email,
          dataNascimento,
          senha,
          telefones: [{ ddd, telefone: celular }]
        })
      });

      if (response.ok) {
        mostrarModal("Seu cadastro foi concluído com sucesso!", true);
      } else {
        let erroMensagem = "Erro ao cadastrar. Tente novamente.";
        try {
          const erro = await response.json();
          if (erro.message) erroMensagem = erro.message;
        } catch (e) {
          console.error("Erro ao interpretar JSON:", e);
        }
        mostrarModal(erroMensagem);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      mostrarModal("Erro de conexão com o servidor.");
    }
  });
});
