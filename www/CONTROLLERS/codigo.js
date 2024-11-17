document.addEventListener('DOMContentLoaded', function() { 
    
    const iniciarSesionBtn = document.querySelector('.button:first-of-type');
    const registrarseBtn = document.querySelector('.button:last-of-type');
    const form = document.querySelector('form'); 

    iniciarSesionBtn.addEventListener('click', function() {
        window.location.href = 'login.html';
    });

    registrarseBtn.addEventListener('click', function() {
        window.location.href = 'registro.html';
    });

    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            
            alert('Registro exitoso');

            
            window.location.href = 'pagina.html';
        });
    }
});
