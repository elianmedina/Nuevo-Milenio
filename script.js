const THEME_KEY = 'cenm-theme';

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

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

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

function updateCarousel(index, smooth = true) {
    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    const offset = -currentSlide * 100;
    track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    track.style.transform = `translateX(${offset}%)`;

    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentSlide);
        indicator.setAttribute('aria-current', i === currentSlide ? 'true' : 'false');
    });

    navLinks.forEach((link, i) => {
        link.classList.toggle('active', i === currentSlide);
        if (i === currentSlide) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
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

function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
}

themeToggle.addEventListener('click', toggleTheme);

prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoplay();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
});

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        goToSlide(index);
        stopAutoplay();
    });
});

navLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(index);
        stopAutoplay();

        const targetSlide = slides[index];
        if (targetSlide) {
            targetSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
});

track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
}, { passive: true });

track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoplay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoplay();
    }
});

const carouselContainer = document.querySelector('.carousel-container');

carouselContainer.addEventListener('mouseenter', stopAutoplay);
carouselContainer.addEventListener('mouseleave', startAutoplay);
carouselContainer.addEventListener('focusin', stopAutoplay);
carouselContainer.addEventListener('focusout', startAutoplay);

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

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const slideIndex = Array.from(slides).indexOf(entry.target);
            if (slideIndex !== -1 && slideIndex !== currentSlide) {
                updateCarousel(slideIndex, false);
            }
        }
    });
}, observerOptions);

slides.forEach(slide => {
    sectionObserver.observe(slide);
});

updateCarousel(0, false);
startAutoplay();

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'var(--shadow-sm)';
    }

    lastScroll = currentScroll;
}, { passive: true });
