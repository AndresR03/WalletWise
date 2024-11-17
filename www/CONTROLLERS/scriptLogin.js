document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Por favor, rellena todos los campos');
        return;
    }

    try {
        const response = await fetch('https://walletwise-1-33dw.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo_electronico: email, password: password }),
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data); // Depuración

        if (response.ok) {
            if (data.nombre_completo && data.id) {
                // Guardar datos en localStorage
                localStorage.setItem('nombre_completo', data.nombre_completo);
                localStorage.setItem('user_id', data.id); 
                
                // Mensaje de bienvenida y redirección
                alert(`Bienvenido, ${data.nombre_completo}`);
                window.location.href = 'home.html'; // Redirigir a la página principal
            } else {
                console.warn('La respuesta no contiene los datos esperados.');
                alert('Error al obtener los datos del usuario. Por favor, inténtalo más tarde.');
            }
        } else {
            alert(data.message || 'Error en el inicio de sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error en el servidor. Inténtalo más tarde.');
    }
});