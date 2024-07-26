const {socioWindow} = require('./main.js')
const { createLoginWindow, createMainWindow, createActualizarWindow } = require('./main.js');


//const path = require('path');
const server = require('./server');
const {app, BrowserWindow, ipcMain} = require('electron');
// if (process.env.NODE_ENV === 'development') {
//     require('electron-reload')(__dirname);
// }

require('./database/database.js');
app.allowRendererProcessReuse = false;
//cuando se haya creado todo, que se muestre la ventana

let loginWindow, mainWindow, updateSocio;


app.whenReady().then(() => {    
    loginWindow = createLoginWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createLoginWindow();
    }
});


server.listen(3000, () => {
    console.log('Servidor Express corriendo en el puerto 3000');
});


// IPC para abrir la ventana principal desde login.js
ipcMain.on('open-main-window', (event, userData) => {
    //createMainWindow();
    mainWindow = createMainWindow();
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('user-data', userData);
    })
    if (loginWindow) {
        loginWindow.close();
        loginWindow = null;
    }
});

ipcMain.on('load-login', () => {
    try {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.close();
            mainWindow = null;
        }
        if (!loginWindow || loginWindow.isDestroyed()) {
            loginWindow = createLoginWindow();
        } else {
            loginWindow.focus();
        }
    } catch (error) {
        console.error('Error al cargar la ventana de login:', error);
    }
});





// Manejador de IPC para abrir ventanas
ipcMain.on('open-window', (event, windowName) => {
    switch(windowName) {
        case 'socioWindow':
            socioWindow();
            break;
        case 'controlSocio':
            // Implementa esta función en main.js si no existe
            // createControlSocioWindow();
            break;
        case 'registroDeuda':
            // Implementa esta función en main.js si no existe
            // createRegistroDeudaWindow();
            break;
        case 'consultarDatos':
            // Implementa esta función en main.js si no existe
            // createConsultarDatosWindow();
            break;
        default:
            console.log(`Ventana no reconocida: ${windowName}`);
    }
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('Excepción no capturada:', error);
    // Puedes agregar aquí lógica adicional, como mostrar un diálogo de error
});