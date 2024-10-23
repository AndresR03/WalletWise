document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validar si los campos no están vacíos antes de enviar la solicitud
    if (!email || !password) {
        alert('Por favor, rellena todos los campos');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo_electronico: email, password: password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Bienvenido, ${data.nombre_completo}`);
            window.location.href = 'home.html'; // Redirigir a la página principal
        } else {
            // Mostrar mensaje de error devuelto por el servidor
            alert(data.message || 'Error en el inicio de sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error en el servidor. Inténtalo más tarde.');
    }
});

// Funcionalidad para mostrar/ocultar la contraseña
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Cambiar el ícono de ojo
    const icon = this.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
});
