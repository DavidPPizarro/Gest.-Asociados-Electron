const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    cargarRoles();
    listarUsuarios();

    document.getElementById('formularioUsuario').addEventListener('submit', registrarUsuario);
});

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

function generarOpcionesRol(rolActual) {
    let options = '';
    roles.forEach(rol => {
        options += `<option value="${rol.id_rol}" ${rol.id_rol == rolActual ? 'selected' : ''}>${rol.nombre_rol}</option>`;
    });
    return options;
}

async function registrarUsuario(event) {
    event.preventDefault();
    const usuario = {
        nombre: document.getElementById('nombres').value,
        apellido: document.getElementById('apellidos').value,
        mail: document.getElementById('correo').value,
        password: document.getElementById('contrasena').value,
        dni: document.getElementById('dni').value,
        id_rol: document.getElementById('rol').value
    };

    try {
        await ipcRenderer.invoke('create-usuario', usuario);
        listarUsuarios();
        event.target.reset();
    } catch (error) {
        console.error('Error al registrar usuario:', error);
    }
}

async function listarUsuarios() {
    try {
        const usuarios = await ipcRenderer.invoke('get-usuarios');
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';
        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.id_user}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.mail}</td>
                <td>${usuario.password}</td>
                <td>${usuario.dni}</td>
                <td>${roles.find(rol => rol.id_rol == usuario.id_rol)?.nombre_rol || ''}</td>
                <td>
                    <button onclick="confirmarEliminarUsuario(${usuario.id_user}, '${usuario.nombre}')">Eliminar</button>
                    <button onclick="abrirVentanaActualizacion(${usuario.id_user})">Actualizar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al listar usuarios:', error);
    }
}


async function abrirVentanaActualizacion(idUsuario) {
    
    try{
        const usuario = await ipcRenderer.invoke('get-user-by-id',idUsuario);
        console.log("DEP1:"+usuario);
        ipcRenderer.send('open-actualizarUser-window', usuario);
    }catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        alert('Error al obtener los datos del usuario. Por favor, inténtelo de nuevo.');
    }
}


function confirmarEliminarUsuario(id, nombre) {
    if (confirm(`¿Está seguro que desea eliminar al usuario con ID ${id} y nombre ${nombre}?`)) {
        eliminarUsuario(id);
    }
}

async function eliminarUsuario(id) {
    try {
        await ipcRenderer.invoke('delete-usuario', id);
        alert('Usuario eliminado exitosamente');
        listarUsuarios();
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario');
    }
}


async function eliminarUsuario(id) {
    try {
        await ipcRenderer.invoke('delete-usuario', id);
        listarUsuarios();
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
}


async function actualizarUsuario(id, button) {
    const row = button.closest('tr');
    const usuario = {
        id_user: id,
        nombre: row.cells[1].textContent,
        apellido: row.cells[2].textContent,
        mail: row.cells[3].textContent,
        password: row.cells[4].textContent,
        dni: row.cells[5].textContent,
        id_rol: row.querySelector('.rol-select').value
    };

    if (confirm(`¿Está seguro que desea actualizar los datos del usuario con ID ${id}?`)) {
        try {
            await ipcRenderer.invoke('update-usuario', usuario);
            alert('Usuario actualizado exitosamente');
            listarUsuarios();
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            alert('Error al actualizar usuario');
        }
    }
}

ipcRenderer.on('usuario-actualizado', (event, id) => {
    console.log(`Usuario con ID ${id} actualizado correctamente`);
    listarUsuarios();
});

ipcRenderer.on('actualizar-user-completado', () => {
    listarUsuarios();
});