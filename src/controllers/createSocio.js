const formSocio = document.getElementById('formSocio');
//  equivalente del remote
const { ipcRenderer } = require('electron');

const sociodni = document.getElementById('dni');
const socionombres = document.getElementById('nombres');
const socioapellidos = document.getElementById('apellidos');
const sociolocalidad= document.getElementById('localidad'); // Corregido de 'apellidos' a 'direccion'
const socioescritura = document.getElementById('escritura');
const sociocomprobante = document.getElementById('comprobante');


formSocio.addEventListener('submit', async (e) => {
    e.preventDefault(); // Cancelar comportamiento por defecto de refresco de la página

    const formData = new FormData();

    // Agregar datos del formulario
    //formData.append('dni', sociodni.value);
    //formData.append('nombres', socionombres.value);
    //formData.append('apellidos', socioapellidos.value);
    //formData.append('direccion', sociodireccion.value);

    // Agregar archivos PDF
    if (socioescritura.files[0]) {
        formData.append('pdfEscritura', socioescritura.files[0]);
    }
    if (sociocomprobante.files[0]) {
        formData.append('pdfComprobante', sociocomprobante.files[0]);
    }

    try {
        const response = await fetch('http://localhost:3000/guardar-pdf', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        const lastIdModulo = await ipcRenderer.invoke('get-LastModuloId');

        const newSocio = {
            nombres: socionombres.value,
            apellidos: socioapellidos.value,
            dni: sociodni.value,
            id_localidad: sociolocalidad.value, // Asegúrate de obtener el valor correcto de la localidad
            id_modulo: lastIdModulo, // Asegúrate de obtener el valor correcto del módulo
            ruta_escritura: result.escrituraPath,
            ruta_comprobante_inscr: result.comprobantePath
        };


        
///
        // ipcRenderer.invoke('invoke-createSocio')
        // .then(response => {
        //     console.log('Response from main process:', response);
        // })
        // .catch(error => {
        //     console.error('Error invoking hello:', error);
        // });

        const responseMain = await ipcRenderer.invoke('create-socio', newSocio);
        console.log('Respuesta del proceso principal:', responseMain);
        ////

        alert('Datos y PDFs guardados con éxito, el módulo asignado al socio es:'+lastIdModulo);

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Error al guardar los datos y PDFs');
    }
});


//BOTON CANCELAR
function regresar() {
    // Redirigir a home.html
    window.location.href = "home.html";
}


// const getSocio = async() =>{
//     const responseMain = await ipcRenderer.invoke('get-socio');
//     console.log(responseMain);
// }
// //llamo a la función
// getSocio();