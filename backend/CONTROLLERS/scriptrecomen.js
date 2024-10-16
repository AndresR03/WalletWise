function goBack() {
    window.history.back();
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioId = '1';
    if (!usuarioId) {
        console.error('No se ha encontrado la ID del usuario.');
        return;
    }


    const response = await fetch (`http://localhost:3000/informacion-financiera/${usuarioId}`); 
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


    const transportePorcentaje = ((transporte / total) * 100).toFixed(2);
    const comidaPorcentaje = ((comida / total) * 100).toFixed(2);
    const ropaPorcentaje = ((ropa / total) * 100).toFixed(2);
    const otros1Porcentaje = ((otra_categoria_1 / total) * 100).toFixed(2);
    const otros2Porcentaje = ((otra_categoria_2 / total) * 100).toFixed(2);
    const otros3Porcentaje = ((otra_categoria_3 / total) * 100).toFixed(2);


    const dataChart = {
        labels: ['Transporte', 'Comida', 'Ropa', 'otra_categoria_1', 'otra_categoria_2', 'otra_categoria_3'],
        datasets: [{
            label: 'Categorías',
            data: [transporte, comida, ropa, otra_categoria_1, otra_categoria_2, otra_categoria_3],
            backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB', '#FF5733', '#33FF57', '#3357FF'],
            hoverOffset: 4
        }]
    };


    const config = {
        type: 'pie',
        data: dataChart,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false 
                }
            }
        }
    };

    const ctx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(ctx, config);


    const legendHTML = `
        <p><span class="color-box" style="background-color: #FFCE56;"></span> Transporte ${transportePorcentaje}%</p>
        <p><span class="color-box" style="background-color: #FF6384;"></span> Comida ${comidaPorcentaje}%</p>
        <p><span class="color-box" style="background-color: #36A2EB;"></span> Ropa ${ropaPorcentaje}%</p>
        <p><span class="color-box" style="background-color: #FF5733;"></span> otra_categoria_1 ${otros1Porcentaje}%</p>
        <p><span class="color-box" style="background-color: #33FF57;"></span> otra_categoria_2 ${otros2Porcentaje}%</p>
        <p><span class="color-box" style="background-color: #3357FF;"></span> otra_categoria_3 ${otros3Porcentaje}%</p>
    `;

    document.querySelector('.legend').innerHTML = legendHTML;
});
