document.getElementById('save-button').addEventListener('click', async function(event) {
    event.preventDefault();

    const usuarioId = 1; // Aquí debes asignar el ID del usuario que está autenticado
    const salario = document.getElementById('salary').value;
    const comida = document.getElementById('food').value;
    const ropa = document.getElementById('clothes').value;
    const transporte = document.getElementById('transport').value;

    const otrasCategorias = {};
    document.querySelectorAll('#categories-list input').forEach(input => {
        if (!['food', 'clothes', 'transport'].includes(input.id)) {
            otrasCategorias[input.id] = input.value;
        }
    });

    const data = {
        usuario_id: usuarioId,
        salario: salario,
        comida: comida,
        ropa: ropa,
        transporte: transporte,
        otras_categorias: otrasCategorias
    };

    try {
        const response = await fetch('http://localhost:3000/informacion-financiera', { // Cambiado aquí
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Información financiera guardada exitosamente');
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error al guardar la información financiera:', error);
        alert('Error al guardar la información financiera, intenta nuevamente.');
    }
});
