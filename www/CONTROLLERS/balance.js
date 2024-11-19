async function obtenerDatosYGenerarGrafico() {
    try {
        // Obtener el ID del usuario que inició sesión desde localStorage
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            console.error('ID de usuario no encontrado en localStorage.');
            alert('Error: Por favor, inicia sesión de nuevo.');
            return;
        }

        // Realizar la solicitud al backend para obtener los datos financieros
        const response = await fetch(`https://walletwise-backend-p4gd.onrender.com/informacion-financiera/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            console.error(`Error del servidor: ${response.status} ${response.statusText}`);
            alert('Error al cargar datos. Intenta nuevamente.');
            return;
        }

        // Parsear la respuesta JSON
        const data = await response.json();

        // Verificar que los datos sean válidos
        if (!data || typeof data !== 'object') {
            console.error('Datos inválidos recibidos desde el servidor:', data);
            alert('Error al procesar los datos financieros.');
            return;
        }

        // Mapear los datos financieros, convirtiéndolos al formato semanal
        const gastosBase = [
            { categoria: 'Comida', cantidad: (data.comida || 0) / 4, icono: '🍔' },
            { categoria: 'Ropa', cantidad: (data.ropa || 0) / 4, icono: '👗' },
            { categoria: 'Transporte', cantidad: (data.transporte || 0) / 4, icono: '🚗' },
        ];

        // Procesar categorías personalizadas
        const categoriasPersonalizadas = (data.categorias_personalizadas || []).map(cat => ({
            categoria: cat.nombre || 'Sin categoría',
            cantidad: (cat.valor || 0) / 4,
            icono: '🛠️',
        }));

        // Combinar todas las categorías
        const gastos = [...gastosBase, ...categoriasPersonalizadas];

        // Configuración del gráfico con D3.js
        const svg = d3.select("#chart");
        svg.selectAll("*").remove(); // Limpia el gráfico existente antes de agregar nuevos datos

        const width = 500, height = 300, margin = { top: 20, right: 30, bottom: 40, left: 90 };
        const x = d3.scaleBand().domain(gastos.map(d => d.categoria)).range([margin.left, width - margin.right]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(gastos, d => d.cantidad)]).nice().range([height - margin.bottom, margin.top]);

        // Crear ejes
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(d => d.toLocaleString())); // Formatear valores en el eje Y

        // Asignar colores a las categorías
        const colorMap = {
            'Comida': '#00C853',      
            'Ropa': '#FFAB00',        
            'Transporte': '#2979FF',  
            'default': '#FF3D00',     
        };

        // Dibujar las barras del gráfico
        svg.selectAll("rect")
            .data(gastos)
            .join("rect")
            .attr("x", d => x(d.categoria))
            .attr("y", d => y(d.cantidad))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d.cantidad))
            .attr("fill", d => colorMap[d.categoria] || colorMap['default'])
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "#FFFF00"); // Amarillo puro al pasar el cursor
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", colorMap[d.categoria] || colorMap['default']); // Restaura el color original
            });

        // Actualizar la tabla con los datos
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; // Limpiar el contenido anterior

        gastos.forEach(gasto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${gasto.icono}</td>
                <td>${gasto.categoria}</td>
                <td>${gasto.cantidad.toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });

        // Actualizar el título del gráfico
        const chartTitle = document.getElementById('chart-title');
        if (chartTitle) {
            chartTitle.textContent = 'Balance Semanal de Gastos';
        }

    } catch (error) {
        console.error('Error al obtener datos financieros:', error);
        alert('Error inesperado. Por favor, intenta nuevamente.');
    }
}

// Llamar a la función para generar el gráfico y la tabla al cargar la página
document.addEventListener('DOMContentLoaded', obtenerDatosYGenerarGrafico);
