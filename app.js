/**
 * TEMGUARD - Xanthorrhizol Biofilm Defense System
 * Interactive JavaScript Application
 */

// ===========================
// Utility Functions
// ===========================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// ===========================
// Loading Screen
// ===========================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = $('#loading-screen');
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
            initAllModules();
        }, 800);
    }, 2500);
});

function initAllModules() {
    initLucideIcons();
    initParticleSystem();
    initNavigation();
    initMoleculeViewer();
    initMechanismDiagram();
    initBiofilmSimulator();
    initCountUpAnimations();
    initEffectivenessAnimations();
    initExpiryCalculator();
    initDegradationChart();
    initScrollAnimations();
    initThermometerAnimation();
}

// ===========================
// Lucide Icons Init
// ===========================
function initLucideIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

// ===========================
// Particle Background System
// ===========================
function initParticleSystem() {
    const canvas = $('#particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = randomRange(0, canvas.width);
            this.y = randomRange(0, canvas.height);
            this.size = randomRange(1, 3);
            this.speedX = randomRange(-0.3, 0.3);
            this.speedY = randomRange(-0.3, 0.3);
            this.opacity = randomRange(0.1, 0.4);
            this.hue = randomRange(25, 45);
            this.life = randomRange(100, 400);
            this.maxLife = this.life;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;

            // Mouse attraction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.speedX += dx * 0.00005;
                this.speedY += dy * 0.00005;
            }

            if (this.life <= 0 || this.x < -10 || this.x > canvas.width + 10 ||
                this.y < -10 || this.y > canvas.height + 10) {
                this.reset();
            }
        }

        draw() {
            const alpha = this.opacity * (this.life / this.maxLife);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 60%, 55%, ${alpha})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(35, 60%, 50%, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();
}

// ===========================
// Navigation
// ===========================
function initNavigation() {
    const navbar = $('#navbar');
    const navToggle = $('#nav-toggle');
    const navLinks = $('#nav-links');
    const links = $$('.nav-link');

    // Scroll handling
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active link
        const sections = $$('section[id]');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                links.forEach(link => link.classList.remove('active'));
                const activeLink = $(`.nav-link[data-section="${section.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });

        lastScroll = currentScroll;
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===========================
// 3D Molecule Viewer (Canvas)
// ===========================
function initMoleculeViewer() {
    const canvas = $('#molecule-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    function resize() {
        canvas.width = container.clientWidth * 2;
        canvas.height = container.clientHeight * 2;
        ctx.scale(2, 2);
    }
    resize();

    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    // Xanthorrhizol-inspired molecule structure
    const atoms = [];
    const bonds = [];
    let time = 0;

    // Generate molecule structure (stylized)
    const ringCount = 6;
    const ringRadius = 50;
    
    // Benzene ring
    for (let i = 0; i < ringCount; i++) {
        const angle = (i / ringCount) * Math.PI * 2 - Math.PI / 2;
        atoms.push({
            x: Math.cos(angle) * ringRadius,
            y: Math.sin(angle) * ringRadius,
            z: randomRange(-10, 10),
            type: 'C',
            size: 6,
            color: '#c4853d'
        });
    }

    // Side chain
    const sideChainAtoms = [
        { x: ringRadius + 30, y: -20, z: 5, type: 'C', size: 5, color: '#c4853d' },
        { x: ringRadius + 60, y: -10, z: -5, type: 'C', size: 5, color: '#c4853d' },
        { x: ringRadius + 90, y: -25, z: 10, type: 'C', size: 5, color: '#c4853d' },
        { x: ringRadius + 110, y: -5, z: -8, type: 'C', size: 5, color: '#c4853d' },
        { x: ringRadius + 130, y: -30, z: 5, type: 'CH3', size: 4, color: '#d4a05a' },
        { x: ringRadius + 140, y: 15, z: -3, type: 'CH3', size: 4, color: '#d4a05a' },
    ];
    atoms.push(...sideChainAtoms);

    // OH group
    atoms.push({
        x: -ringRadius - 25, y: 10, z: 0,
        type: 'OH', size: 7, color: '#ef4444'
    });

    // Methyl groups on ring
    atoms.push(
        { x: -20, y: -ringRadius - 25, z: 5, type: 'CH3', size: 4, color: '#d4a05a' },
        { x: 30, y: ringRadius + 20, z: -5, type: 'CH3', size: 4, color: '#d4a05a' }
    );

    // Create bonds
    for (let i = 0; i < ringCount; i++) {
        bonds.push([i, (i + 1) % ringCount]);
    }
    bonds.push([2, 6], [6, 7], [7, 8], [8, 9], [9, 10], [9, 11]);
    bonds.push([5, 12]);
    bonds.push([0, 13], [3, 14]);

    let mouseX = centerX, mouseY = centerY;
    
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    function render() {
        ctx.clearRect(0, 0, width, height);
        time += 0.01;

        const rotX = (mouseY - centerY) * 0.003;
        const rotY = (mouseX - centerX) * 0.003 + time * 0.5;

        // Transform atoms
        const projected = atoms.map(atom => {
            let x = atom.x;
            let y = atom.y;
            let z = atom.z;

            // Rotate Y
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const nx = x * cosY - z * sinY;
            const nz = x * sinY + z * cosY;
            x = nx;
            z = nz;

            // Rotate X
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);
            const ny = y * cosX - z * sinX;
            z = y * sinX + z * cosX;
            y = ny;

            const scale = 200 / (200 + z);
            return {
                x: centerX + x * scale,
                y: centerY + y * scale,
                z: z,
                scale: scale,
                type: atom.type,
                size: atom.size * scale,
                color: atom.color
            };
        });

        // Draw bonds
        bonds.forEach(([a, b]) => {
            if (a < projected.length && b < projected.length) {
                const pa = projected[a];
                const pb = projected[b];
                const avgZ = (pa.z + pb.z) / 2;
                const alpha = clamp(0.2 + (avgZ + 50) / 100, 0.1, 0.8);

                ctx.beginPath();
                ctx.moveTo(pa.x, pa.y);
                ctx.lineTo(pb.x, pb.y);
                ctx.strokeStyle = `rgba(196, 133, 61, ${alpha})`;
                ctx.lineWidth = 2 * ((pa.scale + pb.scale) / 2);
                ctx.stroke();
            }
        });

        // Sort by z for depth ordering
        const sorted = [...projected].sort((a, b) => a.z - b.z);

        // Draw atoms
        sorted.forEach(atom => {
            const alpha = clamp(0.4 + (atom.z + 50) / 100, 0.2, 1);
            
            // Glow
            const gradient = ctx.createRadialGradient(
                atom.x, atom.y, 0,
                atom.x, atom.y, atom.size * 3
            );
            gradient.addColorStop(0, `rgba(245, 185, 66, ${alpha * 0.3})`);
            gradient.addColorStop(1, 'rgba(245, 185, 66, 0)');
            ctx.beginPath();
            ctx.arc(atom.x, atom.y, atom.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Atom body
            ctx.beginPath();
            ctx.arc(atom.x, atom.y, atom.size, 0, Math.PI * 2);
            ctx.fillStyle = atom.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Highlight
            ctx.beginPath();
            ctx.arc(atom.x - atom.size * 0.3, atom.y - atom.size * 0.3, atom.size * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
            ctx.fill();
        });

        requestAnimationFrame(render);
    }

    render();
}

// ===========================
// Mechanism Diagram Interaction
// ===========================
function initMechanismDiagram() {
    const nodes = $$('.diagram-node');
    const details = $$('.detail-card');

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            const mechanism = node.dataset.mechanism;

            // Update active node
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            // Show corresponding detail
            details.forEach(d => d.classList.remove('active'));
            const targetDetail = $(`.detail-card[data-mechanism="${mechanism}"]`);
            if (targetDetail) {
                targetDetail.classList.add('active');
            }
        });
    });

    // Auto-cycle through mechanisms
    let currentIndex = 0;
    const mechanismKeys = ['wall', 'membrane', 'enzyme', 'adhesion', 'efflux'];

    setInterval(() => {
        const activeNode = $('.diagram-node.active');
        if (activeNode && activeNode.matches(':hover')) return;

        currentIndex = (currentIndex + 1) % mechanismKeys.length;
        const key = mechanismKeys[currentIndex];

        nodes.forEach(n => n.classList.remove('active'));
        details.forEach(d => d.classList.remove('active'));

        const targetNode = $(`.diagram-node[data-mechanism="${key}"]`);
        const targetDetail = $(`.detail-card[data-mechanism="${key}"]`);

        if (targetNode) targetNode.classList.add('active');
        if (targetDetail) targetDetail.classList.add('active');
    }, 6000);
}

// ===========================
// Biofilm Simulator
// ===========================
function initBiofilmSimulator() {
    const canvas = $('#biofilm-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    function resize() {
        canvas.width = container.clientWidth * 2;
        canvas.height = container.clientHeight * 2;
    }
    resize();
    window.addEventListener('resize', resize);

    let bacteria = [];
    let xanthorrhizolParticles = [];
    let concentration = 0;
    let exposureTime = 0;
    let isSimulating = false;
    let simProgress = 0;

    class Bacterium {
        constructor() {
            this.x = randomRange(50, canvas.width - 50);
            this.y = randomRange(50, canvas.height - 50);
            this.width = randomRange(16, 28);
            this.height = randomRange(8, 14);
            this.angle = randomRange(0, Math.PI * 2);
            this.health = 1;
            this.biofilmStrength = 1;
            this.wobble = randomRange(0, Math.PI * 2);
            this.wobbleSpeed = randomRange(0.01, 0.03);
            this.vx = randomRange(-0.3, 0.3);
            this.vy = randomRange(-0.3, 0.3);
            this.alive = true;
            this.deathTimer = 0;
        }

        update(concentration, time) {
            this.wobble += this.wobbleSpeed;

            if (this.alive) {
                this.x += this.vx + Math.sin(this.wobble) * 0.5;
                this.y += this.vy + Math.cos(this.wobble) * 0.3;

                // Bounce off walls
                if (this.x < 20 || this.x > canvas.width - 20) this.vx *= -1;
                if (this.y < 20 || this.y > canvas.height - 20) this.vy *= -1;

                // Apply xanthorrhizol damage
                if (concentration > 0) {
                    const damage = (concentration / 100) * (time / 100) * 0.002;
                    this.health -= damage;
                    this.biofilmStrength -= damage * 1.5;

                    if (this.health <= 0) {
                        this.alive = false;
                        this.health = 0;
                    }
                }
            } else {
                this.deathTimer += 0.02;
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle + Math.sin(this.wobble) * 0.1);

            if (this.alive) {
                // Biofilm layer (EPS matrix)
                if (this.biofilmStrength > 0) {
                    ctx.beginPath();
                    const bfSize = this.width * (1 + this.biofilmStrength * 0.8);
                    ctx.ellipse(0, 0, bfSize, bfSize * 0.6, 0, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(139, 84, 39, ${this.biofilmStrength * 0.25})`;
                    ctx.fill();
                }

                // Cell body
                const healthColor = this.health > 0.5 
                    ? `rgba(${180 - this.health * 50}, ${140 + this.health * 40}, ${60}, ${0.7 + this.health * 0.3})`
                    : `rgba(${200}, ${80 + this.health * 80}, ${40}, ${0.5 + this.health * 0.3})`;

                ctx.beginPath();
                ctx.ellipse(0, 0, this.width, this.height, 0, 0, Math.PI * 2);
                ctx.fillStyle = healthColor;
                ctx.fill();
                ctx.strokeStyle = `rgba(196, 133, 61, ${0.3 + this.health * 0.4})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Nucleus
                ctx.beginPath();
                ctx.arc(0, 0, this.height * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(245, 185, 66, ${this.health * 0.5})`;
                ctx.fill();
            } else {
                // Dead cell - fragments
                const fade = Math.max(0, 1 - this.deathTimer);
                ctx.globalAlpha = fade;

                for (let i = 0; i < 5; i++) {
                    const fragAngle = (i / 5) * Math.PI * 2 + this.deathTimer * 2;
                    const fragDist = this.deathTimer * 20;
                    const fx = Math.cos(fragAngle) * fragDist;
                    const fy = Math.sin(fragAngle) * fragDist;

                    ctx.beginPath();
                    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(139, 84, 39, 0.5)';
                    ctx.fill();
                }

                ctx.globalAlpha = 1;
            }

            ctx.restore();
        }
    }

    class XanthorrhizolParticle {
        constructor() {
            this.x = randomRange(0, canvas.width);
            this.y = -10;
            this.size = randomRange(3, 6);
            this.speed = randomRange(1, 3);
            this.opacity = randomRange(0.3, 0.7);
            this.wobble = randomRange(0, Math.PI * 2);
        }

        update() {
            this.y += this.speed;
            this.x += Math.sin(this.wobble) * 0.5;
            this.wobble += 0.02;

            if (this.y > canvas.height + 10) {
                this.y = -10;
                this.x = randomRange(0, canvas.width);
            }
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2
            );
            gradient.addColorStop(0, `rgba(245, 185, 66, ${this.opacity})`);
            gradient.addColorStop(1, `rgba(245, 185, 66, 0)`);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 220, 100, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Initialize bacteria
    function initBacteria() {
        bacteria = [];
        for (let i = 0; i < 40; i++) {
            bacteria.push(new Bacterium());
        }
        xanthorrhizolParticles = [];
    }

    initBacteria();

    // Controls
    const concSlider = $('#concentration-slider');
    const timeSlider = $('#time-slider');
    const simBtn = $('#simulate-btn');
    const resetBtn = $('#reset-btn');
    const stageLabel = $('#simulator-stage');

    if (concSlider) {
        concSlider.addEventListener('input', (e) => {
            concentration = parseInt(e.target.value);
        });
    }

    if (timeSlider) {
        timeSlider.addEventListener('input', (e) => {
            exposureTime = parseInt(e.target.value);
        });
    }

    if (simBtn) {
        simBtn.addEventListener('click', () => {
            isSimulating = true;
            concentration = parseInt(concSlider.value);
            exposureTime = parseInt(timeSlider.value);
            simProgress = 0;

            // Add xanthorrhizol particles
            xanthorrhizolParticles = [];
            const particleCount = Math.floor(concentration / 2);
            for (let i = 0; i < particleCount; i++) {
                const p = new XanthorrhizolParticle();
                p.y = randomRange(0, canvas.height);
                xanthorrhizolParticles.push(p);
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            isSimulating = false;
            concentration = 0;
            exposureTime = 0;
            simProgress = 0;
            concSlider.value = 0;
            timeSlider.value = 0;
            initBacteria();
            stageLabel.textContent = 'Tahap 1: Biofilm Utuh';
        });
    }

    function updateStageLabel() {
        const aliveCount = bacteria.filter(b => b.alive).length;
        const ratio = aliveCount / bacteria.length;

        if (ratio > 0.8) {
            stageLabel.textContent = 'Tahap 1: Biofilm Utuh';
        } else if (ratio > 0.5) {
            stageLabel.textContent = 'Tahap 2: Disrupsi Membran';
        } else if (ratio > 0.2) {
            stageLabel.textContent = 'Tahap 3: Degradasi Biofilm';
        } else {
            stageLabel.textContent = 'Tahap 4: Biofilm Tereliminasi ✓';
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, '#1a110a');
        bgGrad.addColorStop(1, '#231710');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid pattern
        ctx.strokeStyle = 'rgba(196, 133, 61, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Update and draw xanthorrhizol particles
        xanthorrhizolParticles.forEach(p => {
            p.update();
            p.draw(ctx);
        });

        // Update and draw bacteria
        bacteria.forEach(b => {
            if (isSimulating) {
                b.update(concentration, exposureTime);
            }
            b.draw(ctx);
        });

        // Remove completely dead bacteria
        bacteria = bacteria.filter(b => b.alive || b.deathTimer < 2);

        if (isSimulating) {
            updateStageLabel();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// ===========================
// Count-Up Animations
// ===========================
function initCountUpAnimations() {
    const counters = $$('.stat-number, .rs-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const isDecimal = target % 1 !== 0;
                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = target * eased;

                    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = isDecimal ? target.toFixed(1) : target;
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===========================
// Effectiveness Bar Animations
// ===========================
function initEffectivenessAnimations() {
    const bars = $$('.eff-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.dataset.width;
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 300);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
}

// ===========================
// Expiry Calculator
// ===========================
function initExpiryCalculator() {
    const calcBtn = $('#calculate-expiry');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', () => {
        const prodDate = $('#production-date').value;
        const temp = parseInt($('#storage-temp').value);
        const container = $('#container-type').value;

        if (!prodDate) {
            alert('Silakan masukkan tanggal produksi.');
            return;
        }

        // Shelf life multipliers
        const tempMultiplier = {
            4: 1,      // Baseline: 24 months at 4°C
            25: 0.5,   // 12 months
            37: 0.25,  // 6 months
            45: 0.08   // ~2 months
        };

        const containerMultiplier = {
            amber: 1,
            clear: 0.8,
            plastic: 0.6,
            open: 0.2
        };

        const baseShelfLifeMonths = 24; // months at ideal conditions
        const shelfLifeMonths = Math.round(baseShelfLifeMonths * tempMultiplier[temp] * containerMultiplier[container]);
        const shelfLifeDays = shelfLifeMonths * 30;

        const productionDate = new Date(prodDate);
        const expiryDate = new Date(productionDate);
        expiryDate.setMonth(expiryDate.getMonth() + shelfLifeMonths);

        const today = new Date();
        const remainingDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        const totalDays = Math.ceil((expiryDate - productionDate) / (1000 * 60 * 60 * 24));
        const elapsedDays = totalDays - remainingDays;
        const progressPercent = clamp((elapsedDays / totalDays) * 100, 0, 100);

        // Display results
        const resultCard = $('#expiry-result');
        resultCard.style.display = 'block';

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        $('#result-date').textContent = expiryDate.toLocaleDateString('id-ID', options);
        $('#result-shelf-life').textContent = `${shelfLifeMonths} bulan (${shelfLifeDays} hari)`;

        if (remainingDays > 0) {
            $('#result-remaining').textContent = `${remainingDays} hari`;
            $('#result-remaining').style.color = remainingDays > 90 ? '#22c55e' : remainingDays > 30 ? '#f59e0b' : '#ef4444';
        } else {
            $('#result-remaining').textContent = 'KADALUWARSA';
            $('#result-remaining').style.color = '#ef4444';
        }

        let status, statusColor;
        if (remainingDays > 180) {
            status = '✅ Aman Digunakan';
            statusColor = '#22c55e';
        } else if (remainingDays > 60) {
            status = '⚠️ Segera Gunakan';
            statusColor = '#f59e0b';
        } else if (remainingDays > 0) {
            status = '🔴 Hampir Kadaluwarsa';
            statusColor = '#f97316';
        } else {
            status = '❌ KADALUWARSA — Jangan Gunakan';
            statusColor = '#ef4444';
        }

        $('#result-status').textContent = status;
        $('#result-status').style.color = statusColor;

        // Progress bar
        setTimeout(() => {
            $('#progress-fill').style.width = progressPercent + '%';
        }, 300);

        // Smooth scroll to result
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// ===========================
// Degradation Chart (Custom Canvas)
// ===========================
function initDegradationChart() {
    const canvas = $('#degradation-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    function resize() {
        canvas.width = container.clientWidth * 2;
        canvas.height = container.clientHeight * 2;
    }
    resize();

    const width = container.clientWidth;
    const height = container.clientHeight;

    const padding = { top: 40, right: 30, bottom: 50, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Data: Efficacy (%) over months at different temperatures
    const datasets = [
        {
            label: '4°C (Ideal)',
            color: '#22c55e',
            data: [100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88]
        },
        {
            label: '25°C (Ruang)',
            color: '#f59e0b',
            data: [100, 95, 88, 80, 72, 65, 58, 50, 43, 36, 30, 25, 20]
        },
        {
            label: '37°C (Tubuh)',
            color: '#f97316',
            data: [100, 85, 70, 55, 40, 28, 18, 12, 8, 5, 3, 2, 1]
        },
        {
            label: '45°C (Tinggi)',
            color: '#ef4444',
            data: [100, 60, 35, 15, 5, 2, 1, 0, 0, 0, 0, 0, 0]
        }
    ];

    let animProgress = 0;
    let animating = false;

    function drawChart() {
        ctx.save();
        ctx.scale(2, 2);
        ctx.clearRect(0, 0, width, height);

        // Background
        ctx.fillStyle = 'rgba(26, 17, 10, 0.3)';
        ctx.fillRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = 'rgba(196, 133, 61, 0.1)';
        ctx.lineWidth = 0.5;

        for (let i = 0; i <= 10; i++) {
            const y = padding.top + (chartHeight / 10) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();

            // Y-axis labels
            ctx.fillStyle = 'rgba(160, 120, 80, 0.8)';
            ctx.font = '10px Inter';
            ctx.textAlign = 'right';
            ctx.fillText((100 - i * 10) + '%', padding.left - 10, y + 3);
        }

        // X-axis labels
        for (let i = 0; i <= 12; i++) {
            const x = padding.left + (chartWidth / 12) * i;
            ctx.fillStyle = 'rgba(160, 120, 80, 0.8)';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(i + ' bln', x, height - padding.bottom + 20);

            ctx.strokeStyle = 'rgba(196, 133, 61, 0.05)';
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + chartHeight);
            ctx.stroke();
        }

        // Axis labels
        ctx.fillStyle = 'rgba(212, 168, 120, 0.9)';
        ctx.font = '11px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('Waktu (Bulan)', width / 2, height - 5);

        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Efektivitas (%)', 0, 0);
        ctx.restore();

        // Draw data lines
        datasets.forEach((dataset, dIdx) => {
            const pointsToDraw = Math.min(
                dataset.data.length,
                Math.floor(animProgress * dataset.data.length)
            );

            if (pointsToDraw < 2) return;

            ctx.beginPath();
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            for (let i = 0; i < pointsToDraw; i++) {
                const x = padding.left + (chartWidth / 12) * i;
                const y = padding.top + chartHeight * (1 - dataset.data[i] / 100);

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Fill area
            ctx.lineTo(
                padding.left + (chartWidth / 12) * (pointsToDraw - 1),
                padding.top + chartHeight
            );
            ctx.lineTo(padding.left, padding.top + chartHeight);
            ctx.closePath();
            ctx.fillStyle = dataset.color.replace(')', ', 0.05)').replace('rgb', 'rgba');
            ctx.fill();

            // Draw points
            for (let i = 0; i < pointsToDraw; i++) {
                const x = padding.left + (chartWidth / 12) * i;
                const y = padding.top + chartHeight * (1 - dataset.data[i] / 100);

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = dataset.color;
                ctx.fill();
            }
        });

        // Legend
        const legendY = padding.top - 20;
        let legendX = padding.left;
        
        datasets.forEach((dataset) => {
            ctx.fillStyle = dataset.color;
            ctx.beginPath();
            ctx.arc(legendX, legendY, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(212, 168, 120, 0.9)';
            ctx.font = '10px Inter';
            ctx.textAlign = 'left';
            ctx.fillText(dataset.label, legendX + 8, legendY + 3);

            legendX += ctx.measureText(dataset.label).width + 30;
        });

        ctx.restore();
    }

    // Animate chart on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animating) {
                animating = true;
                const startTime = performance.now();
                const duration = 2000;

                function animate(currentTime) {
                    const elapsed = currentTime - startTime;
                    animProgress = Math.min(elapsed / duration, 1);
                    
                    // Ease out
                    animProgress = 1 - Math.pow(1 - animProgress, 3);
                    
                    drawChart();

                    if (elapsed < duration) {
                        requestAnimationFrame(animate);
                    }
                }

                requestAnimationFrame(animate);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(canvas);
    drawChart();
}

// ===========================
// Thermometer Animation
// ===========================
function initThermometerAnimation() {
    const mercury = $('#thermo-mercury');
    if (!mercury) return;

    // Animate mercury to ideal position (4°C)
    // Scale: -20 to 50 range, 4°C is about 34% from bottom
    // (4 - (-20)) / (50 - (-20)) = 24/70 = ~34%
    setTimeout(() => {
        mercury.style.height = '34%';
    }, 500);

    // Interactive temperature change on hover over info cards
    const infoCards = $$('.info-card');
    const tempCurrent = $('#temp-current');
    const tempStatus = $('#temp-status');
    const bulb = $('#thermo-bulb');

    infoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (card.classList.contains('ideal')) {
                mercury.style.height = '34%';
                mercury.style.background = 'linear-gradient(to top, #22c55e, #4ade80)';
                if (bulb) {
                    bulb.style.background = 'linear-gradient(135deg, #22c55e, #4ade80)';
                    bulb.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
                }
                if (tempCurrent) {
                    tempCurrent.textContent = '4°C';
                    tempCurrent.style.color = '#22c55e';
                }
                if (tempStatus) {
                    tempStatus.innerHTML = '<span style="color: #22c55e">✓ OPTIMAL</span>';
                }
            } else if (card.classList.contains('warning')) {
                mercury.style.height = '60%';
                mercury.style.background = 'linear-gradient(to top, #f59e0b, #fbbf24)';
                if (bulb) {
                    bulb.style.background = 'linear-gradient(135deg, #f59e0b, #fbbf24)';
                    bulb.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.3)';
                }
                if (tempCurrent) {
                    tempCurrent.textContent = '25°C';
                    tempCurrent.style.color = '#f59e0b';
                }
                if (tempStatus) {
                    tempStatus.innerHTML = '<span style="color: #f59e0b">⚠ PERHATIAN</span>';
                }
            } else if (card.classList.contains('danger')) {
                mercury.style.height = '85%';
                mercury.style.background = 'linear-gradient(to top, #ef4444, #f87171)';
                if (bulb) {
                    bulb.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
                    bulb.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
                }
                if (tempCurrent) {
                    tempCurrent.textContent = '40°C';
                    tempCurrent.style.color = '#ef4444';
                }
                if (tempStatus) {
                    tempStatus.innerHTML = '<span style="color: #ef4444">✕ BAHAYA</span>';
                }
            }
        });

        card.addEventListener('mouseleave', () => {
            mercury.style.height = '34%';
            mercury.style.background = 'linear-gradient(to top, #22c55e, #4ade80)';
            if (bulb) {
                bulb.style.background = 'linear-gradient(135deg, #22c55e, #4ade80)';
                bulb.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
            }
            if (tempCurrent) {
                tempCurrent.textContent = '4°C';
                tempCurrent.style.color = '#22c55e';
            }
            if (tempStatus) {
                tempStatus.innerHTML = '<span style="color: #22c55e">✓ OPTIMAL</span>';
            }
        });
    });
}

// ===========================
// Scroll Reveal Animations
// ===========================
function initScrollAnimations() {
    // Add animate-on-scroll class to elements
    const selectors = [
        '.stat-card',
        '.detail-card',
        '.pathogen-card',
        '.info-card',
        '.practice-item',
        '.sign-card',
        '.research-stat-card',
        '.paper-item',
        '.feature-item',
        '.calculator-card',
        '.result-card'
    ];

    selectors.forEach(selector => {
        $$(selector).forEach((el, i) => {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = `${i * 0.1}s`;
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    $$('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ===========================
// Smooth scroll for anchor links
// ===========================
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ===========================
// Keyboard Navigation
// ===========================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navToggle = $('#nav-toggle');
        const navLinks = $('#nav-links');
        if (navToggle && navLinks) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
});
