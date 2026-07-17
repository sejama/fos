const form = document.getElementById('contactForm');
const submitButton = document.getElementById('submitButton');
const successMessage = document.getElementById('submitSuccessMessage');
const errorMessage = document.getElementById('submitErrorMessage');

if (form) {
  const fields = form.querySelectorAll('input, textarea');

  const setMessageVisibility = (messageElement, visible) => {
    if (!messageElement) return;

    if (visible) {
      messageElement.removeAttribute('hidden');
    } else {
      messageElement.setAttribute('hidden', '');
    }
  };

  const resetMessages = () => {
    setMessageVisibility(successMessage, false);
    setMessageVisibility(errorMessage, false);
  };

  const setFieldState = (field, isValid) => {
    field.classList.toggle('is-invalid', !isValid);
    field.setAttribute('aria-invalid', isValid ? 'false' : 'true');
  };

  const validateForm = () => {
    let isValid = true;

    fields.forEach((field) => {
      const value = field.value.trim();
      const isFilled = value.length > 0;

      if (!isFilled) {
        setFieldState(field, false);
        isValid = false;
        return;
      }

      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmail = emailRegex.test(value);
        setFieldState(field, validEmail);
        if (!validEmail) {
          isValid = false;
        }
        return;
      }

      setFieldState(field, true);
    });

    submitButton.disabled = !isValid;
    return isValid;
  };

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const formatValidationErrors = (errors) => {
    if (!errors || typeof errors !== 'object') {
      return '';
    }

    const fieldLabels = {
      to: 'destinatario',
      subject: 'asunto',
      body: 'mensaje',
      from: 'remitente',
      replyTo: 'respuesta',
      cc: 'CC',
      bcc: 'BCC',
      isHtml: 'formato'
    };

    return Object.entries(errors)
      .map(([field, message]) => {
        const normalizedField = field.replace(/[\[\]]/g, '');
        const label = fieldLabels[normalizedField] || normalizedField;
        return `${escapeHtml(label)}: ${escapeHtml(message)}`;
      })
      .join('<br>');
  };

  fields.forEach((field) => {
    field.addEventListener('input', validateForm);
    field.addEventListener('blur', validateForm);
  });

  validateForm();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    resetMessages();

    if (!validateForm()) {
      setMessageVisibility(errorMessage, true);
      errorMessage.textContent = 'Completá todos los campos obligatorios y corregí el correo electrónico.';
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    const name = document.getElementById('name').value.trim();
    const empresa = document.getElementById('empresa').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    const emailBody = `
      <h2>Nuevo mensaje de contacto desde el sitio web</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Empresa:</strong> ${empresa}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    try {
      const response = await fetch('http://localhost:8080/backend/public/api/email/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: 'contacto@taponesfos.com',
          subject: `Mensaje de contacto de ${name} - ${empresa}`,
          body: emailBody,
          from: email,
          isHtml: true
        })
      });

      let responseData = null;
      try {
        responseData = await response.json();
      } catch (_) {
        // El endpoint puede no responder con JSON válido.
      }

      if (response.ok) {
        setMessageVisibility(successMessage, true);
        form.reset();
        fields.forEach((field) => setFieldState(field, true));
        validateForm();
      } else {
        const apiMessage = responseData?.message || responseData?.error;
        const fieldErrors = formatValidationErrors(responseData?.errors);

        setMessageVisibility(errorMessage, true);
        errorMessage.innerHTML = fieldErrors
          ? `Error al enviar:<br>${fieldErrors}`
          : (apiMessage ? `Error al enviar: ${escapeHtml(apiMessage)}` : 'Error al enviar el mensaje. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al enviar el email:', error);
      setMessageVisibility(errorMessage, true);
      errorMessage.textContent = 'No se pudo completar el envío. Intentá nuevamente.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar';
    }
  });
}
