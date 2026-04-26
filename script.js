/* ========================================
    JUANJOSE - Premium Interactions
    ======================================== */

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('❌ Error global capturado:', e.message, 'en', e.filename, 'línea', e.lineno);
});

try {
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
    // TEST: Verificar que el formulario está funcionando
    // ========================================
    console.log('🧪 Iniciando pruebas del formulario...');
    
    // Verificar que todos los elementos del formulario existen
    const testForm = document.getElementById('contactForm');
    if (testForm) {
        console.log('✅ Formulario encontrado');
        
        // Agregar evento de prueba para verificar clics
        testForm.addEventListener('click', (e) => {
            console.log('🖱️ Click detectado en formulario:', e.target.tagName, e.target.className || e.target.id);
        });
        
        // Probar si el botón de submit está funcionando
        const submitBtn = testForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            console.log('✅ Botón de submit encontrado');
            submitBtn.addEventListener('click', (e) => {
                console.log('🖱️ Click en botón de submit detectado');
            });
        } else {
            console.warn('⚠️ Botón de submit NO encontrado');
        }
    } else {
        console.error('❌ Formulario NO encontrado');
    }
    
    // ========================================
    // INITIALIZE EVERYTHING
    // ========================================
    console.log('✅ JUANJOSE - Premium Interactions loaded');
    });
} catch (error) {
    console.error('❌ Error crítico al cargar las interacciones:', error);
    console.error('Stack trace:', error.stack);
}

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
     // CONTACT FORM - VERSIÓN CORREGIDA
     // ========================================
     const contactForm = document.getElementById('contactForm');
     const btnText = document.getElementById('btnText');
     const btnIcon = document.getElementById('btnIcon');
     const btnSpinner = document.getElementById('btnSpinner');
     const submitBtn = document.getElementById('submitBtn');
     
     // Debug: Verificar que los elementos existen
     console.log('📋 Elementos del formulario (VERSIÓN CORREGIDA):');
     console.log('  • contactForm:', contactForm ? '✅ Encontrado' : '❌ No encontrado');
     console.log('  • btnText:', btnText ? '✅ Encontrado' : '❌ No encontrado');
     console.log('  • btnIcon:', btnIcon ? '✅ Encontrado' : '❌ No encontrado');
     console.log('  • btnSpinner:', btnSpinner ? '✅ Encontrado' : '❌ No encontrado');
     console.log('  • submitBtn (NUEVO):', submitBtn ? '✅ Encontrado' : '❌ No encontrado');

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
             
             // También validar al escribir
             field.addEventListener('input', function() {
                 const isValid = this.value.trim() !== '';
                 markFieldError(fieldId, isValid);
             });
         } else {
             console.warn(`⚠️ Campo obligatorio no encontrado: ${fieldId}`);
         }
     });

// Configurar el formulario de contacto - VERSIÓN SIMPLIFICADA
     if (contactForm) {
         console.log('✅ Formulario encontrado - Configurando eventos SIMPLIFICADOS...');
         
         // Obtener botón de submit (usar ID si existe, si no usar selector)
         let submitButton = submitBtn;
         if (!submitButton) {
             submitButton = contactForm.querySelector('button[type="submit"]');
             if (submitButton) {
                 console.log('✅ Botón encontrado por selector');
                 submitButton.id = 'submitBtnDynamic';
             }
         }
         
         // Agregar evento de submit al formulario (esta es la forma correcta)
         contactForm.addEventListener('submit', async function(e) {
             e.preventDefault();
             console.log('📤 FORMULARIO ENVIADO - VERSIÓN SIMPLIFICADA');
             
             // Validar que tenemos botón
             if (!submitButton) {
                 submitButton = this.querySelector('button[type="submit"]');
             }
             
             // Validar campos básicos
             const name = document.getElementById('name');
             const email = document.getElementById('email');
             const serviceType = document.getElementById('serviceType');
             const message = document.getElementById('message');
             const privacy = document.querySelector('input[name="privacy"]');
             
             if (!name || !email || !serviceType || !message || !privacy) {
                 showToast('Error: Campos del formulario no encontrados');
                 return;
             }
             
             const nameVal = name.value.trim();
             const emailVal = email.value.trim();
             const serviceTypeVal = serviceType.value;
             const messageVal = message.value.trim();
             const privacyAccepted = privacy.checked;
             
             // Validaciones
             if (!nameVal || !emailVal || !serviceTypeVal || !messageVal || !privacyAccepted) {
                 showToast('Por favor completa todos los campos obligatorios (*)');
                 return;
             }
             
             if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                 showToast('Por favor ingresa un email válido');
                 return;
             }
             
             // Cambiar estado del botón si tenemos referencias
             if (btnText && btnIcon && btnSpinner && submitButton) {
                 btnText.textContent = 'Enviando...';
                 btnIcon.style.display = 'none';
                 btnSpinner.style.display = 'block';
                 submitButton.disabled = true;
             } else if (submitButton) {
                 // Versión mínima si no tenemos los elementos adicionales
                 submitButton.textContent = 'Enviando...';
                 submitButton.disabled = true;
             }
             
             // Simular envío
             await new Promise(resolve => setTimeout(resolve, 1500));
             
             // Mostrar éxito
             showToast('¡Solicitud enviada correctamente!');
             
             // Restaurar botón
             if (btnText && btnIcon && btnSpinner && submitButton) {
                 btnText.textContent = '¡Enviado! ✓';
                 btnSpinner.style.display = 'none';
                 btnIcon.style.display = 'block';
                 btnIcon.innerHTML = '<path d="M20 6L9 17l-5-5"/>';
                 
                 setTimeout(() => {
                     btnText.textContent = 'Enviar solicitud de presupuesto';
                     btnIcon.innerHTML = '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>';
                     submitButton.disabled = false;
                 }, 2000);
             } else if (submitButton) {
                 submitButton.textContent = '¡Enviado!';
                 setTimeout(() => {
                     submitButton.textContent = 'Enviar solicitud de presupuesto';
                     submitButton.disabled = false;
                 }, 2000);
             }
             
             // Restablecer formulario
             try {
                 this.reset();
                 console.log('✅ Formulario restablecido');
             } catch (err) {
                 console.error('Error al restablecer:', err);
             }
         });
         
         console.log('✅ Evento submit configurado correctamente');
     } else {
         console.warn('⚠️ Formulario de contacto no encontrado en esta página');
     }
         

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
