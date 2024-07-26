const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();

app.use(express.json());
// Configuración de multer para almacenar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads')) // Los archivos se guardarán en una carpeta 'uploads' en la raíz del proyecto
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now(); //guardar archivo
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/guardar-pdf', upload.fields([
    { name: 'pdfEscritura', maxCount: 1 },
    { name: 'pdfComprobante', maxCount: 1 }
]), (req, res) => {
    if (req.files['pdfEscritura'] && req.files['pdfComprobante']) {
        const escrituraPath = req.files['pdfEscritura'][0].path;
        const comprobantePath = req.files['pdfComprobante'][0].path;
        
        //console.log('Escritura guardada en:', escrituraPath);
        //console.log('Comprobante guardado en:', comprobantePath);
        
        res.json({ 
            message: 'PDFs guardados con éxito',
            escrituraPath,
            comprobantePath
        });
    } else {
        res.status(400).json({ error: 'No se recibieron todos los archivos necesarios' });
    }
});

app.post('/guardar-comprobante', upload.single('comprobantePago'), (req, res) => {
    if (req.file) {
        const comprobantePath = req.file.path;
        res.json({ 
            message: 'Comprobante guardado con éxito',
            comprobantePath
        });
    } else {
        res.status(400).json({ error: 'No se recibió el archivo de comprobante' });
    }
});



// Nueva ruta para eliminar un PDF
app.post('/eliminar-pdf', async (req, res) => {
    console.log('Recibida solicitud para eliminar PDF:', req.body);
    if (req.body && req.body.path) {
        // Elimina la duplicación de la ruta base
        const filePath = req.body.path;
        console.log('Intentando eliminar archivo:', filePath);
        try {
            await fs.access(filePath, fs.constants.F_OK);
            await fs.unlink(filePath);
            console.log('Archivo eliminado con éxito:', filePath);
            res.json({ message: 'PDF eliminado con éxito' });
        } catch (error) {
            console.error('Error al eliminar PDF:', error);
            if (error.code === 'ENOENT') {
                res.status(404).json({ error: 'El archivo no existe' });
            } else {
                res.status(500).json({ error: 'Error al eliminar el PDF: ' + error.message });
            }
        }
    } else {
        console.error('No se recibió la ruta del archivo en la solicitud');
        res.status(400).json({ error: 'No se recibió la ruta del archivo' });
    }
});

module.exports = app;