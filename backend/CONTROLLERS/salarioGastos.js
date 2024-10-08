function goBack() {
    window.history.back();
}
document.getElementById('save-button').addEventListener('click', async function(event) {
    event.preventDefault();

    const usuarioEmail = 'user@example.com'; // Cambiar para obtener el correo electrónico del usuario autenticado
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
        usuario_email: usuarioEmail,
        salario: salario,
        comida: comida,
        ropa: ropa,
        transporte: transporte,
        otras_categorias: otrasCategorias
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
            alert('Información financiera guardada exitosamente');
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error al guardar la información financiera:', error);
        alert('Error al guardar la información financiera, intenta nuevamente.');
    }
});

// Agregar un nuevo evento para el botón de agregar categoría
document.getElementById('add-category-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del botón

    const newCategoryInput = document.getElementById('new-category');
    const categoryName = newCategoryInput.value.trim(); // Obtener el nombre de la nueva categoría

    if (categoryName) {
        // Crear un nuevo elemento de categoría
        const newCategoryDiv = document.createElement('div');
        newCategoryDiv.classList.add('category');

        const newCategoryLabel = document.createElement('label');
        newCategoryLabel.textContent = categoryName + ' ';
        
        const newCategoryInputElement = document.createElement('input');
        newCategoryInputElement.type = 'number';
        newCategoryInputElement.id = categoryName.toLowerCase().replace(/ /g, '-'); // Asignar un id basado en el nombre
        newCategoryInputElement.placeholder = '0';
        
        // Agregar la etiqueta y el input al div
        newCategoryDiv.appendChild(newCategoryLabel);
        newCategoryDiv.appendChild(newCategoryInputElement);

        // Agregar el nuevo div al contenedor de categorías
        document.getElementById('categories-list').appendChild(newCategoryDiv);
        
        newCategoryInput.value = ''; // Limpiar el campo de entrada
    } else {
        alert('Por favor, ingrese un nombre para la nueva categoría');
    }
});
