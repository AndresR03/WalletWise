document.getElementById('registro-form').addEventListener('submit', async function (event) { 
    event.preventDefault(); 

    // Obtener los valores de los campos del formulario
    const nombreCompleto = document.querySelector('input[name="nombre_completo"]').value;
    const correoElectronico = document.querySelector('input[name="correo_electronico"]').value;
    const numeroTelefono = document.querySelector('input[name="numero_telefono"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmarPassword = document.querySelector('input[name="confirmar_password"]').value;

    // Verifica el estado del checkbox
    const aceptarTerminos = document.querySelector('input[name="aceptar_terminos"]').checked;

    // Crear el objeto 
    const data = {
        nombre_completo: nombreCompleto,
        correo_electronico: correoElectronico,
        numero_telefono: numeroTelefono,
        password: password,
        confirmar_password: confirmarPassword,
        aceptar_terminos: aceptarTerminos 
    };
 
    try {
        const response = await fetch('https://wallet-1-94081f7e1774.herokuapp.com/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Manejar la respuesta
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = 'index.html'; 
        } else {
            alert(result.message); 
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario, intenta nuevamente.');
    }
});

// Funcionalidad para mostrar/ocultar contraseña
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('far', 'fa-eye');
        icon.classList.add('far', 'fa-eye-slash'); 
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('far', 'fa-eye-slash'); 
        icon.classList.add('far', 'fa-eye'); 
    }
});

// Funcionalidad para mostrar/ocultar confirmar contraseña
document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
    const confirmPasswordInput = document.getElementById('confirmar_password');
    const icon = this.querySelector('i');

    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        icon.classList.remove('far', 'fa-eye'); 
        icon.classList.add('far', 'fa-eye-slash'); 
    } else {
        confirmPasswordInput.type = 'password';
        icon.classList.remove('far', 'fa-eye-slash'); 
        icon.classList.add('far', 'fa-eye'); 
    }
});
