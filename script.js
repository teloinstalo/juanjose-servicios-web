/* ========================================
   JUANJOSE - Premium Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // PARTICLE BACKGROUND
    // ========================================
    const canvas = document.getElementById('particleCanvas');
    let ctx, particles = [], animationId, isDark;

    if (canvas) {
        ctx = canvas.getContext('2d');
        isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = isDark
                    ? `rgba(167, 139, 250, ${this.opacity})`
                    : `rgba(124, 58, 237, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = window.innerWidth < 768 ? 30 : 60;
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = isDark
                            ? `rgba(167, 139, 250, ${0.1 * (1 - dist / 150)})`
                            : `rgba(124, 58, 237, ${0.08 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
            animationId = requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // ========================================
    // THEME TOGGLE
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        if (canvas) isDark = savedTheme === 'dark';

        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            if (canvas) {
                isDark = next === 'dark';
                particles.forEach(p => p.draw());
            }
        });
    }

    // ========================================
    // MOBILE MENU
    // ========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const spans = mobileToggle.querySelectorAll('span');
            if (navLinks.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    // ========================================
    // ACTIVE NAV LINK ON SCROLL (same-page anchors only)
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length && navItems.length) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            navItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll('.service-card, .testimonial-card, .gallery-item, .info-card, .calc-category, .cta-box');

    if (revealElements.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.05}s`;
            revealObserver.observe(el);
        });
    }

    // ========================================
    // ANIMATED COUNTERS
    // ========================================
    const statItems = document.querySelectorAll('.stat-item');

    if (statItems.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    const numberEl = entry.target.querySelector('.stat-number');
                    if (numberEl) animateCounter(numberEl, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statItems.forEach(item => counterObserver.observe(item));
    }

    function animateCounter(el, target) {
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            el.textContent = current + (target >= 100 ? '+' : '');
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target + (target >= 100 ? '+' : '');
        }
        requestAnimationFrame(update);
    }

    // ========================================
    // PROCESS TIMELINE ANIMATION
    // ========================================
    const timelineProgress = document.querySelector('.timeline-progress');
    const steps = document.querySelectorAll('.step');
    const timelineSection = document.querySelector('.process-timeline');

    if (timelineSection && timelineProgress && steps.length) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => { timelineProgress.style.width = '100%'; }, 300);
                    steps.forEach((step, i) => {
                        setTimeout(() => { step.classList.add('visible'); }, 300 + (i * 200));
                    });
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        timelineObserver.observe(timelineSection);
    }

    // ========================================
    // TOAST NOTIFICATIONS
    // ========================================
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout;

    function showToast(message) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ========================================
    // BUDGET CALCULATOR
    // ========================================
    const calcCheckboxes = document.querySelectorAll('.calc-option input[type="checkbox"]');
    const urgencyRadios = document.querySelectorAll('input[name="urgency"]');
    const summaryList = document.getElementById('summaryList');
    const totalPriceEl = document.getElementById('totalPrice');
    const btnBudget = document.getElementById('btnBudget');
    const serviceButtons = document.querySelectorAll('.btn-add');

    if (calcCheckboxes.length && summaryList && totalPriceEl) {
        let selectedServices = [];
        let urgencyFee = 0;

        function updateCalculator() {
            selectedServices = [];
            let total = 0;

            calcCheckboxes.forEach(cb => {
                if (cb.checked) {
                    const name = cb.dataset.name;
                    const price = parseInt(cb.dataset.price);
                    selectedServices.push({ name, price });
                    total += price;
                }
            });

            total += urgencyFee;

            if (selectedServices.length === 0) {
                summaryList.innerHTML = '<p class="empty">Selecciona servicios para ver el desglose</p>';
            } else {
                summaryList.innerHTML = selectedServices.map(s => `
                    <div class="summary-item">
                        <span>${s.name}</span>
                        <span>${s.price}€</span>
                    </div>
                `).join('');
                if (urgencyFee > 0) {
                    summaryList.innerHTML += `
                        <div class="summary-item">
                            <span>Urgencia</span>
                            <span>+${urgencyFee}€</span>
                        </div>
                    `;
                }
            }

            totalPriceEl.textContent = total + '€';

            if (btnBudget) {
                if (selectedServices.length > 0) {
                    const servicesText = selectedServices.map(s => `• ${s.name}: ${s.price}€`).join('%0A');
                    const urgencyText = urgencyFee > 0 ? `%0AUrgencia: +${urgencyFee}€` : '';
                    const message = `Hola Juanjo,%0AVi tu web y quiero solicitar presupuesto para:%0A${servicesText}${urgencyText}%0A%0ATotal estimado: ${total}€`;
                    btnBudget.href = `https://wa.me/34600000000?text=${message}`;
                    btnBudget.target = '_blank';
                } else {
                    btnBudget.href = 'contacto.html';
                    btnBudget.target = '';
                }
            }
        }

        calcCheckboxes.forEach(cb => cb.addEventListener('change', updateCalculator));

        if (urgencyRadios.length) {
            urgencyRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    urgencyFee = parseInt(e.target.value);
                    updateCalculator();
                });
            });
        }

        if (serviceButtons.length) {
            serviceButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const service = btn.dataset.service;
                    const price = btn.dataset.price;

                    const checkbox = Array.from(calcCheckboxes).find(cb =>
                        cb.dataset.price === price && cb.dataset.name.toLowerCase().includes(service)
                    );

                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        updateCalculator();
                        const presupuestoSection = document.getElementById('presupuesto');
                        if (presupuestoSection) {
                            presupuestoSection.scrollIntoView({ behavior: 'smooth' });
                        }
                        btn.textContent = checkbox.checked ? '✓ Añadido' : 'Añadir al presupuesto';
                        btn.classList.toggle('added', checkbox.checked);
                        showToast(checkbox.checked ? 'Servicio añadido al presupuesto' : 'Servicio eliminado');
                    } else {
                        window.location.href = 'presupuesto.html';
                    }
                });
            });
        }
    }

    // ========================================
    // CONTACT FORM
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const btnSpinner = document.getElementById('btnSpinner');

    // Función para marcar campos con error
    function markFieldError(fieldId, isValid) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        if (formGroup) {
            if (!isValid) {
                formGroup.classList.add('error');
                field.classList.add('error');
            } else {
                formGroup.classList.remove('error');
                field.classList.remove('error');
            }
        }
    }

    // Validación en tiempo real para email
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(this.value.trim());
            markFieldError('email', isValid || this.value.trim() === '');
        });
    }

    // Validación en tiempo real para campos obligatorios
    const requiredFields = ['name', 'serviceType', 'message'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                const isValid = this.value.trim() !== '';
                markFieldError(fieldId, isValid);
            });
        }
    });

    if (contactForm && btnText && btnIcon && btnSpinner) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Obtener valores de los campos
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const appointment = document.getElementById('appointment').value;
            const serviceType = document.getElementById('serviceType').value;
            const message = document.getElementById('message').value.trim();
            
            // Obtener urgencia seleccionada
            const urgency = document.querySelector('input[name="urgency"]:checked')?.value || 'normal';
            
            // Obtener servicios adicionales seleccionados
            const additionalServices = Array.from(document.querySelectorAll('input[name="additional[]"]:checked'))
                .map(cb => cb.value);
            
            // Obtener preferencia de contacto
            const contactPref = document.querySelector('input[name="contactPref"]:checked')?.value || 'email';
            
            // Verificar checkbox de privacidad
            const privacyAccepted = document.querySelector('input[name="privacy"]')?.checked;

            // Validaciones básicas
            if (!name || !email || !serviceType || !message || !privacyAccepted) {
                showToast('Por favor completa todos los campos obligatorios (*)');
                return;
            }

            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Por favor ingresa un email válido');
                return;
            }

            // Cambiar estado del botón
            btnText.textContent = 'Enviando...';
            btnIcon.style.display = 'none';
            btnSpinner.style.display = 'block';
            contactForm.querySelector('button[type="submit"]').disabled = true;

            // Simular envío (en un caso real aquí iría una petición fetch)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mostrar mensaje de éxito
            btnText.textContent = '¡Solicitud enviada!';
            btnSpinner.style.display = 'none';
            btnIcon.style.display = 'block';
            btnIcon.innerHTML = '<path d="M20 6L9 17l-5-5"/>';

            // Mostrar resumen en consola (en producción se enviaría al servidor)
            console.log('📋 Solicitud de presupuesto recibida:');
            console.log('👤 Nombre:', name);
            console.log('📧 Email:', email);
            console.log('📞 Teléfono:', phone || 'No proporcionado');
            console.log('📅 Fecha preferida:', appointment || 'Sin fecha específica');
            console.log('🔧 Servicio:', serviceType);
            console.log('🚨 Urgencia:', urgency);
            console.log('➕ Servicios adicionales:', additionalServices.length > 0 ? additionalServices.join(', ') : 'Ninguno');
            console.log('📱 Preferencia contacto:', contactPref);
            console.log('💬 Mensaje:', message.substring(0, 100) + (message.length > 100 ? '...' : ''));

            showToast('Solicitud enviada correctamente. Te contactaré en menos de 24h.');
            
            // Restablecer formulario (excepto checkbox de newsletter si estaba marcado)
            const newsletterChecked = document.querySelector('input[name="newsletter"]')?.checked;
            contactForm.reset();
            if (newsletterChecked) {
                document.querySelector('input[name="newsletter"]').checked = true;
            }

            // Restaurar botón después de 3 segundos
            setTimeout(() => {
                btnText.textContent = 'Enviar solicitud de presupuesto';
                btnIcon.innerHTML = '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>';
                contactForm.querySelector('button[type="submit"]').disabled = false;
            }, 3000);
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========================================
    // PARALLAX EFFECT ON HERO
    // ========================================
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && !window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.15;
            heroVisual.style.transform = `translateY(${rate}px)`;
        });
    }

    // ========================================
    // MAGNETIC BUTTON EFFECT (Desktop)
    // ========================================
    if (!window.matchMedia('(pointer: coarse)').matches) {
        document.querySelectorAll('.btn-primary, .social-link').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ========================================
    // PREFERS REDUCED MOTION
    // ========================================
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (animationId) cancelAnimationFrame(animationId);
        particles = [];
    }

    // ========================================
    // VISIBILITY API - Pause particles when tab hidden
    // ========================================
    if (canvas) {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationId) cancelAnimationFrame(animationId);
            } else {
                animateParticles();
            }
        });
    }
});
