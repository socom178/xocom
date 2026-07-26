/* =============================================
   XOCOM WEB AGENCY — script.js
============================================= */

/* =============================================
   ⚙️  CONFIG EMAILJS — Remplace par tes vraies clés
============================================= */
const EMAILJS_PUBLIC_KEY  = "X30e-BC4l_r9ACQD4";  // Account → Public Key
const EMAILJS_SERVICE_ID  = "service_k11y85k";    // Email Services → Service ID
const EMAILJS_TEMPLATE_ID = "template_r8yi4am";   // Email Templates → Template ID
const EMAILJS_TEMPLATE_ID_ADMIN = "template_qfxd99r";

/* ---- Init EmailJS ---- */
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();

/* =============================================
   1. Particle Canvas
============================================= */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
    this.a  = Math.random() * 0.5 + 0.1;
  }

  function initParticles(n) {
    particles = [];
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isLight  = document.documentElement.dataset.theme === 'light';
    const dotColor = isLight ? '37,99,235' : '96,165,250';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotColor},${p.a})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dx   = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(37,99,235,${0.15 * (1 - dist / 140)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  initParticles(60);
  draw();
  window.addEventListener('resize', () => { resize(); initParticles(60); });
})();

/* =============================================
   2. Navbar scroll
============================================= */
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
  backTop.classList.toggle('visible', scrolled);
}, { passive: true });

/* =============================================
   3. Intersection Observer (reveal)
============================================= */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

/* =============================================
   4. Animated Counters
============================================= */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = 1;
      const target = parseInt(e.target.dataset.target);
      let current  = 0;
      const step   = Math.max(1, Math.floor(target / 50));
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        e.target.textContent = current + '+';
        if (current >= target) clearInterval(timer);
      }, 30);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* =============================================
   5. Mobile Menu
============================================= */
function toggleMenu() {
  const m = document.getElementById('mobileMenu');
  m.classList.toggle('open');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}

/* =============================================
   6. FAQ
============================================= */
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* =============================================
   7. Portfolio Filters
============================================= */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

/* =============================================
   8. Active nav link on scroll
============================================= */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--white)' : '';
  });
}, { passive: true });

/* =============================================
   9. Theme Toggle
============================================= */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY   = 'xocom-theme';

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) html.dataset.theme = savedTheme;

function toggleTheme() {
  const isLight     = html.dataset.theme === 'light';
  html.dataset.theme = isLight ? '' : 'light';
  localStorage.setItem(THEME_KEY, html.dataset.theme);
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

/* =============================================
   10. FORMULAIRE — EmailJS
============================================= */

// Ajoute l'animation du spinner
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }';
document.head.appendChild(spinStyle);

const form  = document.querySelector('.contact-form');
const toast = document.getElementById('toast');

/* Affiche le toast de notification */
function showToast(message, success = true) {
  const icon = toast.querySelector('.toast-icon');
  const text = toast.querySelector('span:last-child');
  icon.textContent = success ? '✓' : '✗';
  icon.style.color = success ? '#22C55E' : '#EF4444';
  text.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

/* Bouton — état chargement */
function setLoading(isLoading) {
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled  = isLoading;
  btn.innerHTML = isLoading
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           style="animation:spin 1s linear infinite">
         <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4
                  M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
       </svg> Envoi en cours...`
    : `Envoyer ma demande
       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
         <path d="M5 12h14M12 5l7 7-7 7"/>
       </svg>`;
}

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    /* -- Validation côté client -- */
    const nom         = form.querySelector('[name="nom"]').value.trim();
    const mail        = form.querySelector('[name="mail"]').value.trim();
    const description = form.querySelector('[name="description"]').value.trim();

    if (!nom) {
      showToast('Veuillez entrer votre nom complet.', false); return;
    }
    if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      showToast('Veuillez entrer une adresse email valide.', false); return;
    }
    if (!description) {
      showToast('Veuillez décrire votre projet.', false); return;
    }

    setLoading(true);

    /* -- Paramètres envoyés à EmailJS -- */
    /* Ces noms DOIVENT correspondre aux {{variables}} de ton template */
    const templateParams = {
      nom        : nom,
      mail       : mail,
      phone      : form.querySelector('[name="phone"]').value.trim()      || "Non renseigné",
      entreprise : form.querySelector('[name="ename"]').value.trim()      || "Non renseignée",
      type       : form.querySelector('[name="type"]').value             || "Non précisé",
      budget     : form.querySelector('[name="budget"]').value           || "Non précisé",
      description: description,
    };

    try {
      /* -- Vérification que EmailJS est chargé -- */
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS non chargé. Vérifiez la connexion internet.');
      }

      await Promise.all([
        // Email de confirmation → au client
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
          publicKey: EMAILJS_PUBLIC_KEY
        }),
        showToast('✅ Votre demande a été envoyée ! Nous vous répondrons sous 24h.', true),
        form.reset(),
        // Email avec détails → à toi
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_ADMIN, templateParams, {
          publicKey: EMAILJS_PUBLIC_KEY
        })
      ]);

    } catch (error) {
      console.error('EmailJS error:', error);

      /* Message d'erreur selon le type */
      if (EMAILJS_PUBLIC_KEY === 'VOTRE_PUBLIC_KEY') {
        showToast('⚙️ EmailJS non configuré. Remplacez les clés dans script.js', false);
      } else {
        showToast('Erreur d\'envoi. Contactez-nous directement sur WhatsApp.', false);
      }
    } finally {
      setLoading(false);
    }
  });
}
