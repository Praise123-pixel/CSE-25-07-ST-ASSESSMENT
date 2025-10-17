document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const inputs = form.querySelectorAll('.form-input');

  // Create banner container
  const banner = document.createElement('div');
  banner.id = 'successBanner';
  banner.style.display = 'none';
  banner.style.padding = '15px';
  banner.style.backgroundColor = '#28a745';
  banner.style.color = 'white';
  banner.style.textAlign = 'center';
  banner.style.borderRadius = '5px';
  banner.style.marginBottom = '15px';
  banner.innerHTML = 'Account created successfully! - <a href="/login" style="color: #fff; text-decoration: underline; font-weight: bold;">Login</a>';
  
  form.parentNode.insertBefore(banner, form);

  // Validate on blur
  inputs.forEach(input => {
    input.addEventListener('blur', function () {
      if (this.value.trim() === '') {
        this.classList.add('invalid');
        this.classList.remove('valid');
      } else {
        this.classList.add('valid');
        this.classList.remove('invalid');
      }
    });

    input.addEventListener('input', function () {
      if (this.value.trim() !== '') {
        this.classList.remove('invalid');
      }
    });
  });

  // Custom validation on submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    inputs.forEach(input => {
      if (input.value.trim() === '') {
        input.classList.add('invalid');
        input.classList.remove('valid');
        isValid = false;
      } else {
        input.classList.add('valid');
        input.classList.remove('invalid');
      }
    });

    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if (password.value !== confirmPassword.value) {
      confirmPassword.classList.add('invalid');
      confirmPassword.classList.remove('valid');
      isValid = false;
      alert('Passwords do not match!');
      return;
    }

    if (isValid) {
      // Show banner
      banner.style.display = 'block';
      // Hide after 5 seconds
      setTimeout(() => {
        banner.style.display = 'none';
      }, 5000);

      // Optional: reset form
      form.reset();
      inputs.forEach(input => input.classList.remove('valid'));
    }
  });
});
