function validatePassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('passwordError');
    
    if (password !== confirmPassword) {
        errorElement.textContent = 'As senhas não coincidem';
        return false;
    }
    
    if (password.length < 6) {
        errorElement.textContent = 'A senha deve ter pelo menos 6 caracteres';
        return false;
    }
    
    errorElement.textContent = '';
    return true;
}