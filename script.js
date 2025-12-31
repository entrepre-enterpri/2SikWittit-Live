/* =========================
   SLIDESHOW – SIMPLE FADE
   ========================= */
const slides = document.querySelectorAll(".slideshow .slide");
let currentSlide = 0;

function showSlide(i) {
  slides.forEach((s, idx) => {
    s.classList.toggle("active", idx === i);
  });
}

if (slides.length > 0) {
  showSlide(currentSlide);
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 4200);
}

/* =========================
   TEAR SECTIONS – TAP TO REVEAL
   (hover handled by CSS)
   ========================= */
document.querySelectorAll(".tear-section").forEach((section) => {
  section.addEventListener("click", () => {
    section.classList.toggle("revealed");
  });
});

/* =========================
   BUTTON-ONLY AUDIO CONTROL
   ========================= */
const allAudios = Array.from(document.querySelectorAll("audio"));

function stopAllAudio(exceptId = null) {
  allAudios.forEach((a) => {
    if (exceptId && a.id === exceptId) return;
    a.pause();
    a.currentTime = 0;
  });
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-audio");
  if (!btn) return;

  const audioId = btn.getAttribute("data-audio");
  const audio = document.getElementById(audioId);
  if (!audio) return;

  stopAllAudio(audioId);

  if (audio.paused) {
    audio.play().catch(() => {});
    btn.textContent = "⏸ Pause Audio";
  } else {
    audio.pause();
    btn.textContent = "▶ Play Audio";
  }

  audio.onended = () => {
    btn.textContent = "▶ Play Audio";
  };
});

/* =========================
   HOODIE FRONT/BACK SWAP (SAFE)
   ========================= */
const hoodieCard = document.getElementById("hoodie-card");
const hoodieImg = document.getElementById("hoodieFront"); // <-- only if this ID exists in your HTML

if (hoodieCard && hoodieImg) {
  hoodieCard.addEventListener("mouseenter", () => {
    hoodieImg.src = "images/product_hoodie_back2.PNG";
  });

  hoodieCard.addEventListener("mouseleave", () => {
    hoodieImg.src = "images/product_hoodie_front2.png";
  });
}


/* =========================
   BEE MOVE ON SCROLL
   ========================= */
const beeImg = document.querySelector(".bee-body");
let positionX = 0;
let lastScrollY = window.scrollY;

function moveBee(scrollUp) {
  if (!beeImg) return;

  if (scrollUp) {
    positionX += 10;
    beeImg.style.transform = `translateX(${positionX}px) rotate(0deg)`;
  } else {
    beeImg.style.transform = `translateX(${positionX}px) rotate(-30deg)`;
    setTimeout(() => {
      positionX -= 10;
      beeImg.style.transform = `translateX(${positionX}px) rotate(0deg)`;
    }, 200);
  }
}

window.addEventListener("scroll", () => {
  const currentY = window.scrollY;
  const scrollUp = currentY < lastScrollY;
  moveBee(scrollUp);
  lastScrollY = currentY;
});


  // ===============================
// Stripe Checkout (Netlify Function)
// ===============================
let stripeClient;

function getStripe() {
  if (!stripeClient) {
    if (!window.STRIPE_PUBLISHABLE_KEY) {
      alert("Missing Stripe publishable key.");
      return null;
    }
    stripeClient = Stripe(window.STRIPE_PUBLISHABLE_KEY);
  }
  return stripeClient;
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-buy");
  if (!btn) return;

  const card = btn.closest("[data-stripe-price-id]");
  if (!card) return;

  const priceId = card.getAttribute("data-stripe-price-id");
  if (!priceId) {
    alert("Missing data-stripe-price-id on this product.");
    return;
  }

  const original = btn.textContent;
  btn.textContent = "Redirecting...";

  try {
    const res = await fetch("/netlify/functions/create-checkout-session", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, quantity: 1 }),
    });

    const raw = await res.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = { error: raw }; }

    if (!res.ok) throw new Error(data.error || "Function failed");

    const stripe = getStripe();
    if (!stripe) throw new Error("Stripe not initialized");

    const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
    if (error) throw error;

  } catch (err) {
    console.error(err);
    alert("Checkout error: " + err.message);
    btn.textContent = original;
  }
});
