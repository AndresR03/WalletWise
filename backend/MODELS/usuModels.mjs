
function validarUsuario(data) {
    if (!data.nombre_completo || !data.correo_electronico || !data.password) {
        return { valid: false, message: 'Todos los campos son obligatorios.' };
    }
    if (data.password !== data.confirmar_password) {
        return { valid: false, message: 'Las contraseñas no coinciden.' };
    }
    return { valid: true };
}

export { validarUsuario };
