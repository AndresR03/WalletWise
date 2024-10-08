function validarUsuario(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el formato del correo
    const minPasswordLength = 8; // Longitud mínima de la contraseña

    // Validar campos obligatorios
    if (!data.nombre_completo || !data.correo_electronico || !data.password || !data.confirmar_password) {
        return { valid: false, message: 'Todos los campos son obligatorios.' };
    }

    // Validar el formato del correo electrónico
    if (!emailRegex.test(data.correo_electronico)) {
        return { valid: false, message: 'El formato del correo electrónico no es válido.' };
    }

    // Validar la longitud de la contraseña
    if (data.password.length < minPasswordLength) {
        return { valid: false, message: `La contraseña debe tener al menos ${minPasswordLength} caracteres.` };
    }

    // Validar que las contraseñas coincidan
    if (data.password !== data.confirmar_password) {
        return { valid: false, message: 'Las contraseñas no coinciden.' };
    }

    // Validar que se hayan aceptado los términos y condiciones
    if (!data.aceptar_terminos) {
        return { valid: false, message: 'Debes aceptar los términos y condiciones.' };
    }

    // Si todo está correcto
    return { valid: true };
}

export { validarUsuario };
