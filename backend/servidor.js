const express = require('express');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors()); // Habilitar CORS

// Configurar PostgreSQL
const pool = new pg.Pool({
    user: 'postgres', // Cambia por tu usuario de PostgreSQL
    host: 'localhost', // Cambia a '192.168.1.26' si necesitas
    database: 'app_usuarios', // Cambia por tu nombre de base de datos
    password: 'Wallet123', // Cambia por tu contraseña de PostgreSQL
    port: 5432,
});

// Middleware para parsear JSON
app.use(express.json());

// Ruta para registrar usuario
app.post('/register', async (req, res) => {
    const { nombre_completo, correo_electronico, numero_telefono, password, confirmar_password } = req.body;

    console.log('Datos de registro recibidos:', req.body);

    // Validar que las contraseñas coincidan
    if (password !== confirmar_password) {
        console.log('Las contraseñas no coinciden');
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre_completo, correo_electronico, numero_telefono, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre_completo, correo_electronico, numero_telefono, hashedPassword]
        );
        console.log('Usuario registrado exitosamente:', result.rows[0]); 
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
        console.log('Intento de inicio de sesión con correo:', correo_electronico);

        const result = await pool.query('SELECT * FROM usuarios WHERE correo_electronico = $1', [correo_electronico]);
        const user = result.rows[0];

        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Contraseña incorrecta');
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token (opcional)
        const token = jwt.sign({ userId: user.id }, 'secreto', { expiresIn: '1h' });
        console.log('Inicio de sesión exitoso para el usuario:', correo_electronico);

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Iniciar servidor en puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
