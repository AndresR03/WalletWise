// Corrección de errores y mejoras en balance.js

async function obtenerDatosYGenerarGrafico() {
    try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            console.error('ID de usuario no encontrado en localStorage.');
            alert('Error: Por favor, inicia sesión de nuevo.');
            return;
        }

        const response = await fetch(`https://walletwise-1-33dw.onrender.com/informacion-financiera/${userId}`);
        if (!response.ok) {
            console.error(`Error del servidor: ${response.status} ${response.statusText}`);
            alert('Error al cargar datos. Intenta nuevamente.');
            return;
        }

        const data = await response.json();
        const gastos = [
            { categoria: 'Comida', cantidad: data.comida || 0, icono: '🍔' },
            { categoria: 'Ropa', cantidad: data.ropa || 0, icono: '👗' },
            { categoria: 'Transporte', cantidad: data.transporte || 0, icono: '🚗' },
        ];

        const svg = d3.select("#chart");
        const width = 500, height = 300, margin = { top: 20, right: 30, bottom: 40, left: 90 };
        const x = d3.scaleBand().domain(gastos.map(d => d.categoria)).range([margin.left, width - margin.right]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(gastos, d => d.cantidad)]).range([height - margin.bottom, margin.top]);

        svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));
        svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
        svg.selectAll("rect").data(gastos).join("rect")
            .attr("x", d => x(d.categoria))
            .attr("y", d => y(d.cantidad))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d.cantidad))
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);
    } catch (error) {
        console.error('Error al obtener datos financieros:', error);
        alert('Error inesperado.');
    }
}

document.addEventListener('DOMContentLoaded', obtenerDatosYGenerarGrafico);
