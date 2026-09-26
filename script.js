// ============================================
// SÀNA STYLES — REGISTRATION SYSTEM
// ============================================

// Supabase configuration
const SUPABASE_URL = "https://uxoshrxqseumyfmhvxmh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4b3Nocnhxc2V1bXlmbWh2eG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTEzMDgsImV4cCI6MjEwNTk4NzMwOH0.8qhdGGlwJ8rqFkLcuxh1eXnPOlhIYERZzOK_YBosDlo";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Supabase Edge Function
const NOTIFICATION_FUNCTION =
  `${SUPABASE_URL}/functions/v1/notify-sana-registration`;

// Registration deadline
const REGISTRATION_DEADLINE =
  new Date("2026-10-20T00:00:00+01:00").getTime();

// WhatsApp group
const WHATSAPP_GROUP =
  "https://chat.whatsapp.com/B5MYfUfGXzyDTHSAJ5m2mC?mode=gi_t";

// Tutor WhatsApp
const TUTOR_WHATSAPP =
  "https://wa.me/2347033676641";

// ============================================
// DOM READY
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  initializeCountdown();
  initializeRegistrationButtons();
  initializeRegistrationModal();
  initializeWhatsAppLinks();

});


// ============================================
// REGISTRATION STATUS
// ============================================

function isRegistrationOpen() {
  return Date.now() < REGISTRATION_DEADLINE;
}


// ============================================
// COUNTDOWN
// ============================================

function initializeCountdown() {

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }

  function updateCountdown() {

    const remaining = REGISTRATION_DEADLINE - Date.now();

    if (remaining <= 0) {

      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      document
        .querySelectorAll("[data-open-register]")
        .forEach(button => {

          button.disabled = true;
          button.classList.add("registration-closed");

          const originalText =
            button.dataset.originalText ||
            button.textContent;

          button.dataset.originalText = originalText;
          button.textContent = "Registration Closed";

        });

      return;
    }

    const totalSeconds =
      Math.floor(remaining / 1000);

    const days =
      Math.floor(totalSeconds / 86400);

    const hours =
      Math.floor((totalSeconds % 86400) / 3600);

    const minutes =
      Math.floor((totalSeconds % 3600) / 60);

    const seconds =
      totalSeconds % 60;

    daysElement.textContent =
      String(days).padStart(2, "0");

    hoursElement.textContent =
      String(hours).padStart(2, "0");

    minutesElement.textContent =
      String(minutes).padStart(2, "0");

    secondsElement.textContent =
      String(seconds).padStart(2, "0");
  }

  updateCountdown();

  setInterval(updateCountdown, 1000);
}


// ============================================
// REGISTRATION BUTTONS
// ============================================

function initializeRegistrationButtons() {

  const buttons =
    document.querySelectorAll("[data-open-register]");

  buttons.forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();

      if (!isRegistrationOpen()) {

        alert(
          "Registration for this class has closed."
        );

        return;
      }

      openRegistrationModal();

    });

  });
}


// ============================================
// MODAL
// ============================================

let currentStep = 1;

function initializeRegistrationModal() {

  const modal =
    document.getElementById("registrationModal");

  if (!modal) {
    return;
  }

  // Close buttons
  document
    .querySelectorAll("[data-close-registration]")
    .forEach(button => {

      button.addEventListener("click", closeRegistrationModal);

    });

  // Click outside modal
  modal.addEventListener("click", event => {

    if (event.target === modal) {
      closeRegistrationModal();
    }

  });

  // Escape key
  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeRegistrationModal();
    }

  });

  // Payment step
  const paymentButton =
    document.getElementById("paymentMadeButton");

  if (paymentButton) {

    paymentButton.addEventListener("click", () => {

      currentStep = 2;
      showRegistrationStep(2);

    });

  }

  // Back button
  const backButton =
    document.getElementById("backToPayment");

  if (backButton) {

    backButton.addEventListener("click", () => {

      currentStep = 1;
      showRegistrationStep(1);

    });

  }

  // Registration form
  const form =
    document.getElementById("registrationForm");

  if (form) {

    form.addEventListener(
      "submit",
      handleRegistrationSubmit
    );

  }

  // Receipt input
  const receiptInput =
    document.getElementById("receipt");

  if (receiptInput) {

    receiptInput.addEventListener("change", () => {

      const fileName =
        document.getElementById("receiptFileName");

      if (!fileName) {
        return;
      }

      if (receiptInput.files.length > 0) {

        fileName.textContent =
          receiptInput.files[0].name;

      } else {

        fileName.textContent =
          "No receipt selected";

      }

    });

  }

  showRegistrationStep(1);
}


// ============================================
// OPEN / CLOSE MODAL
// ============================================

function openRegistrationModal() {

  if (!isRegistrationOpen()) {
    return;
  }

  const modal =
    document.getElementById("registrationModal");

  if (!modal) {
    return;
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  currentStep = 1;

  showRegistrationStep(1);
}


function closeRegistrationModal() {

  const modal =
    document.getElementById("registrationModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

}


// ============================================
// SHOW REGISTRATION STEPS
// ============================================

function showRegistrationStep(step) {

  currentStep = step;

  document
    .querySelectorAll("[data-registration-step]")
    .forEach(element => {

      const elementStep =
        Number(
          element.dataset.registrationStep
        );

      element.classList.toggle(
        "active",
        elementStep === step
      );

    });

}


// ============================================
// COPY ACCOUNT NUMBER
// ============================================

document.addEventListener("click", event => {

  const copyButton =
    event.target.closest("[data-copy-account]");

  if (!copyButton) {
    return;
  }

  const accountNumber =
    "6141871365";

  navigator.clipboard
    .writeText(accountNumber)
    .then(() => {

      const originalText =
        copyButton.textContent;

      copyButton.textContent =
        "Copied ✓";

      setTimeout(() => {

        copyButton.textContent =
          originalText;

      }, 2000);

    })
    .catch(() => {

      alert(
        "Account number: 6141871365"
      );

    });

});


// ============================================
// REGISTRATION SUBMISSION
// ============================================

async function handleRegistrationSubmit(event) {

  event.preventDefault();

  const form = event.target;

  if (!isRegistrationOpen()) {

    showRegistrationError(
      "Registration for this class has closed."
    );

    return;
  }

  const fullName =
    document
      .getElementById("fullName")
      ?.value
      .trim();

  const whatsapp =
    document
      .getElementById("whatsapp")
      ?.value
      .trim();

  const email =
    document
      .getElementById("email")
      ?.value
      .trim();

  const receiptInput =
    document.getElementById("receipt");

  if (!fullName || fullName.length < 2) {

    showRegistrationError(
      "Please enter your full name."
    );

    return;
  }

  if (!whatsapp || whatsapp.length < 10) {

    showRegistrationError(
      "Please enter a valid WhatsApp number."
    );

    return;
  }

  if (
    email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {

    showRegistrationError(
      "Please enter a valid email address."
    );

    return;
  }

  if (
    !receiptInput ||
    !receiptInput.files ||
    receiptInput.files.length === 0
  ) {

    showRegistrationError(
      "Please upload your payment receipt."
    );

    return;
  }

  const receiptFile =
    receiptInput.files[0];

  // Basic file protection
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
  ];

  if (!allowedTypes.includes(receiptFile.type)) {

    showRegistrationError(
      "Please upload a JPG, PNG, WEBP, or PDF receipt."
    );

    return;
  }

  // 5 MB maximum
  if (receiptFile.size > 5 * 1024 * 1024) {

    showRegistrationError(
      "Your receipt must be smaller than 5MB."
    );

    return;
  }

  const submitButton =
    form.querySelector(
      'button[type="submit"]'
    );

  const originalButtonText =
    submitButton
      ? submitButton.textContent
      : "";

  if (submitButton) {

    submitButton.disabled = true;
    submitButton.textContent =
      "Submitting...";

  }

  let receiptPath = null;

  try {

    // ========================================
    // CREATE ID BEFORE INSERT
    // ========================================

    const registrationId =
      crypto.randomUUID();

    // ========================================
    // CREATE SAFE FILE NAME
    // ========================================

    const extension =
      getFileExtension(receiptFile.name);

    const safeFileName =
      `${registrationId}.${extension}`;

    receiptPath =
      `${registrationId}/${safeFileName}`;

    // ========================================
    // UPLOAD RECEIPT
    // ========================================

    const {
      error: uploadError
    } =
      await supabaseClient
        .storage
        .from("payment-receipts")
        .upload(
          receiptPath,
          receiptFile,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: receiptFile.type
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    // ========================================
    // INSERT REGISTRATION
    //
    // IMPORTANT:
    // NO .select()
    // NO .single()
    //
    // This avoids requiring public SELECT
    // permission on the registrations table.
    // ========================================

    const {
      error: registrationError
    } =
      await supabaseClient
        .from("registrations")
        .insert({
          id: registrationId,
          full_name: fullName,
          whatsapp: whatsapp,
          email: email || null,
          receipt_path: receiptPath,
          payment_status: "receipt_submitted"
        });

    if (registrationError) {
      throw registrationError;
    }

    // ========================================
    // SEND EMAIL NOTIFICATION
    // ========================================

    try {

      await fetch(
        NOTIFICATION_FUNCTION,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            full_name: fullName,
            whatsapp: whatsapp,
            email: email || "",
            receipt_path: receiptPath,
            registration_id: registrationId
          })
        }
      );

    } catch (notificationError) {

      // Do NOT fail the student's registration
      // if the notification email fails.

      console.error(
        "Notification failed:",
        notificationError
      );

    }

    // ========================================
    // SUCCESS
    // ========================================

    currentStep = 3;

    showRegistrationStep(3);

    form.reset();

    const fileName =
      document.getElementById(
        "receiptFileName"
      );

    if (fileName) {

      fileName.textContent =
        "No receipt selected";

    }

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    // ========================================
    // CLEAN UP RECEIPT IF REGISTRATION FAILED
    // ========================================

    if (receiptPath) {

      try {

        await supabaseClient
          .storage
          .from("payment-receipts")
          .remove([receiptPath]);

      } catch (cleanupError) {

        console.error(
          "Receipt cleanup failed:",
          cleanupError
        );

      }

    }

    showRegistrationError(
      "We couldn't submit your registration. Please check your connection and try again, or contact Hassanat on WhatsApp."
    );

  } finally {

    if (submitButton) {

      submitButton.disabled = false;
      submitButton.textContent =
        originalButtonText;

    }

  }
}


// ============================================
// ERROR MESSAGE
// ============================================

function showRegistrationError(message) {

  const errorElement =
    document.getElementById(
      "registrationError"
    );

  if (errorElement) {

    errorElement.textContent =
      message;

    errorElement.classList.add(
      "visible"
    );

    errorElement.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    return;
  }

  alert(message);
}


// ============================================
// FILE EXTENSION
// ============================================

function getFileExtension(filename) {

  const parts =
    filename.split(".");

  if (parts.length < 2) {
    return "file";
  }

  return parts
    .pop()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}


// ============================================
// WHATSAPP LINKS
// ============================================

function initializeWhatsAppLinks() {

  document
    .querySelectorAll(
      '[data-whatsapp-tutor]'
    )
    .forEach(link => {

      link.href = TUTOR_WHATSAPP;

      link.target = "_blank";
      link.rel = "noopener";

    });


  document
    .querySelectorAll(
      '[data-whatsapp-group]'
    )
    .forEach(link => {

      link.href = WHATSAPP_GROUP;

      link.target = "_blank";
      link.rel = "noopener";

    });

}
