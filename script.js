const preloader = document.getElementById('preloader');
const progressFill = document.getElementById('progress-fill');
const loaderPercent = document.getElementById('loader-percent');
const loadingMessage = document.getElementById('loading-message');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const counters = document.querySelectorAll('.counter');
const revealItems = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contactForm');
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeLightboxButton = document.querySelector('.lightbox__close');
const prevButton = document.querySelector('.lightbox__prev');
const nextButton = document.querySelector('.lightbox__next');

const loadingSteps = [
  'Checking Passport',
  'Security Clearance',
  'Loading Flight Data',
  'Boarding Flight AV707',
  'Doors Closed',
  'Taxiing to Runway',
  'Cleared for Takeoff',
  'Ascending',
  'Welcome Aboard'
];

function startPreloader() {
  if (!preloader || !progressFill || !loaderPercent || !loadingMessage) return;
  let currentStep = 0;
  let progress = 0;

  const interval = setInterval(() => {
    progress += 12;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 350);
    }

    if (currentStep < loadingSteps.length - 1 && progress >= (currentStep + 1) * 11) {
      currentStep += 1;
      loadingMessage.textContent = loadingSteps[currentStep];
    }

    progressFill.style.width = `${progress}%`;
    loaderPercent.textContent = `${progress}%`;
  }, 210);
}

function setupMenu() {
  menuToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    if (link.classList.contains('nav-login')) return;
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  const menuButton = document.querySelector('.nav-menu');
  menuButton?.addEventListener('click', () => navLinks?.classList.toggle('open'));
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
}

function animateCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const duration = 1200;
      const start = performance.now();

      function step(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach((counter) => observer.observe(counter));
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  const fields = form.querySelectorAll('input, textarea');
  let valid = true;

  fields.forEach((field) => {
    if (!field.checkValidity()) {
      field.reportValidity();
      valid = false;
    }
  });

  if (!valid) return;

  const name = form.querySelector('input[name="name"]').value.trim();
  const email = form.querySelector('input[name="email"]').value.trim();

  if (!validateEmail(email)) {
    status.textContent = 'Please enter a valid email address.';
    return;
  }

  status.textContent = `Thank you, ${name}. Your message is ready to be connected to your preferred form service.`;
  form.reset();
}

function handleBookingSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const name = form.elements.name.value.trim();
  const category = form.elements.category.value;
  status.textContent = `Thank you, ${name}. Your ${category.toLowerCase()} request is ready to connect to MJX.`;
  form.reset();
}

function setupGalleryLightbox() {
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const image = galleryItems[currentIndex];
    if (!image) return;
    lightboxImage.src = image.src;
    lightboxCaption.textContent = image.dataset.caption || 'Aviator Violinist performance';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  galleryItems.forEach((image, index) => {
    image.addEventListener('click', () => openLightbox(index));
  });

  closeLightboxButton?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  prevButton?.addEventListener('click', () => {
    const nextIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(nextIndex);
  });

  nextButton?.addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(nextIndex);
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % galleryItems.length;
      openLightbox(nextIndex);
    }
    if (event.key === 'ArrowLeft') {
      const nextIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(nextIndex);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  revealOnScroll();
  animateCounters();
  setupGalleryLightbox();
  startPreloader();

  contactForm?.addEventListener('submit', handleFormSubmit);
  document.getElementById('booking-form')?.addEventListener('submit', handleBookingSubmit);
});
