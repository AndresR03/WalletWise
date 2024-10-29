import { validarUsuario } from './MODELS/usuModels.mjs';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import multer from 'multer'; 
import path from 'path';
import fs from 'fs';

dotenv.config(); 

const app = express();
app.use(cors()); 
app.use(express.json()); 


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

        // Verificar si las contraseñas coinciden
        if (password !== confirmar_password) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO usuarios (nombre_completo, correo_electronico, numero_telefono, password, aceptar_terminos) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre_completo, correo_electronico, numero_telefono, hashedPassword, aceptar_terminos]
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

        // Respuesta con el nombre completo
        res.status(200).json({ message: 'Inicio de sesión exitoso', nombre_completo: user.nombre_completo });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para guardar información financiera
app.post('/guardar-informacion-financiera', async (req, res) => {
    const { usuario_id, salario, comida, ropa, transporte, otraCategoria1, otraCategoria2, otraCategoria3 } = req.body;

    try {
        // Verificar si ya existe un registro para el id del usuario
        const existingRecord = await pool.query(
            'SELECT * FROM informacion_financiera WHERE usuario_id = $1',
            [usuario_id]
        );

        if (existingRecord.rows.length > 0) {
            // Si ya existe, actualizar el registro existente
            const result = await pool.query(
                'UPDATE informacion_financiera SET salario = $1, comida = $2, ropa = $3, transporte = $4, otra_categoria_1 = $5, otra_categoria_2 = $6, otra_categoria_3 = $7 WHERE usuario_id = $8 RETURNING *',
                [salario, comida, ropa, transporte, otraCategoria1, otraCategoria2, otraCategoria3, usuario_id]
            );
            return res.status(200).json({ message: 'Información financiera actualizada exitosamente', data: result.rows[0] });
        }

        // Si no existe, insertar un nuevo registro
        const result = await pool.query(
            'INSERT INTO informacion_financiera (usuario_id, salario, comida, ropa, transporte, otra_categoria_1, otra_categoria_2, otra_categoria_3) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [usuario_id, salario, comida, ropa, transporte, otraCategoria1, otraCategoria2, otraCategoria3]
        );

        res.status(201).json({ message: 'Información financiera guardada exitosamente', data: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') { // Código de error de violación de unicidad
            return res.status(400).json({ message: 'Ya existe un registro de información financiera para este usuario.' });
        }

        console.error('Error al guardar información financiera:', error);
        res.status(500).json({ error: 'Error al guardar información financiera' });
    }
});

// Ruta para obtener información financiera completa
app.get('/informacion-financiera-completa/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const result = await pool.query(
            'SELECT salario, comida, ropa, transporte, otra_categoria_1, otra_categoria_2, otra_categoria_3 FROM informacion_financiera WHERE usuario_id = $1',
            [usuario_id]
        );

        if (result.rows.length > 0) {
            const { salario, comida, ropa, transporte, otra_categoria_1, otra_categoria_2, otra_categoria_3 } = result.rows[0];

            // Calcular los gastos para 7 días
            const gastos = {
                gastoComida: comida * 7,
                gastoRopa: ropa * 7,
                gastoTransporte: transporte * 7,
                gastoOtraCategoria1: otra_categoria_1 * 7,
                gastoOtraCategoria2: otra_categoria_2 * 7,
                gastoOtraCategoria3: otra_categoria_3 * 7
            };

            res.status(200).json({
                salario,
                ...gastos
            });
        } else {
            res.status(404).json({ message: 'No se encontró información financiera para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener información financiera completa:', error);
        res.status(500).json({ error: 'Error al obtener información financiera completa' });
    }
});

// Nueva ruta para obtener solo el salario
app.get('/informacion-financiera-salario2/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const result = await pool.query(
            'SELECT salario FROM informacion_financiera WHERE usuario_id = $1',
            [usuario_id]
        );

        if (result.rows.length > 0) {
            const { salario } = result.rows[0];
            res.status(200).json({ salario });
        } else {
            res.status(404).json({ message: 'No se encontró información financiera para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener salario:', error);
        res.status(500).json({ error: 'Error al obtener salario' });
    }
});
// Ruta para obtener información financiera solo para el gráfico de pastel
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
app.get('/porcentajes-gasto/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const result = await pool.query(
            'SELECT salario, comida, ropa, transporte FROM informacion_financiera WHERE usuario_id = $1',
            [usuario_id]
        );

        if (result.rows.length > 0) {
            const { salario, comida, ropa, transporte } = result.rows[0];

            const porcentajes = {
                porcentajeComida: ((comida / salario) * 100).toFixed(2),
                porcentajeRopa: ((ropa / salario) * 100).toFixed(2),
                porcentajeTransporte: ((transporte / salario) * 100).toFixed(2),
                porcentajeOtros: ((comida + ropa + transporte) / salario) * 100
            };

            res.status(200).json(porcentajes);
        } else {
            res.status(404).json({ message: 'No se encontró información financiera para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener porcentajes de gasto:', error);
        res.status(500).json({ error: 'Error al obtener porcentajes de gasto' });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directorio donde se almacenarán las imágenes
    },
    filename: function (req, file, cb) {
        // Renombrar el archivo para evitar conflictos de nombres
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Ruta para subir la imagen de perfil
app.post('/upload-profile-picture', upload.single('profileImage'), (req, res) => {
    try {
        // El archivo está disponible en req.file
        const imageUrl = `/uploads/${req.file.filename}`; // URL de la imagen
        res.status(200).json({ message: 'Imagen subida correctamente', imageUrl });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
});

// Manejar la ruta para mostrar la imagen subida
app.use('/uploads', express.static('uploads')); // Hacer público el directorio de uploads

// Manejar el error 404 si la imagen no se encuentra
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        }

        res.sendFile(filePath);
    });
});

// Iniciar servidor en puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));