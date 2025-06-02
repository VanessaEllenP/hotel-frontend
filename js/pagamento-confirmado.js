document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const idReserva = params.get('reserva') || '--';
    const tipoQuarto = params.get('quarto') || '--';
    const checkin = formatarData(params.get('checkin')) || '--';
    const checkout = formatarData(params.get('checkout')) || '--';
    const total = parseFloat(params.get('total')) || 0;

    document.getElementById('reservaId').textContent = `Reserva #${idReserva}`;
    document.getElementById('tipoAcomodacao').textContent = tipoQuarto;
    document.getElementById('checkin').textContent = checkin;
    document.getElementById('checkout').textContent = checkout;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    function formatarData(dataStr) {
        if (!dataStr || dataStr.length < 10) return '--';
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
    }
});
