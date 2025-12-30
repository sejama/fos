/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

    // Manejo del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const successMessage = document.getElementById('submitSuccessMessage');
    const errorMessage = document.getElementById('submitErrorMessage');

    if (contactForm) {
        // Habilitar el botón cuando todos los campos sean válidos
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateForm();
            });
        });

        // Validar formulario
        function validateForm() {
            const name = document.getElementById('name').value.trim();
            const empresa = document.getElementById('empresa').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (name && empresa && emailRegex.test(email) && phone && message) {
                submitButton.classList.remove('disabled');
                return true;
            } else {
                submitButton.classList.add('disabled');
                return false;
            }
        }

        // Manejar el envío del formulario
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }

            // Deshabilitar el botón mientras se envía
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Ocultar mensajes previos
            successMessage.classList.add('d-none');
            errorMessage.classList.add('d-none');

            // Obtener los datos del formulario
            const name = document.getElementById('name').value.trim();
            const empresa = document.getElementById('empresa').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Construir el cuerpo del email en HTML
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
                // Enviar el email a través de la API
                const response = await fetch('http://localhost:8080/backend/public/api/email/send', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: 'contacto@taponesfos.com', // Cambiar por el email real
                        subject: `Mensaje de contacto de ${name} - ${empresa}`,
                        body: emailBody,
                        from: `${email}`,
                        isHtml: true
                    })
                });

                if (response.ok) {
                    // Mostrar mensaje de éxito
                    successMessage.classList.remove('d-none');
                    // Limpiar el formulario
                    contactForm.reset();
                    submitButton.classList.add('disabled');
                } else {
                    // Mostrar mensaje de error
                    errorMessage.classList.remove('d-none');
                }
            } catch (error) {
                console.error('Error al enviar el email:', error);
                errorMessage.classList.remove('d-none');
            } finally {
                // Rehabilitar el botón
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar';
            }
        });
    }

});
