
function goBack() {
    window.history.back();
}

 
function goToDetails() {
    window.location.href = 'vistarecomen.html';  
}


const data = {
    labels: ['Transporte', 'Comida', 'Ropa', 'Otros'],
    datasets: [{
    data: [25, 40, 15, 20],  
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }]
};


const config = {
    type: 'pie',
    data: data,
};

window.onload = function() {
    const ctx = document.getElementById('myPieChart').getContext('2d');
    new Chart(ctx, config);

    const recommendation = "";
    document.getElementById('recommendation-text').textContent = recommendation;
};
