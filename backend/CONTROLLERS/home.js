
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el nombre del usuario desde el almacenamiento local
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    // Seleccionar el elemento welcome-message
    const welcomeMessage = document.getElementById('welcome-message');

    if (nombreUsuario) {
        
        welcomeMessage.innerHTML = `👀Bienvenido ${nombreUsuario} con WalletWise, te ayudaremos a distribuir y organizar tus finanzas sabiamente😉.`;
    } else {
        
        welcomeMessage.innerHTML = `👀Bienvenido invitado con WalletWise, te ayudaremos a distribuir y organizar tus finanzas sabiamente😉.`;
    }

    // Manejo de eventos para la navegación
    document.getElementById('user-link').addEventListener('click', function(e) {
        e.preventDefault(); 
        window.location.href = "perfil.html";
    });

    document.getElementById('balance-link').addEventListener('click', function(e) {
        e.preventDefault(); 
        window.location.href = "balance.html"; 
    });
});

