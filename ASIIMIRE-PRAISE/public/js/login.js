document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = form.querySelector('input[name="emailOrPhone"]');
  const passwordInput = form.querySelector('input[name="password"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;

    // Clear previous error messages
    const errorTexts = form.querySelectorAll('.error-text');
    errorTexts.forEach(el => el.remove());

    // Email validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '' || !emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('input-error');
      const errorSpan = document.createElement('span');
      errorSpan.classList.add('error-text');
      errorSpan.textContent = 'Please enter a valid email or phone';
      emailInput.parentNode.appendChild(errorSpan);
      allValid = false;
    } else {
      emailInput.classList.remove('input-error');
    }

    // Password validation (non-empty)
    if (passwordInput.value.trim() === '') {
      passwordInput.classList.add('input-error');
      const errorSpan = document.createElement('span');
      errorSpan.classList.add('error-text');
      errorSpan.textContent = 'Password is required';
      passwordInput.parentNode.appendChild(errorSpan);
      allValid = false;
    } else {
      passwordInput.classList.remove('input-error');
    }

    if (allValid) form.submit();
  });
});
