const { ipcRenderer } = require('electron');

const loginForm = document.getElementById('loginForm');
const mailInput = document.getElementById('mail');
const passwordInput = document.getElementById('password');
const changePasswordLink = document.getElementById('changePasswordLink');
const alertSuccess = document.getElementById('alertSuccess');
const alertError = document.getElementById('alertError');

function showAlert(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

// loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const credentials = {
//         mail: mailInput.value,
//         password: passwordInput.value
//     };
//     const result = await ipcRenderer.invoke('login', credentials);
//     if (result) {
//         showAlert(alertSuccess, 'Inicio de sesión exitoso');
//         setTimeout(() => {
//             ipcRenderer.send('open-main-window', result.userData);
//         }, 1000);
//     } else {
//         showAlert(alertError, 'Inicio de sesión fallido. Por favor, verifica tus credenciales.');
//     }
// });

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const credentials = {
        mail: mailInput.value,
        password: passwordInput.value
    };
    const result = await ipcRenderer.invoke('login', credentials);
    if (result.success) {
        showAlert(alertSuccess, 'Inicio de sesión exitoso');
        setTimeout(() => {
            ipcRenderer.send('open-main-window', result.userData);
        }, 1000);
    } else {
        showAlert(alertError, 'Inicio de sesión fallido. Por favor, verifica tus credenciales.');
    }
});


changePasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('open-change-password-window');
});