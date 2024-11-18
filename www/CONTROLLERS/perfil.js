document.addEventListener('DOMContentLoaded', function () {
    const nombreCompleto = localStorage.getItem('nombre_completo');
    const storedImageUrl = localStorage.getItem('profileImageUrl');

    if (nombreCompleto) {
        const nombreElemento = document.querySelector('.info p');
        if (nombreElemento) {
            nombreElemento.innerHTML = `<strong>Nombre:</strong> ${nombreCompleto}`;
        }
    } else {
        window.location.href = 'login.html';
    }

    const imgElement = document.getElementById('profilePicture');
    if (storedImageUrl && imgElement) {
        imgElement.src = storedImageUrl;
    }

    const profileImageInput = document.getElementById('profileImage');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    if (imgElement) {
                        imgElement.src = event.target.result;
                    } else {
                        console.error('No se encontró el elemento de la imagen.');
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        profileImageInput.addEventListener('change', async function (e) {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('profileImage', file);

                try {
                    const response = await fetch('https://walletwise-backend-p4gd.onrender.com/upload-profile-picture', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        alert(errorData.message || 'Error al subir la imagen');
                        return;
                    }

                    const data = await response.json();
                    if (imgElement) {
                        const serverImageUrl = `https://walletwise-backend-p4gd.onrender.com${data.imageUrl}`;
                        imgElement.src = serverImageUrl;
                        localStorage.setItem('profileImageUrl', serverImageUrl);
                        alert('Foto de perfil actualizada correctamente');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Hubo un error en el servidor. Inténtalo más tarde.');
                }
            }
        });
    }

    // Cerrar sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Solo eliminar datos relacionados con la sesión
            localStorage.removeItem('user_id'); // Elimina solo el ID del usuario
            localStorage.removeItem('nombre_completo'); // Opcional, si quieres limpiar el nombre también

            // Foto de perfil y salario permanecerán intactos en localStorage
            window.location.href = 'login.html'; // Redirige a la página de inicio de sesión
        });
    }

    // Obtener el salario del localStorage y mostrarlo en el perfil
    const salarioElemento = document.querySelector('.salary-section p'); // Asegúrate de que este selector apunte al elemento correcto
    const salario = localStorage.getItem('salario'); // Recuperar el salario del localStorage

    if (salarioElemento && salario) {
        salarioElemento.innerHTML = `<strong>Salario:</strong> ${salario}`;
    }

    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function () {
            window.location.href = 'home.html'; // Redirige a la página home.html
        });
    }
});
