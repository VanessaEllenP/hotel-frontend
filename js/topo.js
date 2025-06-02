document.addEventListener('DOMContentLoaded', function () {
    const isLoginPage = window.location.pathname.includes('login') || window.location.pathname.includes('cadastro');
    const usuarioLogado = localStorage.getItem('usuarioLogado'); // Simulação de login

    const topoHtml = usuarioLogado && !isLoginPage
        ? `
        <header class="topo">
            <div class="img-logo">
                <img src="img/simplehost.png" alt="Logo SimpleHost">
            </div>
            <nav class="menu-topo">
                <a href="index.html">INÍCIO</a>
                <a href="acomodacoes.html">ACOMODAÇÕES</a>
                <a href="contato.html">CONTATO</a>
                <div class="user-menu-container">
                    <button class="user-button" id="userToggle">
                        <i class="fas fa-user-circle"></i>
                    </button>
                    <div class="dropdown-menu" id="userDropdown" style="display: none;">
                        <a href="conta.html">Conta</a>
                        <a href="historicoReserva.html">Reservas</a>
                        <a href="#" onclick="logout()">Sair da conta</a>
                    </div>
                </div>
            </nav>
        </header>
        `
        : `
        <div class="topo">
            <a href="index.html">INÍCIO</a>
            <a href="acomodacoes.html">ACOMODAÇÕES</a>
            <a href="contato.html">CONTATO</a>
            <a href="login.html">LOGIN / REGISTRO</a>
        </div>
        <div class="img-logo">
            <img src="img/simplehost.png" alt="Logo Simplehost">
        </div>
        `;

    const topoDiv = document.getElementById("topo");
    if (topoDiv) {
        topoDiv.innerHTML = topoHtml;
    }

    // Dropdown toggle
    document.addEventListener("click", (e) => {
        const userToggle = document.getElementById("userToggle");
        const userDropdown = document.getElementById("userDropdown");

        if (userToggle && userDropdown) {
            if (userToggle.contains(e.target)) {
                userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
            } else if (!userDropdown.contains(e.target)) {
                userDropdown.style.display = "none";
            }
        }
    });
});

// Função de logout
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}
