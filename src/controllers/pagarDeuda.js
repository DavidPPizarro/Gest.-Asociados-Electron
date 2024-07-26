const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const listarSocioBtn = document.getElementById('listarSocio');
    const listarDeudaBtn = document.getElementById('listarDeuda');
    const guardarBtn = document.getElementById('guardar');
    const cancelarBtn = document.getElementById('cancelar');

    listarSocioBtn.addEventListener('click', () => {
        ipcRenderer.send('open-listar-socio-window');
    });

    listarDeudaBtn.addEventListener('click', () => {
        const idSocio = document.getElementById('codigo').value;
        console.log(idSocio);
        if (idSocio) {            
            ipcRenderer.send('open-listar-deuda-window', idSocio);
        } else {
            alert('Por favor, seleccione un socio primero');
        }
    });

    guardarBtn.addEventListener('click', guardarPago);
    // cancelarBtn.addEventListener('click', () => {
    //     window.close();
    // });

    ipcRenderer.on('socio-selected', (event, socio) => {
        document.getElementById('codigo').value = socio.id_socio;
        document.getElementById('dni').value = socio.dni;
        document.getElementById('nombres').value = socio.nombres;
        document.getElementById('apellidos').value = socio.apellidos;
    });

    ipcRenderer.on('deuda-selected', (event, deuda) => {
        console.log(deuda)
        document.getElementById('codigoDeuda').value = deuda.id_deuda;
        document.getElementById('montoOriginal').value = deuda.monto;
        const fechaLimite = new Date(deuda.fecha_vencimiento);
        const fechaFormateada = fechaLimite.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('fechaVencimiento').value = fechaFormateada;
        const montoTotal = calcularMontoTotal(deuda.monto, deuda.fecha_vencimiento);
        document.getElementById('montoTotal').value = montoTotal.toFixed(2);
    });
});

function calcularMontoTotal(montoOriginal, fechaVencimiento) {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const montoOriginalFloat = parseFloat(montoOriginal);
    let montoTotal = montoOriginalFloat;
    let mensaje = '';

    if (hoy > vencimiento) {
        const mesesAtrasados = Math.floor((hoy - vencimiento) / (30 * 24 * 60 * 60 * 1000));
        const porcentajeAdicional = Math.min(50, 10 + mesesAtrasados * 2); // Máximo 50% adicional
        montoTotal += montoOriginalFloat * (porcentajeAdicional / 100);
        
        document.getElementById('montoTotal').style.color = 'red';
        mensaje = `Incluye ${porcentajeAdicional}% adicional por atraso de ${mesesAtrasados} meses`;
    } else {
        document.getElementById('montoTotal').style.color = '';
    }

    const montoTotalInput = document.getElementById('montoTotal');
    montoTotalInput.value = montoTotal.toFixed(2);
    montoTotalInput.title = mensaje; // Muestra el mensaje como un tooltip

    return montoTotal.toFixed(2);
}

async function guardarPago() {
    const comprobantePago = document.getElementById('comprobantePago').files[0];
    if (!comprobantePago) {
        alert('Por favor, seleccione un archivo de comprobante de pago');
        return;
    }

    const formData = new FormData();
    formData.append('comprobantePago', comprobantePago);

    try {
        const response = await fetch('http://localhost:3000/guardar-comprobante', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        const pago = {
            id_socio: parseInt(document.getElementById('codigo').value),
            id_deuda: parseInt(document.getElementById('codigoDeuda').value),
            cod_voucher: document.getElementById('nComprobante').value,
            ruta_comprobante: result.comprobantePath
        };

        const resultadoPago = await ipcRenderer.invoke('guardar-pago', pago);
        if (resultadoPago.success) {
            alert(resultadoPago.message);
            //window.close();
        } else {
            alert(`Error al guardar el pago: ${resultadoPago.message}`);
        }
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        alert('Error al guardar el pago');
    }
}