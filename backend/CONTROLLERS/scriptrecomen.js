
function goBack() {
    window.history.back();
}


const data = {
    labels: ['Transporte', 'Comida', 'Ropa', 'Otros'],
    datasets: [{
        label: 'Categorías',
        data: [35, 25, 25, 15], 
        backgroundColor: ['#ff6666', '#ffcc99', '#ffff99', '#666699'],
        hoverOffset: 4
    }]
};


const config = {
    type: 'pie',
    data: data,
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
    <p><span class="color-box" style="background-color: #ff6666;"></span> Transporte 35%</p>
    <p><span class="color-box" style="background-color: #ffcc99;"></span> Comida 25%</p>
    <p><span class="color-box" style="background-color: #ffff99;"></span> Ropa 25%</p>
    <p><span class="color-box" style="background-color: #666699;"></span> Otros 15%</p>
`;


document.querySelector('.legend').innerHTML = legendHTML;
