/* ========================================
    JUANJOSE - Interacciones Premium
    ======================================== */

// Control de errores global - por si algo petardea
window.addEventListener('error', (e) => {
    console.error('❌ Petada detectada:', e.message, 'en', e.filename, 'línea', e.lineno);
});

// Esperamos a que el DOM esté listo, que si no hay Pseudopol
document.addEventListener('DOMContentLoaded', () => {
    try {
        // ========================================
        // FONDO DE PARTÍCULAS (que queda chulo)
        // ========================================
        const canvas = document.getElementById('particleCanvas');
        let ctx, particles = [], animationId, isDark;

        if (canvas) {
            ctx = canvas.getContext('2d');
            // Miramos si está en modo oscuro o no
            isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            // Ajustamos el tamaño del canvas al viewport
            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            // Clase para cada partícula - básicamente puntos que se mueven
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
                    // Movimiento aleatorio
                    this.x += this.speedX;
                    this.y += this.speedY;
                    
                    // Rebote en los bordes (que no se escapen)
                    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                    
                    // Cada tanto reseteamos una partícula (para que no sea siempre lo mismo)
                    if (Math.random() < 0.005) this.reset();
                }
                draw() {
                    ctx.globalAlpha = this.opacity;
                    // Blanco para modo oscuro, azul para claro
                    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(99,102,241,0.8)';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Creamos 50 partículas para que el fondo no se vea vacío
            function initParticles() {
                particles = [];
                for (let i = 0; i < 50; i++) {
                    particles.push(new Particle());
                }
            }
            initParticles();

            // Función que anima todo (el bucle principal)
            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });
                
                // Conectamos las partículas cercanas (queda pro)
                ctx.globalAlpha = 0.2;
                ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(99,102,241,0.3)';
                ctx.lineWidth = 0.5;
                
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        // Si están cerca, las unimos con una línea
                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
                
                animationId = requestAnimationFrame(animateParticles);
            }

            // Solo animamos si el canvas está visible (para no gastar recursos tontamente)
            const particleObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateParticles();
                    } else {
                        if (animationId) cancelAnimationFrame(animationId);
                    }
                });
            }, { threshold: 0.1 });
            particleObserver.observe(canvas);
        }

        // ========================================
        // CAMBIO DE TEMA (CLARO/OSCURO)
        // ========================================
        const themeSwitch = document.getElementById('themeSwitch');
        if (themeSwitch) {
            // Recuperamos lo que guardó el tío en localStorage
            const savedTheme = localStorage.getItem('theme') || 'light';
            
            if (savedTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeSwitch.checked = true;
            }

            themeSwitch.addEventListener('change', () => {
                const isDark = themeSwitch.checked;
                document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                
                // Si hay canvas, actualizamos los colores de las partículas
                if (canvas) {
                    isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animateParticles();
                    }
                }
            });
        }

        // ========================================
        // MENÚ MÓVIL (el típico botón hamburguesa)
        // ========================================
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('open');
                const spans = mobileToggle.querySelectorAll('span');
                
                // Animamos las rayitas del botón hamburguesa a una X
                if (navLinks.classList.contains('open')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    // Volvemos a la normalidad
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });

            // Cerramos el menú al hacer clic en un enlace (comportamiento normal)
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
        // SCROLL SUAVE (para los enlaces internos)
        // ========================================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // ========================================
        // VALIDACIÓN DEL FORMULARIO DE CONTACTO
        // ========================================
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                // Desactivamos el botón para que no le den mil veces
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
                
                try {
                    // Mandamos el formulario a Formspree (servicio gratuito)
                    const response = await fetch('https://formspree.io/f/xdoqyjbg', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        showToast('✅ Mensaje enviado correctamente');
                        contactForm.reset();
                    } else {
                        throw new Error('Error en el servidor');
                    }
                } catch (error) {
                    showToast('❌ Error al enviar el mensaje');
                    console.error('Error:', error);
                } finally {
                    // Reactivamos el botón pase lo que pase
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        }

        // Función para mostrar toasts (esos mensajitos que aparecen y desaparecen)
        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--accent);
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(toast);
            
            // Lo quitamos después de 3 segundos
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // ========================================
        // CONTADORES ANIMADOS (los números que suben)
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

        // Animación para los números (va subiendo poco a poco)
        function animateCounter(el, target) {
            const duration = 2000; // 2 segundos
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Efecto easeOutQuart para que vaya más rápido al principio
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                el.textContent = current + (target >= 100 ? '+' : '');
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target + (target >= 100 ? '+' : '');
            }
            requestAnimationFrame(update);
        }

        // ========================================
        // ANIMACIÓN DE LA LÍNEA DE TIEMPO (PROCESO)
        // ========================================
        const timelineProgress = document.querySelector('.timeline-progress');
        const steps = document.querySelectorAll('.step');
        const timelineSection = document.querySelector('.process-timeline');

        if (timelineSection && timelineProgress && steps.length) {
            const timelineObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animamos la barra de progreso
                        setTimeout(() => { timelineProgress.style.width = '100%'; }, 300);
                        // Los pasos aparecen uno detrás de otro
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
        // CALCULADORA DE PRESUPUESTOS (LO IMPORTANTE)
        // ========================================
        const calcCheckboxes = document.querySelectorAll('.calc-option input[type="checkbox"]');
        const urgencyRadios = document.querySelectorAll('input[name="urgency"]');
        const totalElement = document.getElementById('totalPrice');
        const btnBudget = document.getElementById('btnBudget');

        if (calcCheckboxes.length && totalElement && btnBudget) {
            let total = 0;
            let urgencyFee = 0;
            
            // Función para actualizar la tarifa de urgencia
            function updateUrgencyFee() {
                const selectedUrgency = document.querySelector('input[name="urgency"]:checked');
                if (selectedUrgency) {
                    urgencyFee = parseInt(selectedUrgency.value) || 0;
                }
                updateTotal();
            }
            
            // Función principal que actualiza el total
            function updateTotal() {
                total = 0;
                // Sumamos los servicios marcados
                calcCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        total += parseInt(checkbox.dataset.price);
                    }
                });
                
                // Miramos qué nivel de urgencia ha elegido el cliente
                const selectedUrgency = document.querySelector('input[name="urgency"]:checked');
                if (selectedUrgency) {
                    urgencyFee = parseInt(selectedUrgency.value) || 0;
                }
                
                // Total final sumando urgencia
                const totalWithUrgency = total + urgencyFee;
                totalElement.textContent = totalWithUrgency + '€';
                
                // Si hay urgencia, mostramos el desglose
                if (urgencyFee > 0 && total > 0) {
                    const breakdown = document.getElementById('urgencyBreakdown');
                    if (!breakdown) {
                        const breakdownEl = document.createElement('div');
                        breakdownEl.id = 'urgencyBreakdown';
                        breakdownEl.className = 'urgency-fee-breakdown';
                        breakdownEl.innerHTML = `<small>Servicios: ${total}€ + Urgencia: +${urgencyFee}€ = ${totalWithUrgency}€</small>`;
                        totalElement.parentElement.appendChild(breakdownEl);
                    } else {
                        breakdown.innerHTML = `<small>Servicios: ${total}€ + Urgencia: +${urgencyFee}€ = ${totalWithUrgency}€</small>`;
                    }
                } else {
                    // Si no hay urgencia o no hay servicios, quitamos el desglose
                    const breakdown = document.getElementById('urgencyBreakdown');
                    if (breakdown) breakdown.remove();
                }
                
                // Actualizamos el enlace para pedir presupuesto
                const selectedServices = Array.from(calcCheckboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.dataset.name)
                    .join(', ');
                
                // Determinamos el nivel de urgencia para el enlace
                const urgencyLevel = selectedUrgency ? 
                    (urgencyFee === 15 ? 'urgent' : urgencyFee === 30 ? 'emergency' : 'normal') : 'normal';
                
                btnBudget.href = `contacto.html?presupuesto=${encodeURIComponent(selectedServices)}&total=${totalWithUrgency}&urgency=${urgencyLevel}`;
            }

            // Escuchamos cambios en los checkboxes de servicios
            calcCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateTotal);
            });
            
            // Y también en los radios de urgencia
            if (urgencyRadios.length) {
                urgencyRadios.forEach(radio => {
                    radio.addEventListener('change', updateTotal);
                });
            }

            // Botones de "Añadir al presupuesto" (los que están en las tarjetas)
            document.querySelectorAll('.add-service-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const serviceId = btn.dataset.service;
                    // Buscamos el checkbox correspondiente a este servicio
                    const checkbox = Array.from(calcCheckboxes).find(cb => 
                        cb.parentElement.querySelector('.service-name')?.textContent.includes(serviceId)
                    );
                    
                    if (checkbox) {
                        // Marcamos o desmarcamos el checkbox
                        checkbox.checked = !checkbox.checked;
                        btn.textContent = checkbox.checked ? '✓ Añadido' : 'Añadir al presupuesto';
                        btn.classList.toggle('added', checkbox.checked);
                        showToast(checkbox.checked ? 'Servicio añadido al presupuesto' : 'Servicio eliminado');
                        updateTotal();
                    }
                });
            });

            // Cálculo inicial (por si acaso)
            updateTotal();
        }

        // ========================================
        // LAZY LOADING DE IMÁGENES (para que cargue más rápido)
        // ========================================
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            }, { threshold: 0.1 });

            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // ========================================
        // EFECTO SCROLL EN EL HEADER (que se ponga chulo al bajar)
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
        // CARRUSEL DE TESTIMONIOS (opiniones de clientes)
        // ========================================
        const testimonialWrapper = document.querySelector('.testimonial-wrapper');
        const testimonials = document.querySelectorAll('.testimonial');
        
        if (testimonialWrapper && testimonials.length > 1) {
            let currentIndex = 0;
            
            function showTestimonial(index) {
                testimonialWrapper.style.transform = `translateX(-${index * 100}%)`;
            }
            
            // Cambiamos de testimonio cada 5 segundos
            setInterval(() => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            }, 5000);
        }

        // ========================================
        // EFECTO HOVER EN LAS TARJETAS DE SERVICIOS
        // ========================================
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'none';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            });
        });

        // ========================================
        // TODO LISTO - SCRIPT CARGADO
        // ========================================
        console.log('✅ JUANJOSE - Todas las interacciones cargadas y funcionando');

    } catch (error) {
        console.error('❌ Error crítico al cargar las interacciones:', error);
        console.error('Stack trace:', error.stack);
    }
});