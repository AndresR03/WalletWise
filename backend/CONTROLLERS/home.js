// Mostrar un mensaje de bienvenida con el nombre del usuario que inició sesión
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el nombre del usuario desde el almacenamiento local
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    // Seleccionar el elemento welcome-message
    const welcomeMessage = document.getElementById('welcome-message');

    if (nombreUsuario) {
        // Actualizar el mensaje de bienvenida con el nombre del usuario
        welcomeMessage.innerHTML = `👀Bienvenido ${nombreUsuario} con WalletWise, te ayudaremos a distribuir y organizar tus finanzas sabiamente😉.`;
    } else {
        // Si no hay nombre de usuario, mostrar el mensaje predeterminado
        welcomeMessage.innerHTML = `👀Bienvenido invitado con WalletWise, te ayudaremos a distribuir y organizar tus finanzas sabiamente😉.`;
    }

    // Manejo de eventos para la navegación
    document.getElementById('user-link').addEventListener('click', function(e) {
        e.preventDefault(); // Evita que se recargue la página
        window.location.href = "perfil.html"; // Redirige a perfil.html
    });

    document.getElementById('balance-link').addEventListener('click', function(e) {
        e.preventDefault(); // Evita que se recargue la página
        window.location.href = "balance_semanal.html"; // Redirige a balance_semanal.html
    });
});
