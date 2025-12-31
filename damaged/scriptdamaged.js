/* === GLOBAL AUDIO PAUSE === */
const DISABLE_AUDIO = true;
/* =========================
   SLIDESHOW (FADE)
   ========================= */
const slides = document.querySelectorAll(".slideshow .slide");
let currentSlide = 0;

function showSlide(i) {
  slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
}

if (slides.length) {
  showSlide(currentSlide);
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 4200);
}

/* =========================
   TEAR-TO-REVEAL AUDIO
   (plays once when in view)
   ========================= */
const tearSections = document.querySelectorAll(".tear-section");
const playedTearAudio = new Set();

const tearObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const section = entry.target;
      const audio = section.querySelector("audio");
      if (!audio || playedTearAudio.has(audio)) return;

      playedTearAudio.add(audio);
      if (!DISABLE_AUDIO) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

    });
  },
  { threshold: 0.35 }
);

tearSections.forEach(sec => tearObserver.observe(sec));

/* =========================
   INTRO OVERLAY ($ikCash-oUt)
   ========================= */
const overlay = document.createElement("div");
overlay.id = "introOverlay";
Object.assign(overlay.style, {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: "9999"
});
document.body.appendChild(overlay);

const card = document.createElement("div");
card.id = "cashCardIntro";
card.innerText = "$ikCash-oUt";
Object.assign(card.style, {
  padding: "40px 60px",
  background: "#0f0",
  color: "#000",
  fontWeight: "bold",
  fontSize: "2rem",
  borderRadius: "20px",
  boxShadow: "0 0 30px #39ff14",
  transform: "perspective(600px) rotateY(0deg)",
  animation: "rotateCard 2.5s ease-in-out"
});
overlay.appendChild(card);

/* === Realistic Cash Bills Intro === */

const billImages = [
  "images/bill_50.png",
  "images/bill_100.png"
];

for (let i = 0; i < 5; i++) {
  const img = document.createElement("img");

  // Alternate between 50 and 100
  img.src = billImages[i % billImages.length];

  img.className = "cashBill";
  Object.assign(img.style, {
    position: "absolute",
    width: "120px",
    height: "auto",
    objectFit: "contain",
    top: `${10 + i * 15}%`,
    left: i % 2 === 0 ? "-150px" : "120%",
    animation: `floatCash${i} 2.8s ease-in-out`,
    filter: "brightness(1.2) contrast(1.1)"
  });

  overlay.appendChild(img);
}


// remove overlay after 4s
setTimeout(() => {
  overlay.style.transition = "opacity 1s ease";
  overlay.style.opacity = 0;
  setTimeout(() => overlay.remove(), 1000);
}, 4000);

/* =========================
   PRODUCT HOVER VOICES
   (play once per visit)
   ========================= */
const voicePlayed = new Set();

document.querySelectorAll(".product-card.play-sound").forEach(cardEl => {
  const voice = cardEl.querySelector("audio");
  if (!voice) return;

  cardEl.addEventListener("mouseenter", () => {
    const id = cardEl.id || cardEl.dataset.productId;
    if (voicePlayed.has(id)) return;

    voicePlayed.add(id);
    if (!DISABLE_AUDIO) {
    voice.currentTime = 0;
    voice.play().catch(() => {});
}
  });
});

/* =========================
   HOODIE FRONT/BACK SWAP
   ========================= */
const hoodieCard = document.getElementById("hoodie-card");
const hoodieFront = document.getElementById("hoodieFront");

if (hoodieCard && hoodieFront) {
  hoodieCard.addEventListener("mouseover", () => {
    hoodieFront.src = "images/product_hoodie_back.PNG";
  });
  hoodieCard.addEventListener("mouseout", () => {
    hoodieFront.src = "images/product_hoodie_front.PNG";
  });
}

/* =========================
   ABOUT VOICE ON FOOTER HOVER
   (DISABLED – avoids surprise autoplay)
   =========================
const footer = document.querySelector("footer");
const aboutVoice = document.getElementById("about-voice");

footer?.addEventListener("mouseenter", () => {
  if (!aboutVoice) return;
  aboutVoice.currentTime = 0;
  aboutVoice.play().catch(() => {});
});
*/

/* =========================
   TAP ZONE & DONATION COUNTS
   (safe checks)
   ========================= */
let totalTaps = 0;
let donationClicks = 0;

const tpArea = document.getElementById("tp-area");
const donationBtn = document.querySelector('a[href*="donate?amount=1"]');

if (tpArea) {
  tpArea.addEventListener("click", () => {
    totalTaps++;
    console.log(`Tap Zone clicked: ${totalTaps} total`);
    tpArea.innerText = `Support taps: ${totalTaps}`;
  });
}

if (donationBtn) {
  donationBtn.addEventListener("click", () => {
    donationClicks++;
    console.log(`Donation clicked: ${donationClicks} times`);
  });
}

/* =========================
   DEBUG LOGS (OPTIONAL)
   ========================= */
document.querySelectorAll(".tear-reveal").forEach((section, index) => {
  section.addEventListener("mouseenter", () => {
    console.log(`Tear section ${index + 1} hovered`);
  });
});

/* =========================
   BUY BUTTON LOGIC
   ========================= */
document.querySelectorAll(".btn-buy").forEach(button => {
  button.addEventListener("click", event => {
    const cardEl = event.currentTarget.closest(".product-card");
    if (!cardEl) return;

    const productId = cardEl.dataset.productId;
    const stripePriceId = cardEl.dataset.stripePriceId;
    const shopifyHandle = cardEl.dataset.shopifyHandle;
    const priceElement = cardEl.querySelector(".price-amount");

    const price = priceElement
      ? priceElement.dataset.price || priceElement.textContent.trim()
      : null;

    // optional: play card audio
    const audio = cardEl.querySelector("audio");
    if (audio) {
      if (!DISABLE_AUDIO) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

    }

    // visual feedback
    cardEl.classList.add("added");
    setTimeout(() => {
      cardEl.classList.remove("added");
    }, 600);

    console.log("Add to cart clicked:", {
      productId,
      stripePriceId,
      shopifyHandle,
      price
    });

    // future: Stripe / Shopify hook goes here
  });
});
