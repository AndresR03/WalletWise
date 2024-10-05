
// Función para validar el registro de un nuevo usuario
function validarUsuario(data) {
    // Validaciones simples (puedes expandir esto según tus necesidades)
    if (!data.nombre_completo || !data.correo_electronico || !data.password) {
        return { valid: false, message: 'Todos los campos son obligatorios.' };
    }
    if (data.password !== data.confirmar_password) {
        return { valid: false, message: 'Las contraseñas no coinciden.' };
    }
    // Agrega más validaciones según tus requisitos
    return { valid: true };
}

export { validarUsuario };
