document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Hacer una solicitud POST al servidor para validar el login
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo_electronico: email, password: password })
        });

        const data = await response.json(); // Obtener la respuesta en formato JSON

        if (response.ok) {
            // Si la autenticación es exitosa, mostrar el nombre completo en un mensaje
            alert(`Bienvenido, ${data.nombre_completo}`); // Corregido: Interpolación adecuada
            window.location.href = "home.html"; // Redirigir a home.html
        } else {
            // Mostrar el mensaje de error que viene desde el servidor
            alert(data.message || 'Error en el inicio de sesión');
        }
    } catch (error) {
        console.error('Error:', error); // Mostrar error en la consola
        alert('Hubo un error en el servidor. Inténtalo más tarde.');
    }
}); 