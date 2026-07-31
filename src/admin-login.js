/**
 * @param {Document} doc
 * @param {Window['location']} location
 */
function init(doc = document, location = window.location) {
  const form = doc.getElementById('admin-login-form');
  if (!form) return;

  const errorEl = doc.getElementById('admin-login-error');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const usuario = form.usuario.value;
    const contrasena = form.contrasena.value;

    if (!validarCredenciales(usuario, contrasena)) {
      errorEl.textContent = 'Usuario o contraseña incorrectos';
      return;
    }

    errorEl.textContent = '';
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    location.href = 'panel.html';
  });
}

init();
