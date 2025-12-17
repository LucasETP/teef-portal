// ============================================
// PASSWORD & AUTH
// ============================================
const PASSWORD_HASH = '4f3bedac8096ef06a4902c84cfd4a08ec1f1f88049637a04e56bd1384dbfff6a';

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const hashed = await hashPassword(input);

    if (hashed === PASSWORD_HASH) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
        initWidgets();
    } else {
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('passwordInput').value = '';
    }
}

function logout() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('passwordInput').value = '';
}
