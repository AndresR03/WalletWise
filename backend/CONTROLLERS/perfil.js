document.addEventListener('DOMContentLoaded', function() {
    // Obtener el nombre completo del localStorage
    const nombreCompleto = localStorage.getItem('nombre_completo');
    const storedImageUrl = localStorage.getItem('profileImageUrl'); // Obtener la URL de la imagen desde el localStorage

    if (nombreCompleto) {
        // Actualizar el texto del perfil con el nombre del usuario
        const nombreElemento = document.querySelector('.info p');
        if (nombreElemento) {
            nombreElemento.innerHTML = `<strong>Nombre:</strong> ${nombreCompleto}`;
        }
    } else {
        // Si no se encuentra el nombre en localStorage, redirigir a la página de inicio de sesión
        window.location.href = 'login.html';
    }

    // Cargar la imagen guardada si existe
    const imgElement = document.getElementById('profilePicture');
    if (storedImageUrl && imgElement) {
        imgElement.src = storedImageUrl; // Establecer la imagen guardada desde el localStorage
    }

    // Verificar que el input de la imagen existe
    const profileImageInput = document.getElementById('profileImage');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    if (imgElement) {
                        imgElement.src = event.target.result; // Actualiza la imagen en la página
                    } else {
                        console.error('No se encontró el elemento de la imagen.');
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        // Evento para subir la imagen al servidor
        profileImageInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('profileImage', file);

                try {
                    const response = await fetch('http://localhost:3000/upload-profile-picture', {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();

                    if (response.ok) {
                        if (imgElement) {
                            const serverImageUrl = `http://localhost:3000${data.imageUrl}`;
                            imgElement.src = serverImageUrl; 
                            localStorage.setItem('profileImageUrl', serverImageUrl); 
                            alert('Foto de perfil actualizada correctamente');
                        }
                    } else {
                        alert(data.message || 'Error al subir la imagen');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Hubo un error en el servidor. Inténtalo más tarde.');
                }
            }
        });
    }

    // Evento para cerrar sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Limpiar localStorage y redirigir al login
            localStorage.clear();
            window.location.href = 'login.html';  
        });
    }
    // Obtener el salario del localStorage y mostrarlo en el perfil
    const salarioElemento = document.querySelector('.salary-section p'); 
    const salario = localStorage.getItem('salario'); 

    if (salarioElemento && salario) {
        salarioElemento.innerHTML = `<strong>Salario:</strong> ${salario}`;
    }


    // Verificar que el botón de regresar existe antes de añadir el evento
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'home.html';  
        });
    }
});
