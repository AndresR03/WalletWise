function goBack() {
    window.history.back();
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioId = '1';
    if (!usuarioId) {
        console.error('No se ha encontrado la ID del usuario.');
        return;
    }

    const response = await fetch(`http://localhost:3000/informacion-financiera/${usuarioId}`);
    const data = await response.json();

    const transporte = parseFloat(data.transporte) || 0;
    const comida = parseFloat(data.comida) || 0;
    const ropa = parseFloat(data.ropa) || 0;
    const otra_categoria_1 = parseFloat(data.otra_categoria_1) || 0;
    const otra_categoria_2 = parseFloat(data.otra_categoria_2) || 0;
    const otra_categoria_3 = parseFloat(data.otra_categoria_3) || 0;

    const total = transporte + comida + ropa + otra_categoria_1 + otra_categoria_2 + otra_categoria_3;

    if (total === 0) {
        console.error('El total es cero, no se puede generar el gráfico ni los porcentajes.');
        return;
    }

    const labels = ['Transporte', 'Comida', 'Ropa', 'Otra Categoría 1', 'Otra Categoría 2', 'Otra Categoría 3'];
    const dataValues = [transporte, comida, ropa, otra_categoria_1, otra_categoria_2, otra_categoria_3];
    const colors = ['#FFCE56', '#FF6384', '#36A2EB', '#FF5733', '#33FF57', '#3357FF'];


    const pieConfig = {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    };

    const pieCtx = document.getElementById('myPieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, pieConfig);


    const legendContainer = document.querySelector('.legend');
    legendContainer.innerHTML = ''; 

    labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.classList.add('legend-item');

        const colorBox = document.createElement('div');
        colorBox.classList.add('legend-color');
        colorBox.style.backgroundColor = colors[index];

        legendItem.appendChild(colorBox);
        legendItem.appendChild(document.createTextNode(label));

        // Calcular y mostrar el porcentaje
        const porcentaje = ((dataValues[index] / total) * 100).toFixed(2);
        legendItem.appendChild(document.createTextNode(`${porcentaje}%`));


        // Agregar evento para ocultar/mostrar en el gráfico de pastel
        legendItem.addEventListener('click', () => {
            pieChart.data.datasets[0].hidden[index] = !pieChart.data.datasets[0].hidden[index];
            pieChart.update();
        });

        legendContainer.appendChild(legendItem);
    });


    const barConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos por Categoría',
                data: dataValues,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    };
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, barConfig);


    const lineConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos por Categoría',
                data: dataValues,
                backgroundColor: colors,
                borderColor: colors,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    };
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, lineConfig);

    
});