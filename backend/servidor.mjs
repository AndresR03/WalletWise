import { validarUsuario } from './MODELS/usuModles.mjs';
import pkg from 'pg'; // Importación del módulo pg
const { Pool } = pkg; // Desestructuración para obtener la clase Pool
import bcrypt from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Importar dotenv para cargar variables de entorno

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
app.use(cors()); // Habilitar CORS

// Configurar PostgreSQL con variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware para parsear JSON
app.use(express.json());

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

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
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

        // Generar un token JWT (si decides implementar autenticación JWT)
        // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // res.status(200).json({ message: 'Inicio de sesión exitoso', token });

        res.status(200).json({ message: 'Inicio de sesión exitoso' }); // Cambiar esto si decides implementar JWT
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para guardar información financiera
app.post('/guardar-informacion-financiera', async (req, res) => {
    const { usuario_id, salario, comida, ropa, transporte, otras_categorias } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO informacion_financiera (usuario_id, salario, comida, ropa, transporte, otras_categorias) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [usuario_id, salario, comida, ropa, transporte, JSON.stringify(otras_categorias)]
        );
        res.status(201).json({ message: 'Información financiera guardada exitosamente', data: result.rows[0] });
    } catch (error) {
        console.error('Error al guardar información financiera:', error);
        res.status(500).json({ error: 'Error al guardar información financiera' });
    }
});

// Iniciar servidor en puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
