document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

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

        console.log('Estado de la respuesta:', response.status);

        if (!response.ok) {
            console.error('Error en el servidor:', await response.text());
            alert('Inicio de sesión fallido. Verifica tus credenciales.');
            return;
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);

        if (data.usuario && data.usuario.nombre_completo && data.usuario.id) {
            localStorage.setItem('nombre_completo', data.usuario.nombre_completo);
            localStorage.setItem('user_id', data.usuario.id);
            alert(`Bienvenido, ${data.usuario.nombre_completo}`);
            window.location.href = 'home.html';
        } else {
            alert('Error al obtener los datos del usuario. Inténtalo más tarde.');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Hubo un error al conectar con el servidor.');
    }
    
});
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