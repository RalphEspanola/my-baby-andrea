// =====================================================
// I Like You, Andrea — Apology Website Logic
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------------------
     1. FLOATING HEARTS BACKGROUND
     --------------------------------------------------- */
  const heartsBg = document.getElementById("heartsBg");
  const HEART_SYMBOL = "❤";

  /**
   * Creates a single floating heart element with randomized
   * size, position, drift, duration and delay.
   */
  function createHeart() {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = HEART_SYMBOL;

    const size = 12 + Math.random() * 26; // 12px - 38px
    const left = Math.random() * 100; // vw percentage
    const duration = 9 + Math.random() * 10; // 9s - 19s
    const delay = Math.random() * 6; // stagger entry
    const drift = Math.random() * 80 - 40 + "px"; // sideways drift

    heart.style.left = left + "vw";
    heart.style.fontSize = size + "px";
    heart.style.animationDuration = duration + "s";
    heart.style.animationDelay = delay + "s";
    heart.style.setProperty("--drift", drift);

    heartsBg.appendChild(heart);

    // Clean up after the heart finishes its journey to avoid DOM bloat
    setTimeout(
      () => {
        heart.remove();
      },
      (duration + delay) * 1000 + 500,
    );
  }

  // Continuously spawn hearts at a gentle pace
  let heartSpawnRate = 700; // ms between new hearts
  let heartInterval = setInterval(createHeart, heartSpawnRate);

  // Seed a few hearts immediately so the background feels alive on load
  for (let i = 0; i < 6; i++) {
    setTimeout(createHeart, i * 200);
  }

  /**
   * Increases the floating heart density — used as part of the
   * celebration when the user clicks "Yes".
   */
  function intensifyHearts() {
    clearInterval(heartInterval);
    heartInterval = setInterval(createHeart, 220);
    // Burst of extra hearts right away
    for (let i = 0; i < 14; i++) {
      setTimeout(createHeart, i * 60);
    }
  }

  /* ---------------------------------------------------
     2. ROTATING HEARTFELT MESSAGES
     --------------------------------------------------- */
  const messages = [
    "My baby ❤️",
    "My LOML 🥹",
    "My everything 💖",
    "My favorite person 🌸",
    "My happiness ☀️",
    "My Dragon🤍",
    "I'm really sorry babyyy.",
    "Sorry sa akong pagka mali.",
    "Forgive me pleaseeeeee..",
    "I like you so much, Andrea ❤️",
  ];

  const messageText = document.getElementById("messageText");
  const apologyCard = document.getElementById("apologyCard");

  const FADE_IN_DELAY = 80; // ms before triggering fade-in (allows transition to register)
  const VISIBLE_DURATION = 2000; // ms each message stays fully visible
  const FADE_OUT_DURATION = 900; // ms matching CSS transition

  let messageIndex = 0;

  /**
   * Displays the next message in the sequence with a fade-in,
   * holds it, fades it out, then recurses to the next one.
   * When the sequence completes, reveals the apology card.
   */
  function showNextMessage() {
    if (messageIndex >= messages.length) {
      revealApologyCard();
      return;
    }

    messageText.textContent = messages[messageIndex];

    // Trigger fade-in on next frame for smooth CSS transition
    requestAnimationFrame(() => {
      setTimeout(() => {
        messageText.classList.add("visible");
      }, FADE_IN_DELAY);
    });

    // Hold, then fade out, then move to next message
    setTimeout(() => {
      messageText.classList.remove("visible");

      setTimeout(() => {
        messageIndex++;
        showNextMessage();
      }, FADE_OUT_DURATION);
    }, FADE_IN_DELAY + VISIBLE_DURATION);
  }

  /**
   * Reveals the final apology card once all messages have played.
   */
  function revealApologyCard() {
    messageText.textContent = "";
    apologyCard.setAttribute("aria-hidden", "false");
    apologyCard.classList.add("show");
  }

  // Kick off the message sequence shortly after entrance animation
  setTimeout(showNextMessage, 1000);

  /* ---------------------------------------------------
     3. "NO" BUTTON — PLAYFULLY UNCATCHABLE
     --------------------------------------------------- */
  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const buttonRow = document.getElementById("buttonRow");

  const BTN_MARGIN = 16; // keep button fully inside viewport

  /**
   * Moves the "No" button to a random valid position on screen,
   * making sure it stays fully visible within the viewport.
   */
  function moveNoButtonRandomly() {
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    const maxX = window.innerWidth - btnWidth - BTN_MARGIN;
    const maxY = window.innerHeight - btnHeight - BTN_MARGIN;

    const randomX = Math.max(BTN_MARGIN, Math.random() * maxX);
    const randomY = Math.max(BTN_MARGIN, Math.random() * maxY);

    if (!noBtn.classList.contains("escaping")) {
      // Switch to fixed positioning the first time it escapes
      noBtn.classList.add("escaping");
    }

    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
  }

  // Button teleports on tap/click only (no hover behavior).
  // After a set number of attempts, it vanishes completely.
  const MAX_NO_ATTEMPTS = 5;
  let noAttempts = 0;

  function handleNoInteraction(e) {
    e.preventDefault();

    // Avoid double counting when touchstart and the resulting
    // synthetic click both fire for a single tap on mobile.
    if (
      e.type === "click" &&
      handleNoInteraction.lastTouchTime &&
      Date.now() - handleNoInteraction.lastTouchTime < 600
    ) {
      return;
    }
    if (e.type === "touchstart") {
      handleNoInteraction.lastTouchTime = Date.now();
    }

    noAttempts++;

    if (noAttempts >= MAX_NO_ATTEMPTS) {
      vanishNoButton();
    } else {
      moveNoButtonRandomly();
    }
  }

  /**
   * Makes the "No" button fade out and disappear for good,
   * leaving "Yes" as the only option.
   */
  function vanishNoButton() {
    noBtn.classList.add("vanish");
    setTimeout(() => {
      noBtn.style.display = "none";
    }, 500);
  }

  // Touch devices: respond to tap
  noBtn.addEventListener("touchstart", handleNoInteraction, { passive: false });

  // Mouse devices: respond to click
  noBtn.addEventListener("click", handleNoInteraction);

  // Keep the button within bounds if the window is resized
  window.addEventListener("resize", () => {
    if (noBtn.classList.contains("escaping")) {
      moveNoButtonRandomly();
    }
  });

  /* ---------------------------------------------------
     4. "YES" BUTTON — CELEBRATION
     --------------------------------------------------- */
  const thankYou = document.getElementById("thankYou");
  const cardQuestion = document.getElementById("cardQuestion");

  yesBtn.addEventListener("click", () => {
    celebrate();
  });

  function celebrate() {
    // Hide the question + buttons, show thank-you message
    cardQuestion.style.display = "none";
    buttonRow.style.display = "none";
    thankYou.hidden = false;

    // Slightly enlarge the card
    apologyCard.classList.add("celebrate");
    apologyCard.style.maxWidth = "600px";

    // Intensify floating hearts in the background
    intensifyHearts();

    // Launch confetti
    launchConfetti();
  }

  /* ---------------------------------------------------
     5. CONFETTI — PURE CANVAS + JS
     --------------------------------------------------- */
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const confettiColors = [
    "#ffb3d1",
    "#ff8fb3",
    "#ffe066",
    "#a3d9ff",
    "#c2f0c2",
    "#ffffff",
    "#ffd6e7",
  ];

  /**
   * Represents a single confetti piece with physics-driven motion.
   */
  class ConfettiPiece {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -20 - Math.random() * canvas.height * 0.5;
      this.size = 6 + Math.random() * 6;
      this.color =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.speedY = 2 + Math.random() * 3;
      this.speedX = (Math.random() - 0.5) * 3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 8;
      this.shape = Math.random() > 0.5 ? "rect" : "circle";
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      if (this.shape === "rect") {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  let confettiPieces = [];
  let confettiAnimationId = null;
  let confettiActive = false;

  function launchConfetti() {
    // Generate an initial burst of confetti pieces
    confettiPieces = [];
    const pieceCount = 160;
    for (let i = 0; i < pieceCount; i++) {
      confettiPieces.push(new ConfettiPiece());
    }

    confettiActive = true;
    animateConfetti();

    // Stop spawning new frames after a while, letting pieces fall off-screen
    setTimeout(() => {
      confettiActive = false;
    }, 4500);
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((piece) => {
      piece.update();
      piece.draw();
    });

    // Remove pieces that have fallen off the bottom of the screen
    confettiPieces = confettiPieces.filter((p) => p.y < canvas.height + 30);

    if (confettiActive || confettiPieces.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(confettiAnimationId);
    }
  }
});
