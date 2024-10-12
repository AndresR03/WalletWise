import { validarUsuario } from './MODELS/usuModels.mjs'; // Asegúrate de que el nombre del archivo sea correcto
import pkg from 'pg'; // Importación del módulo pg
const { Pool } = pkg; // Desestructuración para obtener la clase Pool
import bcrypt from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Importar dotenv para cargar variables de entorno

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Middleware para parsear JSON

// Configurar PostgreSQL con variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Ruta para registrar usuario
app.post('/register', async (req, res) => {
    const { 
        nombre_completo, 
        correo_electronico, 
        numero_telefono, 
        password, 
        confirmar_password, 
        aceptar_terminos 
    } = req.body; 

    console.log('Datos de registro recibidos:', req.body);

    // Validar los datos del usuario
    const validation = validarUsuario(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await pool.query(
            'SELECT * FROM usuarios WHERE correo_electronico = $1 OR numero_telefono = $2',
            [correo_electronico, numero_telefono]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Ya existe un usuario registrado con este correo electrónico o número de teléfono' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO usuarios (nombre_completo, correo_electronico, numero_telefono, password, aceptar_terminos) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre_completo, correo_electronico, numero_telefono, hashedPassword, aceptar_terminos] // Incluir aceptar_terminos en el arreglo de valores
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { correo_electronico, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE correo_electronico = $1', [correo_electronico]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso', user: { id: user.id, nombre: user.nombre_completo } }); // Puedes incluir más datos del usuario aquí
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para guardar información financiera
app.post('/guardar-informacion-financiera', async (req, res) => {
    const { usuario_email, salario, comida, ropa, transporte, otras_categorias } = req.body;

    try {
        // Verificar si ya existe un registro para el correo electrónico del usuario
        const existingRecord = await pool.query(
            'SELECT * FROM informacion_financiera WHERE usuario_email = $1',
            [usuario_email]
        );

        if (existingRecord.rows.length > 0) {
            // Si ya existe, puedes actualizar el registro existente
            const result = await pool.query(
                'UPDATE informacion_financiera SET salario = $1, comida = $2, ropa = $3, transporte = $4, otras_categorias = $5 WHERE usuario_email = $6 RETURNING *',
                [salario, comida, ropa, transporte, JSON.stringify(otras_categorias), usuario_email]
            );
            return res.status(200).json({ message: 'Información financiera actualizada exitosamente', data: result.rows[0] });
        }

        // Si no existe, insertar un nuevo registro
        const result = await pool.query(
            'INSERT INTO informacion_financiera (usuario_email, salario, comida, ropa, transporte, otras_categorias) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [usuario_email, salario, comida, ropa, transporte, JSON.stringify(otras_categorias)]
        );

        res.status(201).json({ message: 'Información financiera guardada exitosamente', data: result.rows[0] });
    } catch (error) {
        // Manejar error de duplicado
        if (error.code === '23505') { // Código de error de violación de unicidad
            return res.status(400).json({ message: 'Ya existe un registro de información financiera para este usuario.' });
        }

        console.error('Error al guardar información financiera:', error);
        res.status(500).json({ error: 'Error al guardar información financiera' });
    }
});



app.get('/informacion-financiera/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT comida, ropa, transporte, otra_categoria_1, otra_categoria_2, otra_categoria_3 FROM informacion_financiera WHERE usuario_id = $1',
            [usuario_id]
        );

        if (result.rows.length > 0) {
            const { comida, ropa, transporte, otra_categoria_1, otra_categoria_2, otra_categoria_3 } = result.rows[0];
            res.status(200).json({ comida, ropa, transporte, otra_categoria_1, otra_categoria_2, otra_categoria_3 });
        } else {
            res.status(404).json({ message: 'No se encontró información financiera para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener información financiera:', error);
        res.status(500).json({ error: 'Error al obtener información financiera' });
    }
});



// Iniciar servidor en puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
