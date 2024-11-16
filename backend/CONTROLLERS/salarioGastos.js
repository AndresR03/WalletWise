// Abrir y cerrar el modal
const modal = document.getElementById('category-modal');
const addCategoryButton = document.getElementById('add-category-button');
const closeButton = document.querySelector('.close-button');
const confirmAddCategoryButton = document.getElementById('confirm-add-category');

// Evento para abrir el modal
addCategoryButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Evento para cerrar el modal
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar el modal al hacer clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Confirmar y agregar la nueva categoría
confirmAddCategoryButton.addEventListener('click', () => {
    const newCategoryName = document.getElementById('new-category-name').value.trim();
    if (newCategoryName) {
        addNewCategory(newCategoryName);
        modal.style.display = 'none';
        document.getElementById('new-category-name').value = '';
    } else {
        alert('Por favor ingresa un nombre para la categoría.');
    }
});

// Función para agregar una nueva categoría a la lista
function addNewCategory(name) {
    const categoriesList = document.getElementById('categories-list');
    
    const newCategory = document.createElement('div');
    newCategory.classList.add('category', 'custom-category');
    
    newCategory.innerHTML = `
        <label>${name}</label>
        <input type="number" class="category-value" placeholder="0">
    `;

    categoriesList.appendChild(newCategory);
}

// Guardar la información financiera
document.getElementById('save-button').addEventListener('click', async function(event) {
    event.preventDefault();

    const usuarioId = 1;
    const salario = parseFloat(document.getElementById('salary').value) || 0;
    const comida = parseFloat(document.getElementById('food').value) || 0;
    const ropa = parseFloat(document.getElementById('clothes').value) || 0;
    const transporte = parseFloat(document.getElementById('transport').value) || 0;

    // Obtener las categorías adicionales
    const categoriasPersonalizadas = Array.from(document.querySelectorAll('.custom-category')).map(category => {
        return {
            nombre: category.querySelector('label').textContent,
            valor: parseFloat(category.querySelector('.category-value').value) || 0
        };
    });

    const data = {
        usuario_id: usuarioId,
        salario: salario,
        comida: comida,
        ropa: ropa,
        transporte: transporte,
        categorias_personalizadas: categoriasPersonalizadas 
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
            localStorage.setItem('salario', salario);
            alert('Información financiera guardada exitosamente');
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error al guardar la información financiera:', error);
        alert('Error al guardar la información financiera, intenta nuevamente.');
    }

    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }
});
