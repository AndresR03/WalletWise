function goBack() {
    window.history.back();
}

function goToDetails() {
    window.location.href = 'vistarecomen.html';  
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioId = 1; 

    try {
        const response = await fetch(`http://localhost:3000/informacion-financiera/${usuarioId}`)
        const data = await response.json();

        if (response.ok) {
            // const { comida = 0, ropa = 0, transporte = 0, otra_categoria_1 = 0, otra_categoria_2 = 0, otra_categoria_3 = 0 } = data;

            const transporte = parseFloat(data.transporte) || 0;
            const comida = parseFloat(data.comida) || 0;
            const ropa = parseFloat(data.ropa) || 0;
            const otra_categoria_1 = parseFloat(data.otra_categoria_1) || 0;
            const otra_categoria_2 = parseFloat(data.otra_categoria_2) || 0;
            const otra_categoria_3 = parseFloat(data.otra_categoria_3) || 0;

            const total = transporte + comida + ropa + otra_categoria_1 + otra_categoria_2 + otra_categoria_3;

            if (total === 0) {
                document.getElementById('recommendacion-text').innerText = 'No hay suficiente información para generar una recomendación.';
                return;
            }


            const ctx = document.getElementById('myPieChart').getContext('2d');
            const myPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Comida', 'Ropa', 'Transporte', 'OtraCat1', 'OtraCat2', 'OtraCat3'],
                    datasets: [{
                        data: [comida, ropa, transporte, otra_categoria_1, otra_categoria_2, otra_categoria_3],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#33FF57', '#3357FF'],
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'left',
                        },
                        title: {
                            display: true,
                            text: 'Distribución de Gastos',
                            color: '#FFFFFF',
                        },
                    },
                },
            });

    
            const transportePorcentaje = ((transporte / total) * 100).toFixed(2);
            const comidaPorcentaje = ((comida / total) * 100).toFixed(2);
            const ropaPorcentaje = ((ropa / total) * 100).toFixed(2);
            const otros1Porcentaje = ((otra_categoria_1 / total) * 100).toFixed(2);
            const otros2Porcentaje = ((otra_categoria_2 / total) * 100).toFixed(2);
            const otros3Porcentaje = ((otra_categoria_3 / total) * 100).toFixed(2);

        
            const legendHTML = `
                <p><span class="color-box" style="background-color: #FF6384;"></span> Comida ${comidaPorcentaje}%</p>
                <p><span class="color-box" style="background-color: #36A2EB;"></span> Ropa ${ropaPorcentaje}%</p>
                <p><span class="color-box" style="background-color: #FFCE56;"></span> Transporte ${transportePorcentaje}%</p>
                <p><span class="color-box" style="background-color: #FF5733;"></span> OtraCat1 ${otros1Porcentaje}%</p>
                <p><span class="color-box" style="background-color: #33FF57;"></span> OtraCat2 ${otros2Porcentaje}%</p>
                <p><span class="color-box" style="background-color: #3357FF;"></span> OtraCat3 ${otros3Porcentaje}%</p>
            `;
            document.querySelector('.legend').innerHTML = legendHTML;
        } else {
            console.error('Error al obtener datos:', data.message);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
});
