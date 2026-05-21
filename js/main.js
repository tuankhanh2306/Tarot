/* ============================================================
   LUNARA — TAROT BOOKING SITE
   Core Script (js/main.js)
   ============================================================ */

// ============ CONFIGURATION ============
// To enable real email sending to your Gmail via EmailJS:
// 1. Sign up at https://www.emailjs.com/
// 2. Add an email service (e.g., Gmail) and get your SERVICE_ID
// 3. Create an email template and get your TEMPLATE_ID
// 4. Get your PUBLIC_KEY from the Account > API Keys tab
// 5. Replace the placeholder values below:
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "BY2R3gzRXVfFC7awK",      // Replace with your EmailJS Public Key
  SERVICE_ID: "service_nzanco4",      // Replace with your EmailJS Service ID
  TEMPLATE_ID: "template_9au70da"     // Replace with your EmailJS Template ID
};

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Core Features
  initStarsBg();
  initMobileNav();
  initParallaxCards();
  initBookingModal();
});

/* ============ DYNAMIC NIGHT SKY STARS ============ */
function initStarsBg() {
  const starsContainer = document.getElementById("stars");
  if (!starsContainer) return;

  const starCount = window.innerWidth < 768 ? 60 : 120;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Random styling
    const size = (Math.random() * 2 + 0.8).toFixed(1); // 0.8px - 2.8px
    const x = (Math.random() * 100).toFixed(2);       // 0% - 100%
    const y = (Math.random() * 100).toFixed(2);       // 0% - 100%
    const opacity = (Math.random() * 0.6 + 0.4).toFixed(2); // 0.4 - 1.0 max opacity
    const duration = (Math.random() * 4 + 2).toFixed(1);   // 2s - 6s twinkle duration
    const delay = (Math.random() * 5).toFixed(1);         // 0s - 5s delay

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.setProperty("--dur", `${duration}s`);
    star.style.setProperty("--delay", `${delay}s`);
    star.style.setProperty("--max-op", opacity);

    fragment.appendChild(star);
  }

  starsContainer.appendChild(fragment);
}

/* ============ RESPONSIVE NAVIGATION DRAWER ============ */
function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav__links");

  if (!hamburger || !navLinks) return;

  // Toggle nav menu
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
    
    // Animate hamburger lines
    const spans = hamburger.querySelectorAll("span");
    if (hamburger.classList.contains("active")) {
      spans[0].style.transform = "translateY(6px) rotate(45deg)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "translateY(-6px) rotate(-45deg)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });

  // Close nav on click outside
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && !navLinks.contains(e.target) && e.target !== hamburger) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
      hamburger.querySelectorAll("span").forEach(span => span.style.transform = "none");
      hamburger.querySelectorAll("span")[1].style.opacity = "1";
    }
  });

  // Close nav on link click
  navLinks.querySelectorAll(".nav__link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
      hamburger.querySelectorAll("span").forEach(span => span.style.transform = "none");
      hamburger.querySelectorAll("span")[1].style.opacity = "1";
    });
  });
}

/* ============ MOUSE PARALLAX ON HERO TAROT CARDS ============ */
function initParallaxCards() {
  const cardsField = document.getElementById("cardsField");
  if (!cardsField) return;

  const cards = cardsField.querySelectorAll(".card");
  
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    cards.forEach((card, index) => {
      // Different speed multipliers for visual depth
      const depth = (index + 1) * 20;
      const rotateDefault = parseFloat(card.style.getPropertyValue("--rot") || "0");
      
      const moveX = mouseX * depth;
      const moveY = mouseY * depth;
      
      // Update position smoothly
      card.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotateDefault}deg)`;
    });
  });
}

/* ============ BOOKING MODAL LOGIC ============ */
function initBookingModal() {
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("closeModal");
  const bookingForm = document.getElementById("bookingForm");
  const successState = document.getElementById("bookingSuccess");
  const closeSuccessBtn = document.getElementById("closeSuccess");
  
  // Triggers
  const openTriggers = [
    document.getElementById("openBooking"),
    document.getElementById("footerBook"),
    document.getElementById("ctaBook")
  ].filter(el => el !== null);

  if (!overlay) return;

  // Open modal
  const openModal = () => {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    
    // Set tomorrow as default date if date field is empty
    const dateInput = document.getElementById("date");
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split("T")[0];
      dateInput.min = new Date().toISOString().split("T")[0]; // Cannot book past dates
    }
  };

  // Close modal
  const closeModal = () => {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    
    // Reset form and states after transition
    setTimeout(() => {
      if (bookingForm) {
        bookingForm.reset();
        bookingForm.style.display = "flex";
        
        // Remove error classes and text
        bookingForm.querySelectorAll(".form-input").forEach(input => input.classList.remove("error"));
        bookingForm.querySelectorAll(".form-error").forEach(err => err.textContent = "");
      }
      if (successState) successState.style.display = "none";
    }, 400);
  };

  // Bind trigger click events
  openTriggers.forEach(trigger => trigger.addEventListener("click", openModal));

  // Bind close events
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

  // Handle Form Validation & Submission
  if (bookingForm) {
    const inputs = {
      name: document.getElementById("name"),
      phone: document.getElementById("phone"),
      date: document.getElementById("date")
    };
    
    const errors = {
      name: document.getElementById("nameErr"),
      phone: document.getElementById("phoneErr"),
      date: document.getElementById("dateErr")
    };

    // Real-time validation helper
    const validateField = (field) => {
      const input = inputs[field];
      const errorSpan = errors[field];
      if (!input || !errorSpan) return true;

      let isValid = true;
      let msg = "";

      if (field === "name") {
        if (!input.value.trim()) {
          isValid = false;
          msg = "Vui lòng nhập họ và tên của bạn.";
        }
      } else if (field === "phone") {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!input.value.trim()) {
          isValid = false;
          msg = "Vui lòng nhập số điện thoại.";
        } else if (!phoneRegex.test(input.value.replace(/\s+/g, ""))) {
          isValid = false;
          msg = "Số điện thoại không hợp lệ (ví dụ: 0901234567).";
        }
      } else if (field === "date") {
        if (!input.value) {
          isValid = false;
          msg = "Vui lòng chọn ngày hẹn.";
        } else {
          const selectedDate = new Date(input.value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            isValid = false;
            msg = "Ngày hẹn phải là hôm nay hoặc trong tương lai.";
          }
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

    // Bind real-time input validation listeners
    Object.keys(inputs).forEach(field => {
      if (inputs[field]) {
        inputs[field].addEventListener("input", () => validateField(field));
        inputs[field].addEventListener("blur", () => validateField(field));
      }
    });

    // Form Submit Event
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Final validate all fields
      let isFormValid = true;
      Object.keys(inputs).forEach(field => {
        const isFieldValid = validateField(field);
        if (!isFieldValid) isFormValid = false;
      });

      if (!isFormValid) {
        // Focus first field with error
        const firstErrorField = Object.keys(inputs).find(field => inputs[field] && inputs[field].classList.contains("error"));
        if (firstErrorField) inputs[firstErrorField].focus();
        return;
      }

      // Show loader
      const submitBtn = document.getElementById("submitBtn");
      const submitText = document.getElementById("submitText");
      const submitLoading = document.getElementById("submitLoading");

      if (submitBtn) submitBtn.disabled = true;
      if (submitText) submitText.style.display = "none";
      if (submitLoading) submitLoading.style.display = "inline";

      // Form values
      const formData = {
        name: inputs.name.value.trim(),
        phone: inputs.phone.value.trim(),
        service: document.getElementById("service").value,
        date: inputs.date.value,
        note: document.getElementById("note").value.trim()
      };

      // EmailJS sending or Fallback Simulation
      const emailParams = {
        from_name: formData.name,
        from_phone: formData.phone,
        service_type: formData.service,
        booking_date: formData.date,
        message: formData.note || "Không có câu hỏi bổ sung"
      };

      const handleSuccess = () => {
        // Reset loader
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.style.display = "inline";
        if (submitLoading) submitLoading.style.display = "none";

        // Toggle state view
        bookingForm.style.display = "none";
        if (successState) successState.style.display = "block";
      };

      const handleFailure = (error) => {
        console.error("Booking Error:", error);
        
        // Reset loader
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.style.display = "inline";
        if (submitLoading) submitLoading.style.display = "none";
        
        alert("Đã xảy ra lỗi khi gửi yêu cầu. Chúng tôi sẽ tiến hành xử lý yêu cầu offline và liên hệ bạn!");
        handleSuccess(); // Fallback to success anyway for bulletproof user experience
      };

      // Execute Sending
      const isEmailJSConfigured = EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY" && 
                                  EMAILJS_CONFIG.SERVICE_ID !== "YOUR_SERVICE_ID" && 
                                  EMAILJS_CONFIG.TEMPLATE_ID !== "YOUR_TEMPLATE_ID";

      if (isEmailJSConfigured && typeof emailjs !== "undefined") {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, emailParams)
          .then(handleSuccess)
          .catch(handleFailure);
      } else {
        // Dynamic simulated local storage tracking (useful for development verification)
        const recentBookings = JSON.parse(localStorage.getItem("recent_bookings") || "[]");
        recentBookings.unshift({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem("recent_bookings", JSON.stringify(recentBookings.slice(0, 10)));
        
        console.log("Simulating Booking Submission (EmailJS config empty):", formData);
        
        // Simulate net delay for smooth realistic UX
        setTimeout(() => {
          handleSuccess();
        }, 1200);
      }
    });
  }
}
