document.getElementById("calcular").addEventListener("click", async function () {
    const precioObjetivo = parseFloat(document.getElementById("precio").value);
    const fecha = document.getElementById("fecha").value;
    
    const usuarioId = 1; // Cambia esto por el ID del usuario que necesitas

    if (isNaN(precioObjetivo) || !fecha) {
      alert("Por favor, ingresa todos los datos.");
      return;
        alert("Por favor, ingresa todos los datos.");
        return;
    }

    // Obtener el salario desde el backend
    let salario;
    try {
        const response = await fetch(`http://localhost:3000/informacion-financiera/${usuarioId}`);
        const data = await response.json();
        
        // Verifica si hay un error en la respuesta
        if (response.ok) {
            salario = parseFloat(data.salario);
        } else {
            throw new Error(data.message || 'Error al obtener los datos');
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

    let acumulado = 0;
    for (let dia = 1; dia <= 30; dia++) {
        acumulado += ahorroDiario;

        // Detener si se alcanza o supera el precio objetivo
        if (acumulado >= precioObjetivo) {
            // Crear la fila para el último día
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

            // Salir del bucle si se ha alcanzado el precio objetivo
            break;
        }

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
  });
  