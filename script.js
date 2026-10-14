const envelope = document.querySelector("#envelope");
const openButton = document.querySelector("#open-letter");
const letterHint = document.querySelector("#letter-hint");
const letterDialog = document.querySelector("#letter-dialog");
const closeButton = document.querySelector("#close-letter");
const heartButton = document.querySelector("#heart-button");
const heartResponse = document.querySelector("#heart-response");

openButton.addEventListener("click", () => {
  envelope.classList.add("is-open");
  openButton.setAttribute("aria-expanded", "true");
  letterHint.style.opacity = "0";
  window.setTimeout(() => letterDialog.showModal(), 650);
});

function closeLetter() {
  letterDialog.close();
  window.setTimeout(() => {
    envelope.classList.remove("is-open");
    openButton.setAttribute("aria-expanded", "false");
    letterHint.style.opacity = "1";
  }, 250);
}

closeButton.addEventListener("click", closeLetter);

letterDialog.addEventListener("click", (event) => {
  if (event.target === letterDialog) closeLetter();
});

letterDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLetter();
});

heartButton.addEventListener("click", () => {
  heartButton.innerHTML = '<span aria-hidden="true">♥</span> Love received';
  heartButton.disabled = true;
  heartResponse.textContent = "Thank you for reading my heart.";

  for (let index = 0; index < 9; index += 1) {
    const heart = document.createElement("span");
    heart.textContent = index % 2 ? "♥" : "♡";
    heart.setAttribute("aria-hidden", "true");
    heart.style.cssText = `
      position: fixed;
      z-index: 30;
      left: ${45 + Math.random() * 10}vw;
      bottom: 15vh;
      color: #b75d69;
      pointer-events: none;
      font-size: ${0.8 + Math.random() * 1.4}rem;
      transition: transform 1.7s ease-out, opacity 1.7s ease-out;
    `;
    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translate(${(Math.random() - 0.5) * 220}px, -${120 + Math.random() * 220}px) rotate(${(Math.random() - 0.5) * 80}deg)`;
      heart.style.opacity = "0";
    });

    window.setTimeout(() => heart.remove(), 1800);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".section__content, .promise-grid article, .envelope, .closing h2").forEach((element, index) => {
  element.classList.add("scroll-reveal");
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 100}ms`;
  revealObserver.observe(element);
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lastHeartAt = 0;

if (!reduceMotion) {
  window.addEventListener("pointermove", (event) => {
    const now = Date.now();
    if (now - lastHeartAt < 110 || event.pointerType === "touch") return;
    lastHeartAt = now;

    const heart = document.createElement("span");
    heart.className = "trail-heart";
    heart.textContent = Math.random() > 0.5 ? "♥" : "♡";
    heart.setAttribute("aria-hidden", "true");
    heart.style.left = `${event.clientX + 8}px`;
    heart.style.top = `${event.clientY + 8}px`;
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 950);
  });
}
