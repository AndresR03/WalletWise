document.getElementById("calcular").addEventListener("click", function () {
    const precioObjetivo = parseFloat(document.getElementById("precio").value);
    const fecha = document.getElementById("fecha").value;
    
    if (isNaN(precioObjetivo) || !fecha) {
      alert("Por favor, ingresa todos los datos.");
      return;
    }
  
    const ahorroDiario = 2.20;
    const tabla = document.getElementById("tabla-resultado");
    tabla.innerHTML = ''; // Limpiar resultados anteriores
  
    let acumulado = 0;
    for (let dia = 1; dia <= 30; dia++) {
      acumulado += ahorroDiario;
  
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
      
      // Detener si se alcanza o supera el precio objetivo
      if (acumulado >= precioObjetivo) break;
    }
  });
  