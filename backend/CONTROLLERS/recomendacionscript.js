function goBack() {
    window.history.back();
}

function goToDetails() {
    window.location.href = 'vistarecomen.html';  
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioId = 1; // Cambia esto por el id real del usuario

    try {
        const response = await fetch(`http://localhost:3000/informacion-financiera/${usuarioId}`);
        const data = await response.json();
        console.log(data); // Verifica los datos aquí

        if (response.ok) {
            const { comida = 0, ropa = 0, transporte = 0, otra_categoria_1 = 0, otra_categoria_2 = 0, otra_categoria_3 = 0 } = data;

            const ctx = document.getElementById('myPieChart').getContext('2d');
            const myPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Comida', 'Ropa', 'Transporte', 'Otro1', 'Otro2', 'Otro3'],
                    datasets: [{
                        data: [comida, ropa, transporte, otra_categoria_1, otra_categoria_2, otra_categoria_3],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#33FF57', '#3357FF'],
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Distribución de Gastos',
                        },
                    },
                },
            });
        } else {
            console.error('Error al obtener datos:', data.message);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
});


window.onload = drawChart;