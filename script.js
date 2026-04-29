/* ========================================
    JUANJOSE - Premium Interactions
    ======================================== */

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('❌ Error global capturado:', e.message, 'en', e.filename, 'línea', e.lineno);
});

document.addEventListener('DOMContentLoaded', () => {
    try {
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
                    
                    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                    
                    if (Math.random() < 0.005) this.reset();
                }
                draw() {
                    ctx.globalAlpha = this.opacity;
                    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(99,102,241,0.8)';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            function initParticles() {
                particles = [];
                for (let i = 0; i < 50; i++) {
                    particles.push(new Particle());
                }
            }
            initParticles();

            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });
                
                // Connect particles
                ctx.globalAlpha = 0.2;
                ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(99,102,241,0.3)';
                ctx.lineWidth = 0.5;
                
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
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
        // THEME SWITCHER
        // ========================================
        const themeSwitch = document.getElementById('themeSwitch');
        if (themeSwitch) {
            const savedTheme = localStorage.getItem('theme') || 'light';
            
            if (savedTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeSwitch.checked = true;
            }

            themeSwitch.addEventListener('change', () => {
                const isDark = themeSwitch.checked;
                document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                
                if (canvas) {
                    // Update particle colors when theme changes
                    isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animateParticles();
                    }
                }
            });
        }

        // ========================================
        // MOBILE MENU
        // ========================================
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('open');
                const spans = mobileToggle.querySelectorAll('span');
                
                if (navLinks.classList.contains('open')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });

            // Close menu when clicking links
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
        // SMOOTH SCROLLING
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
        // FORM VALIDATION
        // ========================================
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
                
                try {
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
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        }

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
            
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
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
        // PRICE CALCULATOR
        // ========================================
        const calcCheckboxes = document.querySelectorAll('.calc-option input[type="checkbox"]');
        const urgencyRadios = document.querySelectorAll('input[name="urgency"]');
        const totalElement = document.getElementById('totalPrice');
        const btnBudget = document.getElementById('btnBudget');

        if (calcCheckboxes.length && totalElement && btnBudget) {
            let total = 0;
            let urgencyFee = 0;
            
            function updateUrgencyFee() {
                const selectedUrgency = document.querySelector('input[name="urgency"]:checked');
                if (selectedUrgency) {
                    urgencyFee = parseInt(selectedUrgency.value) || 0;
                }
                updateTotal();
            }
            
            function updateTotal() {
                total = 0;
                calcCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        total += parseInt(checkbox.dataset.price);
                    }
                });
                
                const selectedUrgency = document.querySelector('input[name="urgency"]:checked');
                if (selectedUrgency) {
                    urgencyFee = parseInt(selectedUrgency.value) || 0;
                }
                
                const totalWithUrgency = total + urgencyFee;
                totalElement.textContent = totalWithUrgency + '€';
                
                // Show urgency fee breakdown if not normal
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
                    const breakdown = document.getElementById('urgencyBreakdown');
                    if (breakdown) breakdown.remove();
                }
                
                // Update budget button URL
                const selectedServices = Array.from(calcCheckboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.dataset.name)
                    .join(', ');
                
                const urgencyLevel = selectedUrgency ? 
                    (urgencyFee === 15 ? 'urgent' : urgencyFee === 30 ? 'emergency' : 'normal') : 'normal';
                
                btnBudget.href = `contacto.html?presupuesto=${encodeURIComponent(selectedServices)}&total=${totalWithUrgency}&urgency=${urgencyLevel}`;
            }

            calcCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateTotal);
            });
            
            if (urgencyRadios.length) {
                urgencyRadios.forEach(radio => {
                    radio.addEventListener('change', updateTotal);
                });
            }

            // Add/remove service buttons
            document.querySelectorAll('.add-service-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const serviceId = btn.dataset.service;
                    const checkbox = Array.from(calcCheckboxes).find(cb => 
                        cb.parentElement.querySelector('.service-name')?.textContent.includes(serviceId)
                    );
                    
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        btn.textContent = checkbox.checked ? '✓ Añadido' : 'Añadir al presupuesto';
                        btn.classList.toggle('added', checkbox.checked);
                        showToast(checkbox.checked ? 'Servicio añadido al presupuesto' : 'Servicio eliminado');
                        updateTotal();
                    }
                });
            });

            updateTotal(); // Initial calculation
        }

        // ========================================
        // LAZY LOADING IMAGES
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
        // TESTIMONIALS CAROUSEL
        // ========================================
        const testimonialWrapper = document.querySelector('.testimonial-wrapper');
        const testimonials = document.querySelectorAll('.testimonial');
        
        if (testimonialWrapper && testimonials.length > 1) {
            let currentIndex = 0;
            
            function showTestimonial(index) {
                testimonialWrapper.style.transform = `translateX(-${index * 100}%)`;
            }
            
            // Auto-rotate testimonials
            setInterval(() => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            }, 5000);
        }

        // ========================================
        // SERVICE CARDS HOVER EFFECT
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
        // INITIALIZE EVERYTHING
        // ========================================
        console.log('✅ JUANJOSE - Premium Interactions loaded');

    } catch (error) {
        console.error('❌ Error crítico al cargar las interacciones:', error);
        console.error('Stack trace:', error.stack);
    }
});