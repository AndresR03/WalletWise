document.addEventListener('DOMContentLoaded', function() {
    // Aquí puedes agregar las funciones para los botones
    const iniciarSesionBtn = document.querySelector('.button:first-of-type');
    const registrarseBtn = document.querySelector('.button:last-of-type');
    const form = document.querySelector('form');

    iniciarSesionBtn.addEventListener('click', function() {
        window.location.href = 'login.html';
    });

    registrarseBtn.addEventListener('click', function() {
        window.location.href = 'registro.html'; // Redirigir a registro.html
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        
        // Mostrar la alerta
        alert('Registro exitoso');

        // Redirigir a pagina.html
        window.location.href = 'pagina.html';
    });
});
