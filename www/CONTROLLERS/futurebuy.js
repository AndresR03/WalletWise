document.getElementById("calcular").addEventListener("click", async function () {
    const precioObjetivo = parseFloat(document.getElementById("precio").value);
    const fecha = document.getElementById("fecha").value;
    const nombreObjetivo = prompt("Por favor, ingresa un nombre para este objetivo:");

    const usuarioId = localStorage.getItem('user_id'); // Usar el ID del usuario almacenado en localStorage

    if (isNaN(precioObjetivo) || !fecha || !nombreObjetivo) {
        alert("Por favor, ingresa todos los datos correctamente.");
        return;
    }

    let salario;
    try {
        const response = await fetch(`http://localhost:3000/informacion-financiera-salario2/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los datos del salario');
        }

        const data = await response.json();

        if (data.salario) {
            salario = parseFloat(data.salario);

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

    const porcentajeAhorro = 0.05;
    const ahorroDiario = salario * porcentajeAhorro;
    const tabla = document.getElementById("tabla-resultado");
    tabla.innerHTML = '';
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.style.display = "block";

    let acumulado = 0;
    let dia = 0;

    while (acumulado < precioObjetivo) {
        dia++;
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
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });

    alert(`Necesitarás ahorrar durante ${dia} días para alcanzar tu precio objetivo de ${precioObjetivo.toLocaleString()} con un ahorro diario del 5% de tu salario.`);

    guardarObjetivoEnBaseDeDatos(nombreObjetivo, precioObjetivo, fecha, ahorroDiario, dia, usuarioId);
});

document.getElementById("cerrarResultados").addEventListener("click", function () {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.style.display = "none";
});

async function guardarObjetivoEnBaseDeDatos(nombre, precioObjetivo, fecha, ahorroDiario, diasNecesarios, usuarioId) {
    try {
        const response = await fetch('http://localhost:3000/guardar-objetivo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuarioId,
                nombre,
                precioObjetivo,
                fecha,
                ahorroDiario,
                diasNecesarios,
            }),
        });

        if (!response.ok) {
            throw new Error('Error al guardar el objetivo en la base de datos');
        }

        const data = await response.json();
        alert(data.message);
        cargarObjetivosGuardados();
    } catch (error) {
        alert('No se pudo guardar el objetivo: ' + error.message);
        console.error(error);
    }
}

async function cargarObjetivosGuardados() {
    const usuarioId = localStorage.getItem("user_id");

    if (!usuarioId) {
        alert("Usuario no identificado. Por favor, inicia sesión nuevamente.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/objetivos/${usuarioId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los objetivos guardados.");
        }

        const objetivos = await response.json();

        const tabla = document.getElementById("tabla-objetivos");
        tabla.innerHTML = "";

        objetivos.forEach((objetivo) => {
            if (!objetivo.id) {
                console.warn(`El objetivo "${objetivo.nombre}" no tiene un ID válido y será ignorado.`);
                return; // Ignorar registros sin ID válido
            }

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${objetivo.nombre || "Sin nombre"}</td>
                <td>${parseFloat(objetivo.precio_objetivo || 0).toLocaleString()}</td>
                <td>${new Date(objetivo.fecha).toLocaleDateString()}</td>
                <td>${parseFloat(objetivo.ahorro_diario || 0).toFixed(2)}</td>
                <td>${parseInt(objetivo.dias_necesarios || 0)}</td>
            `;

            tabla.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar los objetivos guardados:", error);
        alert("No se pudieron cargar los objetivos guardados.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    cargarObjetivosGuardados();
});
