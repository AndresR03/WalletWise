require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors()); // Habilitar CORS

// Configurar PostgreSQL con variables de entorno
const pool = new pg.Pool({
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
    const { nombre_completo, correo_electronico, numero_telefono, password, confirmar_password } = req.body;

    console.log('Datos de registro recibidos:', req.body);

    if (password !== confirmar_password) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre_completo, correo_electronico, numero_telefono, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre_completo, correo_electronico, numero_telefono, hashedPassword]
        );
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: result.rows[0] });
    } catch (error) {
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

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Iniciar servidor en puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
