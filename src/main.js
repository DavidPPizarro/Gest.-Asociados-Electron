const {BrowserWindow, ipcMain, Notification, shell} = require('electron');//BrowserWindow es una funcion
const { getConnection } = require('./database/database');
const path = require('path');
const nodemailer = require('nodemailer');

const url = require('url');

const { exec } = require('child_process');

async function getSocio(){
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM SOCIO');
    //console.log(results);
    return results
}

ipcMain.handle('get-socio', () => {
    return getSocio();    
});

/////
async function getLastModuloId() {
    let conn;
    try {
        conn = await getConnection();
        const query = `
            SELECT id_modulo, nombre_modulo, estado 
            FROM modulo 
            WHERE estado = "No Ocupado" 
            ORDER BY id_modulo ASC 
            LIMIT 1
        `;
        
        const [rows] = await conn.query(query);
        
        console.log('RETORNO: '+rows.id_modulo)
        return rows.id_modulo;
    } catch (error) {
        console.log('Error al obtener el último módulo disponible:', error);
        throw error;
    } 
}

ipcMain.handle('get-LastModuloId', () => {
    return getLastModuloId();    
});


async function deleteSocio(id_socio) {
    try {
      const conn = await getConnection();
      const [result] = await conn.query('DELETE FROM socio WHERE id_socio = ?', [id_socio]);
      conn.release();
      return result;
    } catch (error) {
      //console.error('Error deleting socio 1:', error);
      throw error;
    }
  }

ipcMain.handle('delete-Socio', async (event, id) => {
    if (typeof id !== 'number' || id <= 0) {
        return { success: false, error: 'Invalid id' };
    }

    try {
        const result = await deleteSocio(id);
        // Emitir un evento a todas las ventanas del proceso renderer
        event.sender.send('socio-deleted', id);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

async function createSocio(socio) {
    try {
        const conn = await getConnection();  

        const sqlInsert = "INSERT INTO SOCIO (nombres, apellidos, dni, id_localidad, id_modulo, ruta_escritura, ruta_comprobante_inscr) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
            socio.nombres,
            socio.apellidos,
            socio.dni,
            socio.id_localidad,
            socio.id_modulo,
            socio.ruta_escritura,
            socio.ruta_comprobante_inscr
        ];

        const result = await conn.query(sqlInsert, values);  

        // Crea la notificación
        new Notification({
             title: 'Electron MYSQL',
             body: 'Nuevo Socio registrado Correctamente'
         }).show();

        // Guarda el ID del socio
        socio.id = result.insertId;

        // Actualiza el estado del módulo a "Ocupado"
        const sqlUpdate = "UPDATE modulo SET estado = 'Ocupado' WHERE id_modulo = ?";
        await conn.query(sqlUpdate, [socio.id_modulo]);

        return socio;
    } catch (error) {
        console.log(error);
    }
}


ipcMain.handle('create-socio', (event, socio) => {
    return createSocio(socio);    
});

async function updateSocio(socio) {
    try {
        const conn = await getConnection();
        const sql = "UPDATE SOCIO SET nombres = ?, apellidos = ?, dni = ?, id_localidad = ?, id_modulo = ?, ruta_escritura = ?, ruta_comprobante_inscr = ? WHERE id_socio = ?";
        const values = [
            socio.nombres,
            socio.apellidos,
            socio.dni,
            socio.id_localidad,
            socio.id_modulo,
            socio.ruta_escritura,
            socio.ruta_comprobante_inscr,
            socio.id_socio
        ];
        const result = await conn.query(sql, values);
        return result;
    } catch (error) {
        console.log('Error al actualizar socio:', error);
        throw error;
    }
}

ipcMain.handle('update-socio', (event, socio) => {
    return updateSocio(socio);
});

ipcMain.handle('get-socio-by-id', async (event, idSocio) => {
    let conn;
    try {
        conn = await getConnection();
        const query = 'SELECT * FROM SOCIO WHERE id_socio = ?';
        const [rows] = await conn.query(query, [idSocio]);

        console.log('SOCIOOOOOOOOOOOO:'+rows.nombres);
        if (rows.length === 0) {
            throw new Error(`No se encontró socio con ID ${idSocio}`);
        }
        return rows; // Devolver el primer socio encontrado (suponiendo que el ID es único)
    } catch (error) {
        console.log('Error al obtener socio por ID:', error);
        throw error;
    } 
});

ipcMain.handle('get-user-by-id', async (event, idUser) => {
    let conn;
    try {
        conn = await getConnection();
        const query = 'SELECT * FROM usuario WHERE id_user = ?';
        const [rows] = await conn.query(query, [idUser]);

        console.log('Usuarioooo:'+rows.nombre);
        if (rows.length === 0) {
            throw new Error(`No se encontró socio con ID ${idUser}`);
        }
        return rows; // Devolver el primer socio encontrado (suponiendo que el ID es único)
    } catch (error) {
        console.log('Error al obtener socio por ID:', error);
        throw error;
    } 
});

ipcMain.handle('get-deuda-by-id', async (event, idDeuda) => {
    let conn;
    try {
        conn = await getConnection();
        const query = 'SELECT * FROM deuda WHERE id_deuda = ?';
        const [rows] = await conn.query(query, [idDeuda]);

        console.log('DEUDAAAAAA:'+rows.id_deuda);
        if (rows.length === 0) {
            throw new Error(`No se encontró deuda con ID ${idDeuda}`);
        }
        return rows; 
    } catch (error) {
        console.error('Error al obtener deuda por ID:', error);
        throw error;
    } 
});

// Autenticación de usuarios
async function authenticate(credentials) {
    const conn = await getConnection();
    const sql = "SELECT * FROM usuario WHERE mail = ? AND password = ?";
    const values = [credentials.mail, credentials.password];
    const results = await conn.query(sql, values);
    return results.length > 0; // Devuelve true si se encuentra el usuario, de lo contrario false
    //return results;
}

// ipcMain.handle('login', async (event, credentials) => {
//     try {
//         const success = await authenticate(credentials);
//         return success;
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// });

async function getUserData(mail) {
    const conn = await getConnection();
    const sql = "SELECT id_user, nombre, apellido, mail, id_rol FROM usuario WHERE mail = ?";
    const [results] = await conn.query(sql, [mail]);
    return results
}

ipcMain.handle('login', async (event, credentials) => {
    try {
        const success = await authenticate(credentials);
        if (success) {
            const userData = await getUserData(credentials.mail);

            return { success: true, userData };
        } else {
            return { success: false, userData: null };
        }
    } catch (error) {
        console.error(error);
        return { success: false, userData: null };
    }
});

// Manejar evento 'actualizar-socio' desde el proceso de renderizado
let acwindow = null; // Variable para almacenar la referencia de la ventana de actualización

////

function createActualizarWindow() {
    acwindow = new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar:true,
    });

    acwindow.loadFile(path.join(__dirname, 'ui', 'actualizarSocio.html'));

    acwindow.on('closed', () => {
        console.log('Ventana de actualización cerrada');
        acwindow = null;
    });

    return acwindow; // Devolver la ventana creada
}

let acWindowUser = null;

function createActualizarUserWindow() {
    acWindowUser = new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar:true,
    });

    acWindowUser.loadFile(path.join(__dirname, 'ui', 'editarUsuario.html'));
    // acWindowUser
    acWindowUser.on('closed', () => {
        console.log('Ventana de actualización cerrada');
        acWindowUser = null;
    });

    return acWindowUser; // Devolver la ventana creada
}

ipcMain.on('close-actualizarUser-window', () => {
    if (acWindowUser) {
        acWindowUser.close();
    }
});

//PARA ACTUALIZAR LA VENTANA
ipcMain.on('actualizar-user-completado', () => {
    mainWindow.webContents.send('actualizar-user-completado');
});

let acWindowDeuda = null;

function createActualizarDeudaWindow() {
    acWindowDeuda = new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    autoHideMenuBar: true
    });

    acWindowDeuda.loadFile(path.join(__dirname, 'ui', 'actualizarDeuda.html'));
    //acWindowDeuda
    acWindowDeuda.on('closed', () => {
        console.log('Ventana de actualización cerrada');
        acWindowDeuda = null;
    });

    return acWindowDeuda; // Devolver la ventana creada
}

function formatearFecha(fecha) {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth() + 1; // Los meses en JavaScript son de 0 a 11, por lo que hay que sumar 1
    const dia = fecha.getDate();
  
    // Completar con ceros a la izquierda si es necesario
    const añoStr = String(año).padStart(4, '0');
    const mesStr = String(mes).padStart(2, '0');
    const diaStr = String(dia).padStart(2, '0');
  
    return `${añoStr}-${mesStr}-${diaStr}`;
}

async function createUsuario(usuario) {
    try {
        const conn = await getConnection();
        const fechaRegistro = new Date();
        const fechaFormateada = formatearFecha(fechaRegistro);
        const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const sql = "INSERT INTO usuario (nombre, apellido, mail, password, fecha_registro, dni, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
            usuario.nombre,
            usuario.apellido,
            usuario.mail,
            usuario.password,
            fechaFormateada,
            usuario.dni,
            usuario.id_rol
        ];
        console.log("FECHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:"+fechaFormateada);
        const result = await conn.query(sql, values);
        
        new Notification({
            title: 'Gestión de Usuarios',
            body: 'Nuevo Usuario registrado correctamente'
        }).show();

        usuario.id = result.insertId;
        return usuario;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getUsuarios() {
    const conn = await getConnection();
    const results = await conn.query('SELECT u.*, r.nombre_rol FROM usuario u JOIN rol r ON u.id_rol = r.id_rol  order by id_user');
    return results;
}

async function getRoles() {
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM rol');
    return results;
}

async function deleteUsuario(id_usuario) {
    try {
        const conn = await getConnection();
        const result = await conn.query('DELETE FROM usuario WHERE id_user = ?', [id_usuario]);
        return result;
    } catch (error) {
        console.error('Error deleting usuario:', error);
        throw error;
    }
}


ipcMain.handle('get-usuarios', () => {
    return getUsuarios();
});

ipcMain.handle('create-usuario', (event, usuario) => {
    return createUsuario(usuario);
});

ipcMain.handle('get-roles', () => {
    return getRoles();
});

ipcMain.handle('delete-usuario', async (event, id) => {
    if (typeof id !== 'number' || id <= 0) {
        return { success: false, error: 'Invalid id' };
    }

    try {
        const result = await deleteUsuario(id);
        event.sender.send('usuario-deleted', id);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

async function updateUsuario(usuario) {
    try {
        const conn = await getConnection();
        const sql = "UPDATE usuario SET nombre = ?, apellido = ?, mail = ?, password = ?, dni = ?, id_rol = ? WHERE id_user = ?";
        const values = [
            usuario.nombre,
            usuario.apellido,
            usuario.mail,
            usuario.password,
            usuario.dni,
            usuario.id_rol,
            usuario.id_user
        ];
        const result = await conn.query(sql, values);
        return result;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
}

ipcMain.handle('update-usuario', async (event, usuario) => {
    try {
        const result = await updateUsuario(usuario);
        event.sender.send('usuario-actualizado', usuario.id_user);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.on('open-actualizar-window', (event, socio) => {
     // Crear la ventana de actualización con datos del socio
    createActualizarWindow(socio);
    // Enviar datos del socio a la ventana de actualización
    acwindow.webContents.on('did-finish-load', () => {
    acwindow.webContents.send('socio-data', socio);
    });

    
    // Cerrar la ventana principal si existe
    // if (mainWindow) {
    //     mainWindow.close();
    //     mainWindow = null;
    // }
});

ipcMain.on('close-actualizar-window', () => {
    if (acwindow) {
        acwindow.destroy(); // Esto fuerza el cierre de la ventana
        acwindow = null;
    }
});


ipcMain.on('open-actualizarUser-window', (event, usuario) => {
    // Crear la ventana de actualización con datos del socio
    createActualizarUserWindow(usuario);
   // Enviar datos del socio a la ventana de actualización
   console.log("DEP2:"+usuario.id_user);
   acWindowUser.webContents.on('did-finish-load', () => {
   acWindowUser.webContents.send('user-data2', usuario);
   });

});

ipcMain.on('close-actualizarUser-window', () => {
   if (acWindowUser) {
       acWindowUser.destroy(); // Esto fuerza el cierre de la ventana
       acWindowUser = null;
   }
});

ipcMain.on('open-actualizarDeuda-window', (event, deuda) => {
    // Crear la ventana de actualización con datos del socio
    createActualizarDeudaWindow(deuda);
   // Enviar datos del socio a la ventana de actualización
   acWindowDeuda.webContents.on('did-finish-load', () => {
   acWindowDeuda.webContents.send('deuda-data', deuda);
   });

});

ipcMain.on('close-actualizarDeuda-window', () => {
   if (acWindowDeuda) {
       acWindowDeuda.destroy(); // Esto fuerza el cierre de la ventana
       acWindowDeuda = null;
   }
});

ipcMain.on('open-imprimirDeuda-window', (event, deuda) => {
    console.log('Recibida solicitud para imprimir deuda:', deuda);
    // Crear la ventana de impresión
    const imprimirWindow = createImprimirDeudaWindow();
    
    // Enviar datos de la deuda a la ventana de impresión cuando esté lista
    imprimirWindow.webContents.on('did-finish-load', () => {
        imprimirWindow.webContents.send('deudaimp-data', JSON.stringify(deuda));
    });
});

// ipcMain.on('print-deuda', (event, deuda) => {
//     const win = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             nodeIntegration: true,
//             contextIsolation: false
//         }
//     });

//     win.loadFile(path.join(__dirname, 'ui', 'imprimirDeuda.html'));

//     win.webContents.on('did-finish-load', () => {
//         win.webContents.send('deuda-data', deuda);
//     });

//     win.webContents.on('context-menu', (event, params) => {
//         const menu = Menu.buildFromTemplate([
//             { label: 'Imprimir', click: () => { win.webContents.print(); } },
//         ]);
//         menu.popup(win);
//     });
// });

// Función para registrar una nueva deuda y asociarla a todos los socios
async function registrarDeuda(deuda) {
    const conn = await getConnection();
    try {
        await conn.beginTransaction();
        // Insertar la deuda
        const sqlDeuda = 'INSERT INTO deuda (monto, fecha_registro, fecha_vencimiento, descripcion) VALUES (?, ?, ?, ?)';
        const fechaRegistro = new Date();
        const fechaFormateada = formatearFecha(fechaRegistro);
        const resultDeuda = await conn.query(sqlDeuda, [deuda.monto, fechaFormateada, deuda.fecha_vencimiento, deuda.descripcion]);
        const idDeuda = resultDeuda.insertId;

        // Obtener todos los socios
        const socios = await conn.query('SELECT id_socio FROM socio');

        // Asociar la deuda a cada socio
        const sqlSocioDeuda = 'INSERT INTO socio_deuda (id_socio, id_deuda, estado) VALUES (?, ?, "pendiente")';
        for (const socio of socios) {
            await conn.query(sqlSocioDeuda, [socio.id_socio, idDeuda]);
        }

        new Notification({
            title: 'Gestión de Socios',
            body: 'La deuda a sido registrada correctamente y vinculada a todos los socios'
        }).show();

        await conn.commit();
        return idDeuda;
    } catch (error) {
        await conn.rollback();
        console.error('Error al registrar deuda:', error);
        throw error;
    }
}

// async function getUsuarios() {
//     const conn = await getConnection();
//     const results = await conn.query('SELECT u.*, r.nombre_rol FROM usuario u JOIN rol r ON u.id_rol = r.id_rol  order by id_user');
//     return results;
// }

// Función para obtener todas las deudas
async function getDeudas() {
    const conn = await getConnection();
    try {
        const results = await conn.query('SELECT * FROM deuda ORDER BY fecha_registro DESC');
        return results;
    } catch (error) {
        console.error('Error al obtener deudas:', error);
        throw error;
    }
}

// Función para actualizar una deuda
async function actualizarDeuda(deuda) {
    const conn = await getConnection();
    try {
        await conn.beginTransaction();

        // Actualizar la deuda
        const sqlUpdateDeuda = 'UPDATE deuda SET monto = ?, fecha_vencimiento = ?, descripcion = ? WHERE id_deuda = ?';
        await conn.query(sqlUpdateDeuda, [deuda.monto, deuda.fecha_vencimiento, deuda.descripcion, deuda.id_deuda]);

        // Actualizar el estado en socio_deuda solo si es necesario
        if (deuda.actualizarEstado) {
            const sqlUpdateSocioDeuda = 'UPDATE socio_deuda SET estado = "pendiente" WHERE id_deuda = ? AND estado != "cancelado"';
            await conn.query(sqlUpdateSocioDeuda, [deuda.id_deuda]);
        }

        await conn.commit();
        return true;
    } catch (error) {
        await conn.rollback();
        console.error('Error al actualizar deuda:', error);
        throw error;
    }
}

// Función para eliminar una deuda específica y sus asociaciones
async function eliminarDeuda(idDeuda) {
    const conn = await getConnection();
    try {
        await conn.beginTransaction();

        // Eliminar asociaciones en socio_deuda
        await conn.query('DELETE FROM socio_deuda WHERE id_deuda = ?', [idDeuda]);

        // Eliminar la deuda
        const result = await conn.query('DELETE FROM deuda WHERE id_deuda = ?', [idDeuda]);

        await conn.commit();
        return result;
    } catch (error) {
        await conn.rollback();
        console.error('Error al eliminar deuda:', error);
        throw error;
    }
}

// Configuración de los manejadores de IPC
ipcMain.handle('registrar-deuda', async (event, deuda) => {
    try {
        const idDeuda = await registrarDeuda(deuda);
        return idDeuda;
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-deudas', async () => {
    try {
        return deudas = await getDeudas();
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('actualizar-deuda', async (event, deuda) => {
    try {
        const actualizado = await actualizarDeuda(deuda);
        return { success: actualizado };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('eliminar-deuda', async (event, idDeuda) => {
    try {
        const eliminado = await eliminarDeuda(idDeuda);
        return { success: eliminado };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.on('open-listar-socio-window', () => {
    createListarSocioWindow();
});

ipcMain.on('open-listar-deuda-window', (event, idSocio) => {
    console.log(idSocio);
    createListarDeudaWindow(idSocio);
});


async function getDeudasSocio(idSocio) {
    const conn = await getConnection();
    const query = `
        SELECT 
            sd.id_socio,
            sd.id_deuda,
            sd.estado,
            sd.fecha_pago,
            sd.cod_voucher,
            sd.ruta_comprobante,
            d.fecha_registro,
            d.fecha_vencimiento,
            d.descripcion,
            d.monto
        FROM 
            socio_deuda sd
        JOIN 
            deuda d ON sd.id_deuda = d.id_deuda
        WHERE 
            sd.id_socio = ?;
    `;
    const results = await conn.query(query, [idSocio]);
    return results;
}

ipcMain.handle('get-deudas-socio', async (event, idSocio) => {
    return await getDeudasSocio(idSocio);    
});

ipcMain.on('socio-selected', (event, socio) => {
    mainWindow.webContents.send('socio-selected', socio);
});

ipcMain.on('deuda-selected', (event, deuda) => {
    mainWindow.webContents.send('deuda-selected', deuda);
});

async function actualizarPagoDeuda(pago) {
    try {
        const conn = await getConnection();
        const sql = `
            UPDATE socio_deuda 
            SET estado = ?, 
                fecha_pago = ?, 
                cod_voucher = ?, 
                ruta_comprobante = ?
            WHERE id_socio = ? AND id_deuda = ?
        `;
        const values = [
            'cancelado',
            new Date().toISOString().slice(0, 10), // Fecha actual en formato YYYY-MM-DD
            pago.cod_voucher,
            pago.ruta_comprobante,
            pago.id_socio,
            pago.id_deuda
        ];

        const result = await conn.query(sql, values);

        new Notification({
            title: 'Electron MYSQL',
            body: 'Pago de deuda registrado correctamente'
        }).show();

        return { success: true, message: 'Pago actualizado correctamente' };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Error al actualizar el pago', error: error.message };
    }
}

ipcMain.handle('guardar-pago', async (event, pago) => {
    return actualizarPagoDeuda(pago);
});

async function getSociosDeudas() {
    const conn = await getConnection();
    const results = await conn.query(`
        SELECT s.id_socio, s.nombres, s.apellidos, d.id_deuda, d.monto, d.fecha_vencimiento, sd.estado
        FROM socio s
        JOIN socio_deuda sd ON s.id_socio = sd.id_socio
        JOIN deuda d ON sd.id_deuda = d.id_deuda
    `);
    return results;
}

async function getSociosCompleto() {
    const conn = await getConnection();
    const results = await conn.query(`
        SELECT s.id_socio, s.nombres, s.apellidos, s.dni, 
               l.nombre_local, m.nombre_modulo,
               SUM(d.monto) as deuda_total
        FROM socio s
        LEFT JOIN localidad l ON s.id_localidad = l.id_localidad
        LEFT JOIN modulo m ON s.id_modulo = m.id_modulo
        LEFT JOIN socio_deuda sd ON s.id_socio = sd.id_socio
        LEFT JOIN deuda d ON sd.id_deuda = d.id_deuda
        GROUP BY s.id_socio
    `);
    return results;
}

ipcMain.handle('get-socios-deudas', () => {
    return getSociosDeudas();
});

ipcMain.handle('get-socios-completo', () => {
    return getSociosCompleto();
});

ipcMain.handle('generate-report', async (event, reportType) => {
    const conn = await getConnection();
    let query;
    switch(reportType) {
        case 'socios':
            query = 'SELECT * FROM socio';
            break;
        case 'deudas':
            query = 'SELECT * FROM deuda';
            break;
        case 'pagos':
            query = 'SELECT * FROM socio_deuda WHERE estado = "cancelado"';
            break;
        default:
            throw new Error('Tipo de informe no válido');
    }

    try {
        const rows = await conn.query(query);
        console.log('Número de filas obtenidas:', rows.length);
        console.log('Datos obtenidos de la base de datos:', rows);
        return rows;
    } catch (error) {
        console.error('Error al generar el informe:', error);
        throw error;
    }
});

ipcMain.on('logout', (event) => {
    // Cierra todas las ventanas
    BrowserWindow.getAllWindows().forEach((window) => {
      window.close();
    });
  
    // Crea una nueva ventana de inicio de sesión
    createLoginWindow();
});

let verificationCodes = new Map();

// Configuración del transporte de correo (ajusta según tu proveedor de correo)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'paulpizarro151@gmail.com',
      pass: 'biba klzs gqfi skhm'
    }
  });

let currentEmail = '';

ipcMain.handle('verify-email', async (event, email) => {
const conn= await getConnection();
try {
    const [rows] = await conn.query('SELECT * FROM usuario WHERE mail = ?', [email]);
    console.log("MAIL"+rows.mail)

    if (rows !=undefined) {
        console.log("SSSSSS")
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        verificationCodes.set(email, verificationCode);
        currentEmail = email;

        await transporter.sendMail({
            from: 'paulpizarro@gmail.com',
            to: email,
            subject: "Código de verificación para cambio de contraseña",
            html: `
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                        <h2 style="color: #0044cc;">Cambio de contraseña</h2>
                        <p>Hola,</p>
                        <p>Recibimos una solicitud para cambiar tu contraseña. Por favor, usa el siguiente código de verificación para completar el proceso:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #0044cc;">${verificationCode}</p>
                        <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
                        <p>Gracias,</p>
                        <p>Tu equipo de soporte</p>
                        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
                        <p style="font-size: 12px; color: #777;">Si tienes alguna pregunta, no dudes en contactarnos a través de nuestro <a href="mailto:paulpizarro@gmail.com" style="color: #0044cc;">correo de soporte</a>.</p>
                    </div>
                `
        });

        return { success: true, email: email};
    } else {
        console.log("AAAAAAAAAAAAA")
    return { success: false, message: "Correo no registrado" + rows.mail};
    }
} catch (error) {
    console.error('Error al verificar email:', error);
    return { success: false, message: "Error al procesar la solicitud" };
}
});

ipcMain.handle('verify-code', async (event, code) => {
    const storedCode = verificationCodes.get(currentEmail);
    if (storedCode && storedCode === code) {
        verificationCodes.delete(currentEmail);
        return { success: true };
    } else {
        return { success: false, message: "Código no válido" };
    }
});

ipcMain.handle('change-password', async (event, newPassword) => {
    const conn = await getConnection();
    try {
        await conn.query('UPDATE usuario SET password = ? WHERE mail = ?', [newPassword, currentEmail]);
        return { success: true };
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return { success: false, message: "Error al cambiar la contraseña" };
    }
})

ipcMain.on('load-verify-code', () => {
    changePasswordWindow.loadFile(path.join(__dirname, 'ui', 'verifyCode.html'));
});

ipcMain.on('load-change-password', () => {
    changePasswordWindow.loadFile(path.join(__dirname, 'ui', 'changePassword.html'));
});

// Evento para abrir la ventana de cambio de contraseña y cerrar la ventana de login
ipcMain.on('open-change-password-window', () => {
    if (loginWindow) {
        loginWindow.close();
    }
    createChangePasswordWindow();
});

ipcMain.on('close-change-password-window', () => {
    if (changePasswordWindow && !changePasswordWindow.isDestroyed()) {
        changePasswordWindow.close();
        changePasswordWindow = null;
    }
});

//PARA ACTUALIZAR LA VENTANA
ipcMain.on('actualizar-deuda-completado', () => {
    mainWindow.webContents.send('actualizar-deuda-completado');
});


//VENTANA DE IMPRESION DE DEUDA
ipcMain.on('imprimir-deuda', (deuda) => {
    console.log('Recibida solicitud para imprimir deuda:', deuda);
    const detallesWindow = new BrowserWindow({
        width: 400,
        height: 600,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    autoHideMenuBar: true
    });

    const detallesPath = path.join(__dirname, 'src', 'ui', 'imprimirDeuda.html');
    console.log('Intentando cargar:', detallesPath);
    detallesWindow.loadFile(detallesPath);

    detallesWindow.webContents.on('did-finish-load', () => {
        console.log('Ventana de detalles cargada, enviando datos de deuda');
        detallesWindow.webContents.send('deuda-para-imprimir', deuda);
    });

    detallesWindow.on('closed', () => {
        console.log('Ventana de detalles cerrada');
    });
    detallesWindow.webContents.openDevTools();
});

let impwindow;

//VENTANA DE IMPRESION DE DEUDA
function createImprimirDeudaWindow() {
    impwindow = new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    autoHideMenuBar: true
    });

    impwindow.loadFile(path.join(__dirname, 'ui', 'imprimirDeuda.html'));

    impwindow.on('closed', () => {
        console.log('Ventana de actualización cerrada');
        impwindow = null;
    });

    return impwindow; // Devolver la ventana creada
}

//PDF VENTANA
ipcMain.handle('abrir-pdf-electron', async (event, rutaPDF) => {
    const pdfWindow = new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            plugins: true
        },
        
    autoHideMenuBar: true,
    });

    await pdfWindow.loadURL(`file://${rutaPDF}`);
});


let listarSocioWindow;
let listarDeudaWindow;

//VENTANA DE LISTA DE SOCIOS
function createListarSocioWindow() {
    listarSocioWindow = new BrowserWindow({
        width: 600,
        height: 400,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    autoHideMenuBar: true,    
    });

    listarSocioWindow.loadFile(path.join(__dirname, 'ui/listarSocio.html'));
    
}


//VENTANA DE LISTA DE DEUDA * SOCIO
function createListarDeudaWindow(idSocio) {
    listarDeudaWindow = new BrowserWindow({
        width: 600,
        height: 400,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    autoHideMenuBar: true,
    });

    listarDeudaWindow.loadFile(path.join(__dirname, 'ui/listarDeuda.html'));
    listarDeudaWindow.webContents.on('did-finish-load', () => {
        listarDeudaWindow.webContents.send('socio-id', idSocio);
    });
}

//VENTANA SOCIO
let sociowindow;
function socioWindow(){
    sociowindow = new BrowserWindow({
        with: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        },
    autoHideMenuBar: true,    
    })

    //cargar el archivo html
    sociowindow.loadFile('src/ui/socio.html')
}

//VENTANA DE CAMBIO DE CONTRASENA
let changePasswordWindow;
function createChangePasswordWindow() {
    changePasswordWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    autoHideMenuBar: true,
    });

    changePasswordWindow.loadFile(path.join(__dirname, 'ui', 'verifyEmail.html'));

    changePasswordWindow.on('closed', () => {
        changePasswordWindow = null;
    });

    return changePasswordWindow;
}

let loginWindow;
let mainWindow;

//VENTAN LOGIN
function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    autoHideMenuBar: true,
    });

    loginWindow.loadFile('src/ui/login.html');

    loginWindow.on('closed', () => {
        console.log('Ventana de login cerrada');
        loginWindow = null;
    });
    
    return loginWindow;
}



//VENTANA PRINCIPAL
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    autoHideMenuBar: true
    });

    mainWindow.loadFile(path.join(__dirname, 'ui', 'home.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    return mainWindow; // Importante: Devolver la ventana creada
}


//crea el objeto 
//exporta para uso de los demás
module.exports = {
    socioWindow,    
    createLoginWindow,
    createMainWindow
}


