document.getElementById("calcular").addEventListener("click", async function () {
    const precioObjetivo = parseFloat(document.getElementById("precio").value);
    const fecha = document.getElementById("fecha").value;
    const nombreObjetivo = document.getElementById("nombre").value;

    const usuarioId = localStorage.getItem('user_id'); 

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
        salario = parseFloat(data.salario);

        if (isNaN(salario)) {
            throw new Error('El salario recibido no es un número válido');
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
        fila.innerHTML = `
            <td>${dia}</td>
            <td>${ahorroDiario.toFixed(2)}</td>
            <td>${acumulado.toFixed(2)}</td>
        `;
        tabla.appendChild(fila);
    }

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
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${objetivo.nombre}</td>
                <td>${parseFloat(objetivo.precio_objetivo).toLocaleString()}</td>
                <td>${new Date(objetivo.fecha).toLocaleDateString()}</td>
                <td>${parseFloat(objetivo.ahorro_diario).toFixed(2)}</td>
                <td>${objetivo.dias_necesarios}</td>
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
