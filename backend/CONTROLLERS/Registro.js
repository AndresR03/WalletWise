document.getElementById('registro-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener los valores de los campos del formulario
    const nombreCompleto = document.querySelector('input[name="nombre_completo"]').value;
    const correoElectronico = document.querySelector('input[name="correo_electronico"]').value;
    const numeroTelefono = document.querySelector('input[name="numero_telefono"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmarPassword = document.querySelector('input[name="confirmar_password"]').value;

    // Verifica el estado del checkbox
    const aceptarTerminos = document.querySelector('input[name="aceptar_terminos"]').checked;

    // Crear el objeto con los datos a enviar
    const data = {
        nombre_completo: nombreCompleto,
        correo_electronico: correoElectronico,
        numero_telefono: numeroTelefono,
        password: password,
        confirmar_password: confirmarPassword,
        aceptar_terminos: aceptarTerminos // True si está marcado, false si no
    };

    try {
        // Hacer la solicitud POST al endpoint de registro
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Manejar la respuesta
        const result = await response.json();
        if (response.ok) {
            alert(result.message); // Mostrar mensaje de éxito
            window.location.href = 'index.html';
        } else {
            alert(result.message); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario, intenta nuevamente.');
    }
});
