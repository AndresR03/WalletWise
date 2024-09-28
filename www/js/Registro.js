document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        
        // Obtener los valores del formulario
        const nombreCompleto = form.querySelector('input[name="nombre"]').value;
        const correoElectronico = form.querySelector('input[name="email"]').value;
        const numeroTelefono = form.querySelector('input[name="telefono"]').value;
        const password = form.querySelector('input[name="password"]').value;
        const confirmarPassword = form.querySelector('input[name="confirmar_password"]').value; // Campo de confirmación de contraseña

        // Validar que las contraseñas coincidan
        if (password !== confirmarPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Hacer la solicitud POST al servidor
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre_completo: nombreCompleto,
                correo_electronico: correoElectronico,
                numero_telefono: numeroTelefono,
                password: password,
                confirmar_password: confirmarPassword
            }),
        });

        // Manejar la respuesta
        const data = await response.json();
        if (response.ok) {
            alert('Registro exitoso'); // Mensaje de éxito
            // Redirigir a index.html
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Error en el registro'); // Mensaje de error
        }
    });
});
