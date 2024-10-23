document.getElementById('save-button').addEventListener('click', async function(event) {
    event.preventDefault();

    const usuarioId = 1; // Cambiar esto para obtener el ID del usuario autenticado dinámicamente
    const salario = document.getElementById('salary').value;
    const comida = document.getElementById('food').value;
    const ropa = document.getElementById('clothes').value;
    const transporte = document.getElementById('transport').value;
    const otraCategoria1 = document.getElementById('category1').value;
    const otraCategoria2 = document.getElementById('category2').value;
    const otraCategoria3 = document.getElementById('category3').value;

    const data = {
        usuario_id: usuarioId,
        salario: salario,
        comida: comida,
        ropa: ropa,
        transporte: transporte,
        otraCategoria1: otraCategoria1,
        otraCategoria2: otraCategoria2,
        otraCategoria3: otraCategoria3,
    };

    try {
        const response = await fetch('http://localhost:3000/guardar-informacion-financiera', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            // Guardar el salario en localStorage
            localStorage.setItem('salario', salario);
            alert('Información financiera guardada exitosamente');
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error al guardar la información financiera:', error);
        alert('Error al guardar la información financiera, intenta nuevamente.');
    }
});
