const { ipcRenderer } = require('electron');

ipcRenderer.on('deudaimp-data', async (event, deudaJSON) => {
    try {
        const deuda = JSON.parse(deudaJSON);

        WebViewer({
            path: '../../node_modules/@pdftron/webviewer/public',
            fullAPI: true,
            enableRedaction: false
        }, document.getElementById('viewer')).then(async instance => {
            const { documentViewer, PDFNet } = instance.Core;

            await PDFNet.initialize();

            // Crear y configurar el documento PDF
            const doc = await createPDFDocument(PDFNet, deuda);
            const docbuf = await doc.saveMemoryBuffer(PDFNet.SDFDoc.SaveOptions.e_linearized);

            await documentViewer.loadDocument(docbuf);

            // Intentar imprimir el documento utilizando diferentes métodos
            if (documentViewer.print) {
                documentViewer.print();
            } else if (instance.print) {
                instance.print();
            } else if (instance.Core.print) {
                instance.Core.print();
            } else if (instance.Core.documentViewer.print) {
                instance.Core.documentViewer.print();
            } else if (instance.Core.documentViewer.docViewer && instance.Core.documentViewer.docViewer.print) {
                instance.Core.documentViewer.docViewer.print();
            } else {
                console.error('Método de impresión no encontrado');
            }

        }).catch(error => {
            console.error('Error al inicializar WebViewer:', error);
        });
    } catch (error) {
        console.error('Error al procesar los datos de la deuda:', error);
    }
});

async function createPDFDocument(PDFNet, deuda) {
    const doc = await PDFNet.PDFDoc.create();
    const page = await doc.pageCreate();
    doc.pagePushBack(page);

    const builder = await PDFNet.ElementBuilder.create();
    const writer = await PDFNet.ElementWriter.create();
    writer.beginOnPage(page);

    const font = await PDFNet.Font.create(doc, PDFNet.Font.StandardType1Font.e_helvetica);
    const fontSize = 12;

    // Crear un elemento de texto
    const createTextElement = async (text, x, y) => {
        const matrix = await PDFNet.Matrix2D.create(1, 0, 0, 1, x, y);
        const element = await builder.createTextBegin(font, fontSize);
        element.setTextMatrix(matrix);
        writer.writeElement(element);
        writer.writeElement(await builder.createTextRun(text, font, fontSize));
        writer.writeElement(await builder.createTextEnd());
    };

    // Añadir los elementos de texto al documento
    await createTextElement('Detalles de la Deuda', 50, 700);
    await createTextElement(`ID: ${deuda.id_deuda}`, 50, 680);
    await createTextElement(`Monto: ${deuda.monto}`, 50, 660);
    await createTextElement(`Fecha de Registro: ${deuda.fecha_registro}`, 50, 640);
    await createTextElement(`Fecha de Registro: ${deuda.fecha_vencimiento}`, 50, 620);
    await createTextElement(`Fecha de Registro: ${deuda.descripcion}`, 50, 600);


    //monto, fecha_registro, fecha_vencimiento, descripcion
    writer.end();

    return doc;
}
