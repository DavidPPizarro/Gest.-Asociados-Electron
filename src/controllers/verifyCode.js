const { ipcRenderer } = require('electron');

const codeInputs = Array.from({ length: 6 }, (_, i) => document.getElementById(`code${i + 1}`));
const verifyButton = document.getElementById('verifyButton');
const alertDiv = document.getElementById('alert');

codeInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value && index < 5) {
            codeInputs[index + 1].focus();
        }
    });
});

verifyButton.addEventListener('click', async () => {
    const code = codeInputs.map(input => input.value).join('');
    const result = await ipcRenderer.invoke('verify-code', code);
    
    if (result.success) {
        ipcRenderer.send('load-change-password');
    } else {
        alertDiv.textContent = result.message || "Código no válido";
        alertDiv.style.display = 'block';
    }
});