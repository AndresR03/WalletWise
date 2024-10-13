// Mostrar un mensaje fijo en la página de inicio


// Manejo de eventos para la navegación
document.getElementById('user-link').addEventListener('click', function(e) {
    e.preventDefault(); // Evita que se recargue la página
    window.location.href = "perfil.html"; // Redirige a perfil.html
});

document.getElementById('balance-link').addEventListener('click', function(e) {
    e.preventDefault(); // Evita que se recargue la página
    window.location.href = "balance.html"; // Redirige a balance_semanal.html
});
