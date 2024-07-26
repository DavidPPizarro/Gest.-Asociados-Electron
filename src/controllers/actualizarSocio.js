const { ipcRenderer } = require('electron');

const updateForm = document.getElementById('updateForm');
const idSocio = document.getElementById('idSocio');
const nombres = document.getElementById('nombres');
const apellidos = document.getElementById('apellidos');
const dni = document.getElementById('dni');
const localidad = document.getElementById('localidad');
const idModulo = document.getElementById('id_modulo');
const escritura = document.getElementById('ruta_escritura');
const comprobante = document.getElementById('ruta_comprobante_inscr');

let escrituraActual = '';
let comprobanteActual = '';

function updatePDFIcon(iconId, hasFile) {
    const icon = document.getElementById(iconId);
    if (hasFile) {
        icon.style.color = '#e74c3c';
        icon.title = 'PDF existente';
    } else {
        icon.style.color = '#bdc3c7';
        icon.title = 'No hay PDF';
    }
}

ipcRenderer.on('socio-data', (event, socio) => {
    idSocio.value = socio.id_socio;
    nombres.value = socio.nombres;
    apellidos.value = socio.apellidos;
    dni.value = socio.dni;
    localidad.value = socio.id_localidad;
    idModulo.value = socio.id_modulo;
    
    escrituraActual = socio.ruta_escritura;
    comprobanteActual = socio.ruta_comprobante_inscr;
    
    updatePDFIcon('escritura_icon', !!escrituraActual);
    updatePDFIcon('comprobante_icon', !!comprobanteActual);
});

updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (escritura.files[0]) {
        formData.append('pdfEscritura', escritura.files[0]);
    }
    if (comprobante.files[0]) {
        formData.append('pdfComprobante', comprobante.files[0]);
    }

    try {
        let result = { escrituraPath: escrituraActual, comprobantePath: comprobanteActual };
        
        if (formData.has('pdfEscritura') || formData.has('pdfComprobante')) {
            const response = await fetch('http://localhost:3000/guardar-pdf', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            result = await response.json();
            console.log('Respuesta del servidor (PDFs):', result);
        }

        const updatedSocio = {
            id_socio: idSocio.value,
            nombres: nombres.value,
            apellidos: apellidos.value,
            dni: dni.value,
            id_localidad: localidad.value,
            id_modulo: idModulo.value,
            ruta_escritura: result.escrituraPath || escrituraActual,
            ruta_comprobante_inscr: result.comprobantePath || comprobanteActual
        };

        const responseMain = await ipcRenderer.invoke('update-socio', updatedSocio);
        console.log('Respuesta del proceso principal:', responseMain);

        alert('Socio y documentos actualizados correctamente');

        updatePDFIcon('escritura_icon', !!updatedSocio.ruta_escritura);
        updatePDFIcon('comprobante_icon', !!updatedSocio.ruta_comprobante_inscr);

    } catch (error) {
        console.error('Error al actualizar el socio:', error);
        alert('Error al actualizar el socio y/o PDFs');
    }
});

document.getElementById('botonCerrar').addEventListener('click', () => {
    ipcRenderer.send('close-actualizar-window');
});

// Actualizar los iconos cuando se selecciona un nuevo archivo
escritura.addEventListener('change', (event) => {
    updatePDFIcon('escritura_icon', event.target.files.length > 0);
});

comprobante.addEventListener('change', (event) => {
    updatePDFIcon('comprobante_icon', event.target.files.length > 0);
});