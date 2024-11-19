function goBack() {
    window.history.back();
}
document.addEventListener('DOMContentLoaded', async () => {
    const usuarioId = localStorage.getItem('user_id'); // Obtener el ID del usuario desde localStorage
    if (!usuarioId) {
        console.error('No se ha encontrado la ID del usuario.');
        return;
    }

    try {
        // Ajustar el fetch para usar el endpoint actualizado
        const response = await fetch(`https://walletwise-backend-p4gd.onrender.com/informacion-financiera/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No se pudieron obtener los datos. Verifica el servidor.');
        }

        const data = await response.json();

        if (!data) {
            console.error('No se han recibido datos.');
            return;
        }

        // Verifica los datos recibidos
        console.log('Datos recibidos:', data);

        const transporte = parseFloat(data.transporte) || 0;
        const comida = parseFloat(data.comida) || 0;
        const ropa = parseFloat(data.ropa) || 0;
        let categoriasPersonalizadas = Array.isArray(data.categorias_personalizadas)
            ? data.categorias_personalizadas
            : [];

        const labels = ['Transporte', 'Comida', 'Ropa'];
        const dataValues = [transporte, comida, ropa];
        const colors = ['#FFCE56', '#FF6384', '#36A2EB'];

        categoriasPersonalizadas.forEach((categoria, index) => {
            if (index < 17) {
                labels.push(categoria.nombre);
                dataValues.push(parseFloat(categoria.valor) || 0);
                colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
            }
        });

        const total = dataValues.reduce((acc, val) => acc + val, 0);
        if (total === 0) {
            console.error('El total es cero, no se puede generar los gráficos.');
            return;
        }

        // Mostrar la distribución de gastos con colores
        const distributionDiv = document.getElementById('distribucionGastos');
        distributionDiv.innerHTML = labels.map((label, index) => `
            <div class="legend-item">
                <div class="legend-color" data-color style="--color: ${colors[index]}"></div>
                <span>${label}: ${(dataValues[index] / total * 100).toFixed(2)}%</span>
            </div>`).join('');

        // Generar la recomendación
        const recommendationText = document.getElementById('recommendacion-text');
        recommendationText.textContent = generarRecomendacion(labels, dataValues, total);

        // Inicializar gráficos
        const pieCtx = document.getElementById('myPieChart').getContext('2d');
        const barCtx = document.getElementById('barChart').getContext('2d');
        const lineCtx = document.getElementById('lineChart').getContext('2d');

        new Chart(pieCtx, {
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
                    legend: { display: true },
                    datalabels: {
                        formatter: (value) => `${((value / total) * 100).toFixed(2)}%`,
                        color: '#fff',
                    }
                }
            }
        });

        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gastos',
                    data: dataValues,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gastos',
                    data: dataValues,
                    borderColor: '#36A2EB',
                    backgroundColor: '#36A2EB',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
});

function generarRecomendacion(labels, dataValues, total) {
    const porcentajeMayor = Math.max(...dataValues.map(value => (value / total) * 100));
    const indexMayor = dataValues.findIndex(value => (value / total) * 100 === porcentajeMayor);

    const categoriaMayor = labels[indexMayor];
    const porcentajeMayorTexto = porcentajeMayor.toFixed(2);

    if (porcentajeMayor > 50) {
        return `Tu mayor gasto es en "${categoriaMayor}" (${porcentajeMayorTexto}%). Considera ajustar tus gastos en esta categoría para mantener un presupuesto equilibrado.`;
    } else if (porcentajeMayor > 30) {
        return `El gasto en "${categoriaMayor}" es significativo (${porcentajeMayorTexto}%). Revisa si puedes optimizar tus recursos en esta área.`;
    } else {
        return `Tus gastos están bien distribuidos. ¡Sigue controlando tus finanzas y considera ahorrar un poco más!`;
    }
}
