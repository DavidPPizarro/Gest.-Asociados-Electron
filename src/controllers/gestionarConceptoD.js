const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    listarDeudas();
    document.getElementById('deudaForm').addEventListener('submit', registrarDeuda);
    const fechaVencimientoInput = document.getElementById('fechaVencimiento');
    const hoy = new Date().toISOString().split('T')[0];
    fechaVencimientoInput.min = hoy;

    fechaVencimientoInput.addEventListener('change', validarFecha);
});


function validarFecha(event) {
    const fechaSeleccionada = new Date(event.target.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
        alert('No se puede seleccionar una fecha anterior a hoy.');
        event.target.value = '';
    }
}

async function registrarDeuda(event) {
    event.preventDefault();
    const deuda = {
        monto: document.getElementById('monto').value,
        // fecha_registro: document.getElementById('fechaRegistro').value,
        fecha_vencimiento: document.getElementById('fechaVencimiento').value,
        descripcion: document.getElementById('descripcion').value
    };

    try {
        const nuevaIdDeuda = await ipcRenderer.invoke('registrar-deuda', deuda);
        limpiarFormulario();
        listarDeudas();
        mostrarAlertaExito(nuevaIdDeuda);
    } catch (error) {
        console.error('Error al registrar deuda:', error);
    }
}

function mostrarAlertaExito(nuevaIdDeuda) {
    const alertOverlay = document.createElement('div');
    alertOverlay.className = 'alert-overlay';
    alertOverlay.innerHTML = `
        <div class="alert-box">
            <h3>¡Registro exitoso!</h3>
            <p>La deuda se ha registrado correctamente.</p>
            <button onclick="cerrarAlerta()">Cerrar</button>
            <button onclick="imprimirDeuda(${nuevaIdDeuda})">Imprimir Deuda</button>
        </div>
    `;
    document.body.appendChild(alertOverlay);
}

function cerrarAlerta() {
    document.querySelector('.alert-overlay').remove();
}

function imprimirDeuda(iddeuda) {
    cerrarAlerta(); // Cierra la alerta antes de imprimir
    try {
        ipcRenderer.invoke('get-deuda-by-id', iddeuda).then((deuda) => {
            console.log('Deuda obtenida:', deuda);
            ipcRenderer.send('open-imprimirDeuda-window', deuda);
        }).catch((error) => {
            console.error('Error al obtener deuda por ID:', error);
            alert('Error al obtener los datos de la deuda. Por favor, inténtelo de nuevo.');
        });
    } catch (error) {
        console.error('Error al imprimir deuda:', error);
        alert('Error al intentar imprimir la deuda. Por favor, inténtelo de nuevo.');
    }
}


// function actualizarSocio(idSocio, e) {
//     e.preventDefault();
//     console.log('SOCIOOOO:'+idSocio)
//     try {
//         ipcRenderer.invoke('get-socio-by-id', idSocio).then((socio) => {
//             // Aquí puedes realizar acciones con el socio obtenido, por ejemplo:
//             console.log('Socio obtenido:', socio);
//             // Luego puedes enviar estos datos a la página de actualización
//             ipcRenderer.send('open-actualizar-window', socio);
//         }).catch((error) => {
//             console.error('Error al obtener socio por ID:', error);
//             alert('Error al obtener los datos del socio. Por favor, inténtelo de nuevo.');
//         });
//     } catch (error) {
//         console.error('Error al actualizar socio:', error);
//         alert('Error al intentar actualizar el socio. Por favor, inténtelo de nuevo.');
//     }
// }




function salir() {
    ipcRenderer.send('volver-home');
}

async function listarDeudas() {
    try {
        const deudas = await ipcRenderer.invoke('get-deudas');
        const tbody = document.querySelector('#deudasTable tbody');
        tbody.innerHTML = '';

        //console.log("DEUDAAAAAAAAA:"+deuda.id_deuda);
        deudas.forEach(deuda => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${deuda.id_deuda}</td>
                <td>${new Date(deuda.fecha_registro).toLocaleDateString()}</td>
                <td>${new Date(deuda.fecha_vencimiento).toLocaleDateString()}</td>
                <td>${deuda.descripcion}</td>
                <td>${deuda.monto}</td>
                <td>
                    <button class="action-button delete-button" onclick="eliminarDeuda(${deuda.id_deuda})">Eliminar</button>
                    <button class="action-button update-button" onclick="actualizarDeuda(${deuda.id_deuda}, event)">Actualizar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al listar deudas:', error);
    }
}

function limpiarFormulario() {
    document.getElementById('deudaForm').reset();
}

async function eliminarDeuda(idDeuda) {
    if (confirm('¿Está seguro de eliminar esta deuda?')) {
        try {
            await ipcRenderer.invoke('eliminar-deuda', idDeuda);
            listarDeudas();
        } catch (error) {
            console.error('Error al eliminar deuda:', error);
        }
    }
}

// Función para abrir la ventana de actualización con los datos de la deuda
function actualizarDeuda(idDeuda, e) {
    e.preventDefault();
    console.log('DEUDA:'+idDeuda)
    try {
        ipcRenderer.invoke('get-deuda-by-id', idDeuda).then((deuda) => {
            // Aquí puedes realizar acciones con el socio obtenido, por ejemplo:
            console.log('Deuda obtenida:', deuda);
            // Luego puedes enviar estos datos a la página de actualización
            ipcRenderer.send('open-actualizarDeuda-window', deuda);
        }).catch((error) => {
            console.error('Error al obtener deuda por ID:', error);
            alert('Error al obtener los datos del socio. Por favor, inténtelo de nuevo.');
        });
    } catch (error) {
        console.error('Error al actualizar deuda:', error);
        alert('Error al intentar actualizar la deuda. Por favor, inténtelo de nuevo.');
    }
}

ipcRenderer.on('actualizar-deuda-completado', () => {
    listarDeudas();
});