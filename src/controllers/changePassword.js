const { ipcRenderer } = require('electron');

const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const changeButton = document.getElementById('changeButton');
const alertDiv = document.getElementById('alert');

changeButton.addEventListener('click', async () => {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (newPassword !== confirmPassword) {
        alertDiv.textContent = "Las contraseñas no coinciden";
        alertDiv.style.display = 'block';
        return;
    }

    const result = await ipcRenderer.invoke('change-password', newPassword);
    
    
    if (result.success) {
        ipcRenderer.send('close-change-password-window');
        ipcRenderer.send('load-login');
    } else {
        alertDiv.textContent = result.message || "Error al cambiar la contraseña";
        alertDiv.style.display = 'block';
    }
});