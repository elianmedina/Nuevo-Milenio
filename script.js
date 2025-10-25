// ==============================
// script.js (corregido y mejorado)
// ==============================

const THEME_KEY = 'cenm-theme';

// ---------- Tema (light/dark)
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
}

initTheme();

// Respeta cambios del sistema solo si el usuario no ha guardado preferencia
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem(THEME_KEY)) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});

// ---------- Carrusel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const track = document.getElementById('carouselTrack');
const prevBtn = document.querySelector('.carousel-btn-prev');
const nextBtn = document.querySelector('.carousel-btn-next');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');

let touchStartX = 0;
let touchEndX = 0;
let autoplayInterval;

// Mapa robusto: id de slide -> índice real (evita depender del orden del menú)
const slideIndexById = {};
slides.forEach((s, i) => {
  if (s.id) slideIndexById[s.id] = i;
});

function updateIndicatorsFromSlide() {
  indicators.forEach((indicator, i) => {
    const active = i === currentSlide;
    indicator.classList.toggle('active', active);
    indicator.setAttribute('aria-current', active ? 'true' : 'false');
    indicator.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

function updateNavActiveFromSlide() {
  navLinks.forEach(link => {
    const targetId = (link.getAttribute('href') || '').replace('#', '');
    const targetIndex = slideIndexById[targetId];
    const isActive = targetIndex === currentSlide;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function updateCarousel(index, smooth = true) {
  if (!track || !slides.length) return;

  if (index < 0) currentSlide = slides.length - 1;
  else if (index >= slides.length) currentSlide = 0;
  else currentSlide = index;

  const offset = -currentSlide * 100;
  track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
  track.style.transform = `translateX(${offset}%)`;

  updateIndicatorsFromSlide();
  updateNavActiveFromSlide();
}

function nextSlide() {
  updateCarousel(currentSlide + 1);
}

function prevSlide() {
  updateCarousel(currentSlide - 1);
}

function goToSlide(index) {
  updateCarousel(index);
}

// Autoplay respetando preferencia de movimiento reducido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function startAutoplay() {
  if (prefersReducedMotion) return;
  stopAutoplay();
  autoplayInterval = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

// Pausar cuando la pestaña no está visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAutoplay();
  else startAutoplay();
});

// ---------- Listeners
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

if (prevBtn) {
  prevBtn.setAttribute('aria-controls', 'carouselTrack');
  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoplay();
  });
}

if (nextBtn) {
  nextBtn.setAttribute('aria-controls', 'carouselTrack');
  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
  });
}

// Indicadores del carrusel (por índice visual)
indicators.forEach((indicator, index) => {
  indicator.setAttribute('role', 'tab');
  indicator.addEventListener('click', () => {
    goToSlide(index);
    stopAutoplay();
  });
});

// Menú principal: navegar por id mapeado, no por índice de iteración
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return; // enlaces externos, permitir comportamiento normal
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetIndex = slideIndexById[targetId];
    if (typeof targetIndex === 'number') {
      goToSlide(targetIndex);
      stopAutoplay();
      slides[targetIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});

// Gestos táctiles (swipe)
if (track) {
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) nextSlide();
    else prevSlide();
  }
}

// Teclado
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    prevSlide();
    stopAutoplay();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
    stopAutoplay();
  }
});

// Hover / focus en contenedor del carrusel
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
  carouselContainer.addEventListener('mouseenter', stopAutoplay);
  carouselContainer.addEventListener('mouseleave', startAutoplay);
  carouselContainer.addEventListener('focusin', stopAutoplay);
  carouselContainer.addEventListener('focusout', startAutoplay);
}

// Auto-play/pause de videos según visibilidad
const videos = document.querySelectorAll('video');
videos.forEach(video => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(err => console.log('Video autoplay prevented:', err));
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });
  observer.observe(video);
});

// Sincronizar cuando una sección (slide) entra en viewport (scroll/cambio de tamaño)
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      const i = slideIndexById[id];
      if (typeof i === 'number' && i !== currentSlide) {
        updateCarousel(i, false);
      }
    }
  });
}, observerOptions);

slides.forEach(slide => sectionObserver.observe(slide));

// Inicialización
updateCarousel(0, false);
startAutoplay();

// ---------- Efecto de sombra en header al hacer scroll (micro feedback)
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
  if (header) {
    header.style.boxShadow = currentScroll > 100 ? 'var(--shadow-md)' : 'var(--shadow-sm)';
  }
  lastScroll = currentScroll;
}, { passive: true });
