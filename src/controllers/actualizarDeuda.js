const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
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

document.getElementById('botonCancelar').addEventListener('click', cerrarVentana);

function cerrarVentana() {
    ipcRenderer.send('close-actualizar-window');
}

ipcRenderer.on('deuda-data', (event, deuda) => {
    console.log(deuda.id_deuda);
    document.getElementById('idDeuda').value = deuda.id_deuda;
    document.getElementById('monto').value = deuda.monto;
    
    if (deuda.fecha_vencimiento) {
        const fecha = new Date(deuda.fecha_vencimiento);
        const fechaFormateada = fecha.toISOString().split('T')[0];
        const fechaVencimientoInput = document.getElementById('fechaVencimiento');
        fechaVencimientoInput.value = fechaFormateada;
        
        // Asegurarse de que la fecha de vencimiento no sea anterior a hoy
        const hoy = new Date().toISOString().split('T')[0];
        if (fechaFormateada < hoy) {
            fechaVencimientoInput.value = hoy;
        }
    }
    
    document.getElementById('descripcion').value = deuda.descripcion;                        
});

const updateForm = document.getElementById('updateFormDeuda');
updateForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const deuda = {
        id_deuda: document.getElementById('idDeuda').value,
        monto: document.getElementById('monto').value,
        fecha_vencimiento: document.getElementById('fechaVencimiento').value,
        descripcion: document.getElementById('descripcion').value
    };

    if (!deuda.fecha_vencimiento) {
        alert('Por favor, seleccione una fecha de vencimiento válida.');
        return;
    }

    try {
        //LLAMADAAAAAAAAAAA
        const result = await ipcRenderer.invoke('actualizar-deuda', deuda);
        console.log('Concepto de Deuda actualizada:', result);
        alert('Concepto actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar concepto:', error);
        alert('Error al actualizar el concepto. Por favor, inténtelo de nuevo.');
    }
});

document.getElementById('botonCancelar').addEventListener('click', () => {
    ipcRenderer.send('close-actualizarDeuda-window');
    ipcRenderer.send('actualizar-deuda-completado');
});