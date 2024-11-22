function goBack() {
    window.history.back(); 
}

async function obtenerDatosYGenerarGrafico() {
    try {
        // Obtener el ID del usuario que inició sesión
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            console.error('ID de usuario no encontrado en localStorage.');
            alert('Error: Por favor, inicia sesión de nuevo.');
            return;
        }

        // Realizar la solicitud al backend 
        const response = await fetch(`http://localhost:3000/informacion-financiera/${userId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // respuesta fue exitosa
        if (!response.ok) {
            console.error(`Error del servidor: ${response.status} ${response.statusText}`);
            alert('Error al cargar datos. Intenta nuevamente.');
            return;
        }

        // respuesta JSON
        const data = await response.json();

        // Verificar que los datos sean válidos
        if (!data || typeof data !== 'object') {
            console.error('Datos inválidos recibidos desde el servidor:', data);
            alert('Error al procesar los datos financieros.');
            return;
        }

        // Mapear los datos financieros
        const gastosBase = [
            { categoria: 'Comida', cantidad: (data.comida || 0) / 4, icono: '🍔' },
            { categoria: 'Ropa', cantidad: (data.ropa || 0) / 4, icono: '👗' },
            { categoria: 'Transporte', cantidad: (data.transporte || 0) / 4, icono: '🚗' },
        ];

        //categorías personalizadas
        const categoriasPersonalizadas = (data.categorias_personalizadas || []).map(cat => ({
            categoria: cat.nombre || 'Sin categoría',
            cantidad: (cat.valor || 0) / 4,
            icono: '🛠️',
        }));

        // Combinar todas las categorías
        const gastos = [...gastosBase, ...categoriasPersonalizadas];

        
        const svg = d3.select("#chart");
        svg.selectAll("*").remove();

        const width = document.querySelector("#chart-container").clientWidth;
        const height = width * 0.6; 
        const margin = { top: 20, right: 30, bottom: 40, left: 90 };

        const x = d3.scaleBand().domain(gastos.map(d => d.categoria)).range([margin.left, width - margin.right]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(gastos, d => d.cantidad)]).nice().range([height - margin.bottom, margin.top]);

        // Crear ejes
        svg.attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(d => d.toLocaleString()));

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
            .on("mouseover", function () {
                d3.select(this).transition().duration(200).attr("fill", "#FFFF00");
            })
            .on("mouseout", function (event, d) {
                d3.select(this).transition().duration(200).attr("fill", colorMap[d.categoria] || colorMap['default']);
            });

        // Actualizar la tabla con los datos
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; 

        gastos.forEach(gasto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${gasto.icono}</td>
                <td>${gasto.categoria}</td>
                <td>${gasto.cantidad.toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error al obtener datos financieros:', error);
        alert('Error inesperado. Por favor, intenta nuevamente.');
    }
}


document.addEventListener('DOMContentLoaded', obtenerDatosYGenerarGrafico);
