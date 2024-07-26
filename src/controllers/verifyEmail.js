const { ipcRenderer } = require('electron');

const emailInput = document.getElementById('email');
const sendButton = document.getElementById('sendButton');
const alertDiv = document.getElementById('alert');

sendButton.addEventListener('click', async () => {
    const email = emailInput.value;
    const result = await ipcRenderer.invoke('verify-email', email);
    
    if (result.success) {
        ipcRenderer.send('load-verify-code');
    } else {
        alertDiv.textContent = result.message || "Error al procesar la solicitud";
        alertDiv.style.display = 'block';
    }
});