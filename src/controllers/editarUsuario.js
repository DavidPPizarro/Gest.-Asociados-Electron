const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    cargarRoles();
    document.getElementById('formularioEditarUsuario').addEventListener('submit', actualizarUsuario);
    document.getElementById('cancelar').addEventListener('click', cerrarVentana);
});

let roles = [];

async function cargarRoles() {
    roles = await ipcRenderer.invoke('get-roles');
    const selectRol = document.getElementById('rol');
    selectRol.innerHTML = '<option value="">Seleccionar</option>';
    roles.forEach(rol => {
        const option = document.createElement('option');
        option.value = rol.id_rol;
        option.textContent = rol.nombre_rol;
        selectRol.appendChild(option);
    });
}

ipcRenderer.on('user-data2', (event, usuario) => {
    console.log("DEP3:"+usuario);
    document.getElementById('id_user').value = usuario.id_user;
    document.getElementById('nombres').value = usuario.nombre;
    document.getElementById('apellidos').value = usuario.apellido;
    document.getElementById('correo').value = usuario.mail;
    document.getElementById('contrasena').value = usuario.password;
    document.getElementById('dni').value = usuario.dni;
    document.getElementById('rol').value = usuario.id_rol;
});

async function actualizarUsuario(event) {
    event.preventDefault();
    const usuario = {
        id_user: document.getElementById('id_user').value,
        nombre: document.getElementById('nombres').value,
        apellido: document.getElementById('apellidos').value,
        mail: document.getElementById('correo').value,
        password: document.getElementById('contrasena').value,
        dni: document.getElementById('dni').value,
        id_rol: document.getElementById('rol').value
    };

    if (confirm('¿Está seguro que desea actualizar los datos del usuario?')) {
        try {
            await ipcRenderer.invoke('update-usuario', usuario);
            alert('Usuario actualizado exitosamente');
            cerrarVentana();
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            alert('Error al actualizar usuario');
        }
    }
}

function cerrarVentana() {
    ipcRenderer.send('close-actualizarUser-window');
    ipcRenderer.send('actualizar-user-completado');
}