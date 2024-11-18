document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validación de entrada
    if (!email || !password) {
        alert('Por favor, rellena todos los campos');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validar formato de correo
    if (!emailRegex.test(email)) {
        alert('Por favor, introduce un correo electrónico válido');
        return;
    }

    try {
        const response = await fetch('https://walletwise-backend-p4gd.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo_electronico: email, password: password }),
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data); // Depuración

        if (response.ok) {
            // Verificar que los datos necesarios están presentes
            if (data.usuario && data.usuario.nombre_completo && data.usuario.id) {
                // Guardar datos en localStorage
                localStorage.setItem('nombre_completo', data.usuario.nombre_completo);
                localStorage.setItem('user_id', data.usuario.id); 
                
                // Mensaje de bienvenida y redirección
                alert(`Bienvenido, ${data.usuario.nombre_completo}`);
                window.location.href = 'home.html'; // Redirigir a la página principal
            } else {
                console.warn('La respuesta no contiene los datos esperados.');
                alert('Error al obtener los datos del usuario. Por favor, inténtalo más tarde.');
            }
        } else {
            // Mostrar mensajes de error del servidor o un mensaje genérico
            alert(data.message || 'Error en el inicio de sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error en el servidor. Inténtalo más tarde.');
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