const envelope = document.querySelector("#envelope");
const openButton = document.querySelector("#open-letter");
const letterHint = document.querySelector("#letter-hint");
const letterDialog = document.querySelector("#letter-dialog");
const closeButton = document.querySelector("#close-letter");
const heartButton = document.querySelector("#heart-button");
const heartResponse = document.querySelector("#heart-response");
const forgiveCard = document.querySelector("#forgive-card");
const forgiveTitle = document.querySelector("#forgive-title");
const forgiveNote = document.querySelector("#forgive-note");
const answerArea = document.querySelector("#answer-area");
const yesButton = document.querySelector("#yes-button");
const noButton = document.querySelector("#no-button");
const celebrationLayer = document.querySelector("#celebration-layer");

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

let noAttempts = 0;
const noMessages = ["No", "Are you sure?", "Really?", "Think again 💗", "Try ‘Yes’ 😊"];

function moveNoButton(event) {
  if (event) event.preventDefault();
  noAttempts += 1;
  noButton.classList.add("is-dodging");

  const areaWidth = answerArea.clientWidth;
  const areaHeight = answerArea.clientHeight;
  const buttonWidth = noButton.offsetWidth;
  const buttonHeight = noButton.offsetHeight;
  const maxX = Math.max(0, areaWidth - buttonWidth);
  const maxY = Math.max(0, areaHeight - buttonHeight);

  noButton.style.left = `${Math.random() * maxX}px`;
  noButton.style.top = `${Math.random() * maxY}px`;
  noButton.textContent = noMessages[Math.min(noAttempts, noMessages.length - 1)];
}

noButton.addEventListener("pointerenter", (event) => {
  if (event.pointerType !== "touch") moveNoButton(event);
});
noButton.addEventListener("click", moveNoButton);

function celebrateYes() {
  if (forgiveCard.classList.contains("is-forgiven")) return;

  forgiveCard.classList.add("is-forgiven");
  forgiveTitle.textContent = "You made my heart so happy, Penguin!";
  forgiveNote.textContent = "Thank you for giving us another chance. I love you. ♥";
  yesButton.innerHTML = 'Yes! <span aria-hidden="true">♥</span>';
  celebrationLayer.classList.add("is-active");

  const colors = ["#b75d69", "#e4929c", "#8e3f4b", "#f2bac0", "#d66f7c"];
  const heartCount = reduceMotion ? 18 : 70;

  for (let index = 0; index < heartCount; index += 1) {
    const heart = document.createElement("span");
    heart.className = "celebration-heart";
    heart.textContent = index % 3 === 0 ? "♡" : "♥";
    heart.setAttribute("aria-hidden", "true");
    heart.style.setProperty("--x", `${Math.random() * 100}%`);
    heart.style.setProperty("--size", `${0.9 + Math.random() * 2.4}rem`);
    heart.style.setProperty("--color", colors[index % colors.length]);
    heart.style.setProperty("--duration", `${2.7 + Math.random() * 2.2}s`);
    heart.style.setProperty("--delay", `${Math.random() * 1.2}s`);
    heart.style.setProperty("--drift", `${(Math.random() - 0.5) * 190}px`);
    heart.style.setProperty("--spin", `${(Math.random() - 0.5) * 240}deg`);
    celebrationLayer.appendChild(heart);
  }

  const message = document.createElement("div");
  message.className = "celebration-message";
  message.textContent = "Yay! I love you, Penguin! 💗";
  celebrationLayer.appendChild(message);

  window.setTimeout(() => {
    celebrationLayer.replaceChildren();
    celebrationLayer.classList.remove("is-active");
  }, 6000);
}

yesButton.addEventListener("click", celebrateYes);

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

document.querySelectorAll(".section__content, .promise-grid article, .envelope, .forgive-card, .closing h2").forEach((element, index) => {
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
