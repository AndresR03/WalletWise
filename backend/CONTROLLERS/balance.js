// Obtener datos financieros del backend y generar gráfico con gastos en 7 días
async function obtenerDatosYGenerarGrafico() {
    try {
        // Recupera el ID del usuario desde el localStorage
        const userId = localStorage.getItem('user_id');
        
        // Verifica que el ID del usuario esté disponible antes de hacer la solicitud
        if (!userId) {
            console.error('ID de usuario no encontrado en localStorage. Asegúrate de haber iniciado sesión correctamente.');
            alert('Error: ID de usuario no encontrado. Por favor, inicia sesión de nuevo.');
            return;
        }

        // Realiza la solicitud utilizando el ID del usuario
        const response = await fetch(`http://localhost:3000/informacion-financiera-completa/${userId}`);
        const data = await response.json();

        // Datos de gastos en 7 días
        const gastos = [
            { categoria: 'Comida', cantidad: data.gastoComida || 0, icono: '🍔' },
            { categoria: 'Ropa', cantidad: data.gastoRopa || 0, icono: '👗' },
            { categoria: 'Transporte', cantidad: data.gastoTransporte || 0, icono: '🚗' },
            { categoria: 'Otra 1', cantidad: data.gastoOtraCategoria1 || 0, icono: '1️⃣' },
            { categoria: 'Otra 2', cantidad: data.gastoOtraCategoria2 || 0, icono: '2️⃣' },
            { categoria: 'Otra 3', cantidad: data.gastoOtraCategoria3 || 0, icono: '3️⃣' }
        ];

        // Configuración del gráfico usando D3.js
        const svg = d3.select("#chart");
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 90 };

        const x = d3.scaleBand()
            .domain(gastos.map(d => d.categoria))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(gastos, d => d.cantidad)])
            .range([height - margin.bottom, margin.top]);

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
            .attr("x", d => x(d.categoria))
            .attr("y", d => y(d.cantidad))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d.cantidad))
            .attr("fill", (d, i) => d3.schemeCategory10[i]);

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
