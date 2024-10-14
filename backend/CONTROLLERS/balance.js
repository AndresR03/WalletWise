// Obtener datos financieros del backend y generar gráfico con gastos en 7 días
async function obtenerDatosYGenerarGrafico() {
    try {
        const response = await fetch('http://localhost:3000/informacion-financiera-completa/1'); // Reemplaza 1 por el ID del usuario correspondiente
        const data = await response.json();

        // Datos de gastos en 7 días
        const gastos = [
            { categoria: 'Comida', cantidad: data.gastoComida || 0, icono: '🍔' }, // Icono de comida
            { categoria: 'Ropa', cantidad: data.gastoRopa || 0, icono: '👗' }, // Icono de ropa
            { categoria: 'Transporte', cantidad: data.gastoTransporte || 0, icono: '🚗' }, // Icono de transporte
            { categoria: 'Otra 1', cantidad: data.gastoOtraCategoria1 || 0, icono: '1️⃣' }, // Icono para otra categoría 1
            { categoria: 'Otra 2', cantidad: data.gastoOtraCategoria2 || 0, icono: '2️⃣' }, // Icono para otra categoría 2
            { categoria: 'Otra 3', cantidad: data.gastoOtraCategoria3 || 0, icono: '3️⃣' }  // Icono para otra categoría 3
        ];

        // Configuración del gráfico usando D3.js
        const svg = d3.select("#chart"); // Asegúrate de que el ID sea "chart"
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 90 };

        const x = d3.scaleBand()
            .domain(gastos.map(d => d.categoria)) // Categorías en el eje X
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(gastos, d => d.cantidad)])  // El eje Y va de 0 al gasto máximo
            .range([height - margin.bottom, margin.top]); // Invertir para que el 0 esté en la parte inferior

        const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);

        svg.append("g")
            .selectAll("rect")
            .data(gastos)
            .join("rect")
            .attr("x", d => x(d.categoria)) // Usar el valor de la categoría para el eje X
            .attr("y", d => y(d.cantidad)) // Usar el valor de la cantidad para el eje Y
            .attr("width", x.bandwidth()) // Ancho de las barras
            .attr("height", d => y(0) - y(d.cantidad)) // Altura de las barras
            .attr("fill", (d, i) => d3.schemeCategory10[i]); // Usar colores diferentes para cada barra

        // Actualizar la tabla con los gastos
        const tableBody = d3.select("#table-body");
        tableBody.selectAll("tr")
            .data(gastos)
            .join("tr")
            .html(d => `
                <td>${d.icono}</td>
                <td>${d.categoria}</td>
                <td>${d.cantidad.toFixed(2)}</td>
            `);

    } catch (error) {
        console.error('Error al obtener los datos financieros:', error);
    }
}

// Llamar la función para generar el gráfico al cargar la página
document.addEventListener('DOMContentLoaded', obtenerDatosYGenerarGrafico);
