const initialData = [
    { name: 'Transporte', value: 5, icon: '🚗' },
    { name: 'Comida', value: 15, icon: '🍽️' },
    { name: 'Ropa', value: 25, icon: '👚' },
    { name: 'Otros', value: 15, icon: '📦' }
];

let data = [...initialData];

function updateChart() {
    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Limpiar gráfico anterior
    d3.select("#chart").selectAll("*").remove();

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top]);

    x.domain(data.map(d => d.name));
    y.domain([0, d3.max(data, d => d.value)]);

    // Ejes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Barras con los colores previos
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.bottom - y(d.value))
        .attr("fill", d => {
            switch (d.name) {
                case 'Transporte': return '#4CAF50'; // Verde
                case 'Comida': return '#F44336'; // Rojo
                case 'Ropa': return '#FFC107'; // Amarillo
                default: return '#9C27B0'; // Morado (para "Otros")
            }
        });

    updateTable(); // Llamada para generar la tabla después del gráfico
}

function updateTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Limpiar tabla anterior

    // Crear una nueva fila para cada elemento en los datos
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.icon}</td>
            <td>${item.name}</td>
            <td>${item.value}%</td>
        `;
        tableBody.appendChild(row);
    });
}

document.querySelector('.back-button').addEventListener('click', () => {
    alert('Volver clicked');
});

updateChart(); // Generar gráfico al cargar la página
