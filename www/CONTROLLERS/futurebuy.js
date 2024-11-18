document.getElementById("calcular").addEventListener("click", async function () {
    const precioObjetivo = parseFloat(document.getElementById("precio").value);
    const fecha = document.getElementById("fecha").value;
    
    const usuarioId = localStorage.getItem('user_id'); // Usar el ID del usuario almacenado en localStorage
  
    // Validar que los valores no sean inválidos
    if (isNaN(precioObjetivo) || !fecha) {
        alert("Por favor, ingresa todos los datos correctamente.");
        return;
    }
  
    // Obtener el salario desde el backend usando la nueva ruta
    let salario;
    try {
        const response = await fetch(`https://walletwise-backend-p4gd.onrender.com/informacion-financiera-salario2/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Validar la respuesta del servidor
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los datos del salario');
        }

        const data = await response.json();

        // Verifica si el salario es válido
        if (data.salario) {
            salario = parseFloat(data.salario);

            // Validar si el salario obtenido es un número
            if (isNaN(salario)) {
                throw new Error('El salario recibido no es un número válido');
            }
        } else {
            throw new Error('No se encontró un salario válido para el usuario');
        }
    } catch (error) {
        alert("Error al obtener el salario: " + error.message);
        console.error(error);
        return;
    }
  
    // Asumimos un porcentaje del salario como ahorro diario
    const porcentajeAhorro = 0.05; // Ejemplo: 5% del salario diario
    const ahorroDiario = salario * porcentajeAhorro;
    const tabla = document.getElementById("tabla-resultado");
    tabla.innerHTML = ''; // Limpiar resultados anteriores
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.style.display = "block"; // Mostrar la sección de resultados
  
    let acumulado = 0;
    let dia = 0; // Contador de días

    // Cálculo dinámico hasta alcanzar el precio objetivo
    while (acumulado < precioObjetivo) {
        dia++; // Incrementar el día
        acumulado += ahorroDiario;

        // Crear la fila para los días antes de alcanzar el precio objetivo
        const fila = document.createElement("tr");
        const columnaDia = document.createElement("td");
        const columnaAhorro = document.createElement("td");
        const columnaAcumulado = document.createElement("td");
  
        columnaDia.textContent = dia;
        columnaAhorro.textContent = ahorroDiario.toFixed(2);
        columnaAcumulado.textContent = acumulado.toFixed(2);
  
        fila.appendChild(columnaDia);
        fila.appendChild(columnaAhorro);
        fila.appendChild(columnaAcumulado);
  
        tabla.appendChild(fila);
    }

    // Desplazarse hacia la parte superior de la página
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Mostrar un mensaje indicando el tiempo necesario para alcanzar el objetivo
    alert(`Necesitarás ahorrar durante ${dia} días para alcanzar tu precio objetivo de ${precioObjetivo.toLocaleString()} con un ahorro diario del 5% de tu salario.`);
});

// Botón para cerrar los resultados y ocultar la tabla
document.getElementById("cerrarResultados").addEventListener("click", function () {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.style.display = "none"; // Ocultar la sección de resultados
});
