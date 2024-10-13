document.getElementById('registerBtn').addEventListener('click', function() {
    const nombre_completo = document.getElementById('nombre_completo').value;
    const correo_electronico = document.getElementById('correo_electronico').value;
    const numero_telefono = document.getElementById('numero_telefono').value;
    const password = document.getElementById('password').value;
    const confirmar_password = document.getElementById('confirmar_password').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre_completo,
            correo_electronico,
            numero_telefono,
            password,
            confirmar_password
        })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
});
