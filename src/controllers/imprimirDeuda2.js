const { ipcRenderer } = require('electron');
const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function readImageToBase64(imagePath) {
    try {
        const imageData = fs.readFileSync(imagePath);
        return 'data:image/jpeg;base64,' + imageData.toString('base64');
    } catch (error) {
        console.log('Error al leer la imagen:', error);
        return null;
    }
}

ipcRenderer.on('deudaimp-data', (event, deudaJSON) => {
    const deuda = JSON.parse(deudaJSON);
    const doc = new jsPDF('landscape');

    // Colores
    const azulOscuro = [0, 32, 96];
    const azulClaro = [79, 129, 189];
    const gris = [128, 128, 128];
    const naranja = [255, 192, 0];
    const rojo = [192, 0, 0];
    const verde = [0, 176, 80];

    // Fondo
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

    // Encabezado
    doc.setFillColor(...azulOscuro);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Deuda', doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });

    // Imagen
    const imagePath = path.join(__dirname, '../images/18915856.jpg');
    const imageData = readImageToBase64(imagePath);
    if (imageData) {
        doc.addImage(imageData, 'JPG', 220, 50, 60, 60);
    }

    // Detalles de la deuda
    doc.setFontSize(22);
    doc.setTextColor(...azulClaro);
    doc.text('Detalles de la Deuda', 20, 60);

    doc.setFontSize(14);
    doc.setTextColor(...gris);
    const detalles = [
        [`ID:`, `${deuda.id_deuda}`],
        [`Monto:`, `S/. ${deuda.monto}`],
        [`Fecha de Registro:`, `${formatDate(deuda.fecha_registro)}`],
        //[`Fecha de Vencimiento:`, `${formatDate(deuda.fecha_vencimiento)}`],
        [`Descripción:`, `${deuda.descripcion}`]
    ];

    detalles.forEach((detalle, index) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...azulOscuro);
        doc.text(detalle[0], 20, 75 + (index * 12));
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...gris);
        doc.text(detalle[1], 70, 75 + (index * 12));
    });

    // Barra de estado
    doc.setFillColor(...naranja);
    doc.rect(20, 140, doc.internal.pageSize.getWidth() - 40, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('FECHA LÍMITE:'+formatDate(deuda.fecha_vencimiento), doc.internal.pageSize.getWidth() / 2, 153, { align: 'center' });

    // Mensajes adicionales
    doc.setFontSize(14);
    doc.setTextColor(...rojo);
    doc.setFont('helvetica', 'italic');
    doc.text('Por favor, asegúrese de que la deuda se paga antes de la fecha de vencimiento.', 20, 180);
    doc.setTextColor(...verde);
    doc.text('Gracias por su atención y puntualidad en los pagos.', 20, 195);

    // Pie de página
    doc.setFillColor(...azulClaro);
    doc.rect(0, doc.internal.pageSize.getHeight() - 20, doc.internal.pageSize.getWidth(), 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Este documento es un informe oficial de deuda. Para más información, contacte con nuestro departamento financiero.', 
             doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Generar y mostrar el PDF
    const pdfOutput = doc.output('datauristring');
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.src = pdfOutput;
    document.body.innerHTML = '';
    document.body.appendChild(iframe);
});