const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

// Función para obtener los socios desde el proceso principal
const getSocio = async () => {
    try {
        return await ipcRenderer.invoke('get-socio');
    } catch (error) {
        console.error('Error al obtener socios:', error);
        throw error;
    }
};

// Función para cargar los socios en la tabla
async function cargarSocios() {
    try {
        const socios = await getSocio();
        const sociosBody = document.getElementById('sociosBody');
        
        sociosBody.innerHTML = '';
        
        socios.forEach(socio => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${socio.id_socio}</td>
                <td>${socio.nombres}</td>
                <td>${socio.apellidos}</td>
                <td>${socio.dni}</td>
                <td>${getLocalidad(socio.id_localidad)}</td>
                <td>${socio.id_modulo}</td>
                <td>${crearEnlacePDF(socio.ruta_escritura, 'Ver Escritura')}</td>
                <td>${crearEnlacePDF(socio.ruta_comprobante_inscr, 'Ver Comprobante')}</td>
                <td>
                    <button onclick="actualizarSocio(${socio.id_socio})">Actualizar</button>
                    <button onclick="eliminarSocio(${socio.id_socio})">Eliminar</button>
                </td>
            `;
            sociosBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar socios:', error);
        alert('Error al cargar los socios. Por favor, inténtelo de nuevo.');
    }
}

function getLocalidad(idLocalidad) {
    let localidad = '';

    switch(idLocalidad) {
        case 1:
            localidad = "Casa Blanca";
            break;
        case 2:
            localidad = "Sacsamarca";
            break;
        case 3:
            localidad = "Tarmatambo";
            break;
        case 4:
            localidad = "Palca";
            break;
        default:
            localidad = "ID no válido"; // Opcional: mensaje para IDs no válidos
    }

    return localidad;
}

function crearEnlacePDF(ruta, texto) {
    if (ruta) {
        const rutaCodificada = encodeURIComponent(ruta);
        return `<a href="#" onclick="abrirPDFElectron('${rutaCodificada}')">${texto}</a>`;
    } else {
        return 'No disponible';
    }
}

async function abrirPDFElectron(rutaCodificada) {
    try {
        await ipcRenderer.invoke('abrir-pdf-electron', decodeURIComponent(rutaCodificada));
    } catch (error) {
        console.error('Error al abrir PDF con Electron:', error);
        alert('Error al abrir el PDF. Por favor, inténtelo de nuevo.');
    }
}

// Función para buscar socios
function buscarSocio() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#sociosBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}




/*
// Función para eliminar un socio
async function eliminarSocio(codigo, e) {
    e.preventDefault();
    if (confirm('¿Está seguro de que desea eliminar este socio?')) {
        try {
            const responseMain = await ipcRenderer.invoke('delete-Socio', codigo);
            console.log('Socio eliminado:', responseMain);
            await cargarSocios();
        } catch (error) {
            console.error('Error al eliminar socio:', error);
            alert('Error al eliminar el socio. Por favor, inténtelo de nuevo.');
        }
    }
}
*/
// Función para eliminar un socio y sus archivos PDF asociados
async function eliminarSocio(idSocio) {
    if (confirm('¿Está seguro de que desea eliminar este socio?')) {
        try {
            // Primero, obtener la información del socio
            const socio = await ipcRenderer.invoke('get-socio-by-id', idSocio);
            console.log('Socio a eliminar:', socio);
            // Eliminar el socio de la base de datos
            const responseMain = await ipcRenderer.invoke('delete-Socio', idSocio);
            console.log('Respuesta del proceso principal:', responseMain);
            // Eliminar los archivos PDF asociados
            if (socio.ruta_escritura) {
                await eliminarArchivoPDF(socio.ruta_escritura);
            }
            if (socio.ruta_comprobante_inscr) {
                await eliminarArchivoPDF(socio.ruta_comprobante_inscr);
            }

            

            alert('Socio y archivos asociados eliminados correctamente');

            // Recargar la lista de socios (asumiendo que tienes una función para esto)
            await cargarSocios();

        } catch (error) {
            console.error('Error al eliminar el socio:', error);
            alert('Error al eliminar el socio y sus archivos asociados');
        }
    }
}

async function eliminarArchivoPDF(ruta) {
    try {
        const response = await fetch('http://localhost:3000/eliminar-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path: ruta })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

    } catch (error) {
        console.error('Error al eliminar el archivo PDF:', error);
        throw error; // Re-lanzar el error para manejarlo en la función principal
    }
}

// Función para abrir la ventana de actualización con los datos del socio
async function actualizarSocio(idSocio) {
    try {
        const socio = await ipcRenderer.invoke('get-socio-by-id', idSocio);
        ipcRenderer.send('open-actualizar-window', socio);
    } catch (error) {
        console.error('Error al obtener socio por ID:', error);
        alert('Error al obtener los datos del socio. Por favor, inténtelo de nuevo.');
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    cargarSocios();
    
    // Añadir event listener para el botón de búsqueda
    const searchButton = document.querySelector('.search-bar button');
    if (searchButton) {
        searchButton.addEventListener('click', buscarSocio);
    }
});

// Exponer funciones al ámbito global para que puedan ser llamadas desde el HTML
window.buscarSocio = buscarSocio;
window.eliminarSocio = eliminarSocio;
window.actualizarSocio = actualizarSocio;
window.abrirPDFElectron = abrirPDFElectron;