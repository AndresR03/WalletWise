document.getElementById('add-category-button').addEventListener('click', function() {
    const newCategoryName = document.getElementById('new-category').value;
    const newCategoryValue = '0'; // Valor inicial para la nueva categoría

    // Verificar que la categoría no esté vacía
    if (newCategoryName.trim() !== '') {
        // Crear un nuevo div para la nueva categoría
        const newCategoryDiv = document.createElement('div');
        newCategoryDiv.className = 'category';

        // Crear el formulario para la nueva categoría
        const newCategoryForm = document.createElement('form'); // Nuevo formulario
        newCategoryForm.id = newCategoryName.toLowerCase().replace(/\s+/g, '-') + '-form'; // ID único para el formulario

        // Crear la etiqueta con el nombre de la nueva categoría
        const newLabel = document.createElement('label');
        newLabel.textContent = newCategoryName + ' ';
        newLabel.innerHTML += '<span>🆕</span>'; // Un icono para la nueva categoría

        // Crear el input para la nueva categoría
        const newInput = document.createElement('input');
        newInput.type = 'number'; // Cambié el tipo a 'number' para mantener la consistencia
        newInput.placeholder = newCategoryValue;

        // Agregar la etiqueta y el input al nuevo formulario
        newCategoryForm.appendChild(newLabel);
        newCategoryForm.appendChild(newInput);

        // Agregar el nuevo formulario de categoría al div
        newCategoryDiv.appendChild(newCategoryForm);

        // Agregar el nuevo div de categoría al contenedor de categorías
        document.getElementById('categories-list').appendChild(newCategoryDiv);

        // Limpiar el campo de entrada
        document.getElementById('new-category').value = '';
    } else {
        alert('Por favor, ingresa un nombre para la nueva categoría.');
    }
});
