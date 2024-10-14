// Datos financieros
let data = [];

// Obtener datos financieros desde el backend
const obtenerDatosFinancieros = async (usuario_id) => {
    try {
        const response = await fetch(`http://localhost:3000/informacion-financiera/${usuario_id}`);
        const porcentajes = await response.json();
        
        // Procesar datos para crear el formato que se necesita
        return [
            { name: 'Transporte', value: porcentajes.transporte, icon: '🚗' },
            { name: 'Comida', value: porcentajes.comida, icon: '🍽️' },
            { name: 'Ropa', value: porcentajes.ropa, icon: '👚' },
            { name: 'Otros', value: porcentajes.otra_categoria_1 + porcentajes.otra_categoria_2 + porcentajes.otra_categoria_3, icon: '📦' }
        ];
    } catch (error) {
        console.error('Error al obtener datos financieros:', error);
        return [];
    }
};

// Función para actualizar el gráfico
const updateChart = async (usuario_id) => {
    data = await obtenerDatosFinancieros(usuario_id);

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
    y.domain([0, 100]); // Mantenemos el dominio de 0 a 100 para porcentajes

    // Ejes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`));

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

    updateTable();
}

function updateTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Limpiar tabla anterior

    // Crear una nueva fila para cada elemento en los datos
    data.forEach(item => {
        const row = document.createElement('tr');
        
        // El valor ya está redondeado, solo lo mostramos
        row.innerHTML = `
            <td>${item.icon}</td>
            <td>${item.name}</td>
            <td>${item.value}%</td>
        `;
        tableBody.appendChild(row);
    });
}

// Evento para el botón de volver
document.querySelector('.back-button').addEventListener('click', () => {
    alert('Volver clicked');
});

// Iniciar el gráfico al cargar la página
// Cambia '1' por el ID del usuario correspondiente cuando se carga la página
updateChart(1);