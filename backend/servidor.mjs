import { validarUsuario } from './MODELS/usuModels.mjs';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import multer from 'multer'; 
import path from 'path';
import fs from 'fs';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const app = express();
app.use(cors()); 
app.use(express.json()); 

// Middleware para configurar los encabezados CORS
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.sendStatus(200);
});

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

});

// Verificar la conexión a la base de datos
pool.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
    } else {
        console.log('Conexión a la base de datos exitosa.');
    }
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

    // Validación de campos
    if (!nombre_completo || !correo_electronico || !numero_telefono || !password || !confirmar_password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Validación con la función personalizada
    const validation = validarUsuario(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        // Comprobar si el usuario ya existe
        const existingUser = await pool.query(
            'SELECT * FROM usuarios WHERE correo_electronico = $1 OR numero_telefono = $2',
            [correo_electronico, numero_telefono]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Ya existe un usuario registrado con este correo electrónico o número de teléfono' });
        }

        if (password !== confirmar_password) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el usuario en la base de datos
        const result = await pool.query(
            'INSERT INTO usuarios (nombre_completo, correo_electronico, numero_telefono, password, aceptar_terminos) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre_completo, correo_electronico, numero_telefono, hashedPassword, aceptar_terminos]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { correo_electronico, password } = req.body;

    // Validar que los campos sean enviados
    if (!correo_electronico || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    try {
        // Buscar al usuario en la base de datos
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE correo_electronico = $1',
            [correo_electronico]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const user = result.rows[0];

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Devolver los datos del usuario
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            usuario: {
                id: user.id,
                nombre_completo: user.nombre_completo,
                correo_electronico: user.correo_electronico,
            },
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});




// Ruta para guardar información financiera
app.post('/guardar-informacion-financiera', async (req, res) => {
    const { usuario_id, salario, comida, ropa, transporte, categorias_personalizadas } = req.body;

    try {
        const categoriasJson = categorias_personalizadas ? JSON.stringify(categorias_personalizadas) : null;

        // Verificar si ya existe información para el usuario
        const existingData = await pool.query(
            'SELECT * FROM informacion_financiera WHERE usuario_id = $1',
            [usuario_id]
        );

        if (existingData.rows.length > 0) {
            // Actualizar la información existente
            await pool.query(
                `UPDATE informacion_financiera 
                 SET salario = $2, comida = $3, ropa = $4, transporte = $5, categorias_personalizadas = $6 
                 WHERE usuario_id = $1`,
                [usuario_id, salario, comida, ropa, transporte, categoriasJson]
            );
            res.json({ message: 'Información actualizada exitosamente' });
        } else {
            // Insertar nueva información
            await pool.query(
                `INSERT INTO informacion_financiera 
                    (usuario_id, salario, comida, ropa, transporte, categorias_personalizadas) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [usuario_id, salario, comida, ropa, transporte, categoriasJson]
            );
            res.json({ message: 'Información guardada exitosamente' });
        }
    } catch (error) {
        console.error('Error al guardar datos:', error.message);
        res.status(500).json({ error: 'Error interno.' });
    }
});





// Ruta para obtener información financiera completa
app.get('/informacion-financiera-completa/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;

    console.log(`Iniciando solicitud para usuario_id: ${usuario_id}`);

    try {
        const result = await pool.query(
            'SELECT salario, comida, ropa, transporte FROM informacion_financiera WHERE usuario_id = $1',
            [usuario_id]
        );

        console.log('Resultado de la consulta:', result.rows);

        if (result.rows.length > 0) {
            const { salario, comida, ropa, transporte } = result.rows[0];
            console.log(`Datos encontrados: salario=${salario}, comida=${comida}, ropa=${ropa}, transporte=${transporte}`);
            res.status(200).json({
                salario,
                gastoComida: comida * 7,
                gastoRopa: ropa * 7,
                gastoTransporte: transporte * 7,
            });
        } else {
            console.warn(`No se encontraron datos para usuario_id: ${usuario_id}`);
            res.status(404).json({ message: 'No se encontró información financiera para este usuario.' });
        }
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Nueva ruta para obtener solo el salario
// Mantener el endpoint existente para obtener el salario
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

// Nuevo endpoint para guardar un objetivo
app.post('/guardar-objetivo', async (req, res) => {
    const { usuarioId, nombre, precioObjetivo, fecha, ahorroDiario, diasNecesarios } = req.body;

    if (!usuarioId || !nombre || !precioObjetivo || !fecha || !ahorroDiario || !diasNecesarios) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        await pool.query(
            'INSERT INTO objetivos (usuario_id, nombre, precio_objetivo, fecha, ahorro_diario, dias_necesarios) VALUES ($1, $2, $3, $4, $5, $6)',
            [usuarioId, nombre, precioObjetivo, fecha, ahorroDiario, diasNecesarios]
        );
        res.status(200).json({ message: 'Objetivo guardado exitosamente' });
    } catch (error) {
        console.error('Error al guardar el objetivo:', error);
        res.status(500).json({ error: 'Error al guardar el objetivo' });
    }
});

// Endpoint para obtener todos los objetivos de un usuario
app.get('/objetivos/:usuarioId', async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        if (isNaN(usuarioId)) {
            return res.status(400).json({ message: 'El ID de usuario no es válido.' });
        }

        const objetivos = await db.query(
            'SELECT * FROM objetivos WHERE usuario_id = $1',
            [usuarioId]
        );

        if (objetivos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron objetivos para este usuario.' });
        }

        res.status(200).json(objetivos.rows);
    } catch (error) {
        console.error('Error al obtener los objetivos:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


// Endpoint para eliminar un objetivo
app.delete('/objetivos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM objetivos WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Objetivo no encontrado.' });
        }

        res.status(200).json({ message: 'Objetivo eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el objetivo:', error);
        res.status(500).json({ message: 'Error al eliminar el objetivo.' });
    }
});




// Ruta para obtener información financiera solo para el gráfico de pastel
app.get('/informacion-financiera/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    console.log('ID del usuario recibido:', usuario_id);

    try {
        const result = await pool.query(
            'SELECT comida, ropa, transporte, categorias_personalizadas FROM informacion_financiera WHERE usuario_id = $1',
            [usuario_id]
        );

        console.log('Resultado de la consulta:', result.rows);

        if (result.rows.length > 0) {
            const { comida, ropa, transporte, categorias_personalizadas } = result.rows[0];

            // Si categorias_personalizadas es un array de objetos, convertirlo a JSON
            let categoriasPersonalizadasJSON = [];
            if (Array.isArray(categorias_personalizadas)) {
                categoriasPersonalizadasJSON = categorias_personalizadas.map(item => {
                    return {
                        nombre: item.nombre,
                        valor: item.valor
                    };
                });
            }

            res.status(200).json({ comida, ropa, transporte, categorias_personalizadas: categoriasPersonalizadasJSON });
        } else {
            res.status(404).json({ message: 'No se encontró información financiera para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener información financiera:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
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