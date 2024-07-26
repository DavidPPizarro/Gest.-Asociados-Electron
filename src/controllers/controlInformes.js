const { ipcRenderer } = require('electron');

let datosInforme = [];
let paginaActual = 1;
const filasPorPagina = 10;


async function generarInforme() {
    const tipoInforme = document.getElementById('tipoInforme').value;
    const informeContainer = document.getElementById('informeContainer');
    
    informeContainer.innerHTML = '<p>Generando informe...</p>';
    
    try {
        let datos;
        switch (tipoInforme) {
            case 'socios':
                datos = await ipcRenderer.invoke('get-socio');
                mostrarInformeSocios(datos);
                break;
            case 'deudas':
                datos = await ipcRenderer.invoke('get-deudas');
                mostrarInformeDeudas(datos);
                break;
            case 'sociosDeudas':
                datos = await ipcRenderer.invoke('get-socios-deudas');
                mostrarInformeSociosDeudas(datos);
                break;
            case 'sociosCompleto':
                datos = await ipcRenderer.invoke('get-socios-completo');
                mostrarInformeSociosCompleto(datos);
                break;
            default:
                informeContainer.innerHTML = '<p>Por favor, seleccione un tipo de informe.</p>';
                return;
        }
    } catch (error) {
        console.error('Error al generar informe:', error);
        informeContainer.innerHTML = '<p>Error al generar el informe. Por favor, intente de nuevo.</p>';
    }
}

// Función auxiliar para formatear fechas
function formatearFecha(fecha) {
    if (!fecha) return '';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

function mostrarInformeSocios(socios) {
    const informeContainer = document.getElementById('informeContainer');
    let html = '<h2>Informe de Socios</h2><table><tr><th>ID</th><th>Nombres</th><th>Apellidos</th><th>DNI</th><th>Localidad</th><th>Módulo</th></tr>';
    
    socios.forEach(socio => {
        html += `<tr>
            <td>${socio.id_socio}</td>
            <td>${socio.nombres}</td>
            <td>${socio.apellidos}</td>
            <td>${socio.dni}</td>
            <td>${getLocalidad(socio.id_localidad)}</td>
            <td>${socio.id_modulo}</td>
        </tr>`;
    });
    
    html += '</table>';
    // html += '<button onclick="exportarAPDF()">Exportar a PDF</button>';
    informeContainer.innerHTML = html;
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


function mostrarInformeDeudas(deudas) {
    const informeContainer = document.getElementById('informeContainer');
    let html = '<h2>Informe de Deudas</h2><table><tr><th>ID</th><th>Fecha Registro</th><th>Fecha Vencimiento</th><th>Descripción</th><th>Monto</th></tr>';
    
    deudas.forEach(deuda => {
        html += `<tr>
            <td>${deuda.id_deuda}</td>
            <td>${formatearFecha(deuda.fecha_registro)}</td>
            <td>${formatearFecha(deuda.fecha_vencimiento)}</td>
            <td>${deuda.descripcion}</td>
            <td>${deuda.monto}</td>
        </tr>`;
    });
    
    html += '</table>';
    // html += '<button onclick="exportarAPDF()">Exportar a PDF</button>';
    informeContainer.innerHTML = html;
}

function mostrarInformeSociosDeudas(sociosDeudas) {
    const informeContainer = document.getElementById('informeContainer');
    let html = '<h2>Informe de Socios y Deudas</h2><table><tr><th>Socio ID</th><th>Nombres</th><th>Apellidos</th><th>Deuda ID</th><th>Monto</th><th>Fecha Vencimiento</th><th>Estado</th></tr>';
    
    sociosDeudas.forEach(item => {
        html += `<tr>
            <td>${item.id_socio}</td>
            <td>${item.nombres}</td>
            <td>${item.apellidos}</td>
            <td>${item.id_deuda}</td>
            <td>${item.monto}</td>
            <td>${formatearFecha(item.fecha_vencimiento)}</td>
            <td>${item.estado}</td>
        </tr>`;
    });
    
    html += '</table>';
    // html += '<button onclick="exportarAPDF()">Exportar a PDF</button>';
    informeContainer.innerHTML = html;
}

function mostrarInformeSociosCompleto(sociosCompleto) {
    const informeContainer = document.getElementById('informeContainer');
    let html = '<h2>Informe Completo de Socios</h2><table><tr><th>ID</th><th>Nombres</th><th>Apellidos</th><th>DNI</th><th>Localidad</th><th>Módulo</th><th>Deuda Total</th></tr>';
    
    sociosCompleto.forEach(socio => {
        html += `<tr>
            <td>${socio.id_socio}</td>
            <td>${socio.nombres}</td>
            <td>${socio.apellidos}</td>
            <td>${socio.dni}</td>
            <td>${socio.nombre_local}</td>
            <td>${socio.nombre_modulo}</td>
            <td>${socio.deuda_total || 0}</td>
        </tr>`;
    });
    
    html += '</table>';
    // html += '<button onclick="exportarAPDF()">Exportar a PDF</button>';
    informeContainer.innerHTML = html;
}

async function exportarAPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const informeContainer = document.getElementById('informeContainer');
    const canvas = await html2canvas(informeContainer);
    const imgData = canvas.toDataURL('image/png');
    
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    doc.save('informe.pdf');
}