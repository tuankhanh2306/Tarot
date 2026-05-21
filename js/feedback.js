/* ============================================================
   LUNARA — TAROT BOOKING SITE
   Feedback Specific Script (js/feedback.js)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initStarRatingSelector();
  initLocalStorageTestimonials();
  initFeedbackForm();
});

/* ============ INTERACTIVE STAR RATING SELECTOR ============ */
function initStarRatingSelector() {
  const ratingContainer = document.getElementById("starRating");
  if (!ratingContainer) return;

  const starBtns = ratingContainer.querySelectorAll(".star-btn");
  const hiddenInput = document.getElementById("fb_rating");

  starBtns.forEach((btn, index) => {
    // 1. Mouse Enter (Hover highlighting)
    btn.addEventListener("mouseenter", () => {
      starBtns.forEach((s, idx) => {
        if (idx <= index) {
          s.classList.add("hovered");
        } else {
          s.classList.remove("hovered");
        }
      });
    });

    // 2. Mouse Leave (Reset highlighting)
    btn.addEventListener("mouseleave", () => {
      starBtns.forEach(s => s.classList.remove("hovered"));
    });

    // 3. Click (Save selection)
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-v");
      hiddenInput.value = val;

      starBtns.forEach((s, idx) => {
        if (idx < parseInt(val)) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });

  // Set initial rating representation (5 stars by default)
  const defaultVal = parseInt(hiddenInput.value || "5");
  starBtns.forEach((s, idx) => {
    if (idx < defaultVal) {
      s.classList.add("active");
    }
  });
}

/* ============ LOCAL STORAGE TESTIMONIALS ENGINE ============ */
const TESTIMONIALS_KEY = "lunara_testimonials";

// Helper to translate numbers to star rating characters
function getStarsString(rating) {
  const activeCount = parseInt(rating || "5");
  return "★".repeat(activeCount) + "☆".repeat(5 - activeCount);
}

// Retrieve from localStorage
function getSavedTestimonials() {
  try {
    return JSON.parse(localStorage.getItem(TESTIMONIALS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

// Save to localStorage
function saveTestimonial(testimonial) {
  const currentList = getSavedTestimonials();
  currentList.unshift(testimonial); // Add to the beginning
  localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(currentList));
}

// Create Card DOM element
function createTestimonialCard(data, index, animate = false) {
  const article = document.createElement("article");
  
  // Design variety: alternating styles for visual interest
  let cardClass = "tcard";
  if (index % 4 === 1) {
    cardClass += " tcard--right";
  } else if (index % 4 === 3) {
    cardClass += " tcard--accent";
  }
  article.className = cardClass;

  if (animate) {
    article.style.animation = "cardEntrance 0.8s var(--ease-out-quart) both";
  } else {
    article.style.animation = "none"; // Load instantly on page render
  }

  const starStr = getStarsString(data.rating);

  article.innerHTML = `
    <div class="tcard__stars">${starStr}</div>
    <blockquote class="tcard__quote">"${data.message}"</blockquote>
    <div class="tcard__author">
      <img class="tcard__avatar" src="${data.avatar}" alt="${data.name}" />
      <div>
        <strong class="tcard__name">${data.name}</strong>
        <span class="tcard__role">${data.service}</span>
      </div>
    </div>
  `;

  return article;
}

// Load testimonials on startup
function initLocalStorageTestimonials() {
  const grid = document.querySelector(".testimonials__inner");
  if (!grid) return;

  const savedData = getSavedTestimonials();
  savedData.forEach((item, index) => {
    // Prepend user-created reviews to the front of the grid
    const cardElement = createTestimonialCard(item, index, false);
    grid.insertBefore(cardElement, grid.firstChild);
  });
}

/* ============ FEEDBACK FORM HANDLING ============ */
function initFeedbackForm() {
  const form = document.getElementById("feedbackForm");
  const successState = document.getElementById("fbSuccess");

  if (!form) return;

  const inputs = {
    name: document.getElementById("fb_name"),
    message: document.getElementById("fb_message")
  };

  const errors = {
    name: document.getElementById("fbNameErr"),
    message: document.getElementById("fbMsgErr")
  };

  // Real-time validator
  const validateField = (field) => {
    const input = inputs[field];
    const errorSpan = errors[field];
    if (!input || !errorSpan) return true;

    let isValid = true;
    let msg = "";

    if (field === "name") {
      if (!input.value.trim()) {
        isValid = false;
        msg = "Vui lòng nhập họ và tên.";
      }
    } else if (field === "message") {
      const txtVal = input.value.trim();
      if (!txtVal) {
        isValid = false;
        msg = "Vui lòng nhập nội dung cảm nhận.";
      } else if (txtVal.length < 15) {
        isValid = false;
        msg = "Cảm nhận phải có độ dài ít nhất 15 ký tự để đảm bảo chất lượng.";
      }
    }

    if (!isValid) {
      input.classList.add("error");
      errorSpan.textContent = msg;
    } else {
      input.classList.remove("error");
      errorSpan.textContent = "";
    }

    return isValid;
  };

  // Bind real-time feedback input verification
  Object.keys(inputs).forEach(field => {
    if (inputs[field]) {
      inputs[field].addEventListener("input", () => validateField(field));
      inputs[field].addEventListener("blur", () => validateField(field));
    }
  });

  // Submit Feedback Form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Verify all fields before submission
    let isFormValid = true;
    Object.keys(inputs).forEach(field => {
      if (!validateField(field)) isFormValid = false;
    });

    if (!isFormValid) {
      const firstErrorField = Object.keys(inputs).find(field => inputs[field] && inputs[field].classList.contains("error"));
      if (firstErrorField) inputs[firstErrorField].focus();
      return;
    }

    // Toggle loader
    const submitBtn = document.getElementById("fbSubmitBtn");
    const submitText = document.getElementById("fbSubmitText");
    const submitLoading = document.getElementById("fbLoading");

    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.style.display = "none";
    if (submitLoading) submitLoading.style.display = "inline";

    // Generate random avatar value for realistic custom card
    const randomAvatarId = Math.floor(Math.random() * 70) + 1;
    const avatarUrl = `https://i.pravatar.cc/60?img=${randomAvatarId}`;

    const newTestimonial = {
      name: inputs.name.value.trim(),
      service: document.getElementById("fb_service").value,
      rating: parseInt(document.getElementById("fb_rating").value || "5"),
      message: inputs.message.value.trim(),
      avatar: avatarUrl,
      timestamp: new Date().toISOString()
    };

    // Simulate submission delay
    setTimeout(() => {
      // 1. Save to local database
      saveTestimonial(newTestimonial);

      // 2. Prepend to Testimonial Grid dynamically with slide-down animation
      const grid = document.querySelector(".testimonials__inner");
      if (grid) {
        // Read how many custom feedbacks exist to get proper styling index
        const currentCount = getSavedTestimonials().length;
        const newCard = createTestimonialCard(newTestimonial, currentCount - 1, true);
        grid.insertBefore(newCard, grid.firstChild);
      }

      // 3. Reset form loaders and display success container
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.style.display = "inline";
      if (submitLoading) submitLoading.style.display = "none";

      form.style.display = "none";
      if (successState) successState.style.display = "block";
    }, 1200);
  });
}
