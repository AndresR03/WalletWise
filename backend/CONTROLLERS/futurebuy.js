<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compras Futuras</title>
  <link rel="stylesheet" href="./css/futurebuy.css">
</head>
<body>
  <div class="container">
    <a href="home.html" class="back">Volver</a>
    <h1>Compras Futuras</h1>
    
    <form id="formulario">
      <label for="precio">Precio objetivo</label>
      <input type="number" id="precio" name="precio" placeholder="Ingresa el precio">
      
      <label for="fecha">Fecha</label>
      <input type="date" id="fecha" name="fecha">
      
      <button type="button" id="calcular">CALCULAR</button>
    </form>

    <div id="resultados">
      <table>
        <thead>
          <tr>
            <th>Día</th>
            <th>Ahorro diario</th>
            <th>Acumulado</th>
          </tr>
        </thead>
        <tbody id="tabla-resultado">
          <!-- Aquí se llenarán los resultados -->
        </tbody>
      </table>
    </div>
  </div>

  <script src="../backend/CONTROLLERS/futurebuy.js"></script>
</body>
</html>
<script>
  async function obtenerSalario() {
    const usuarioId = 1

    try {
      const response = await fetch(`http://localhost:3000/informacion-financiera-salario2/${usuarioId}`);
      const data = await response.json();
      const salario = data.salario;

      if (!salario || isNaN(salario)) {
        alert('No se pudo obtener el salario. Inténtalo más tarde.');
        return;
      }

      // Usa el salario para hacer tus cálculos
      console.log('Salario del usuario:', salario);
    } catch (error) {
      console.error('Error al obtener el salario:', error);
      alert('Error al obtener el salario. Inténtalo más tarde.');
    }
  }

  obtenerSalario();
</script>