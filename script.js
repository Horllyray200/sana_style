// ============================================
// SÀNA STYLES REGISTRATION SYSTEM
// GitHub Pages + Supabase + Resend
// ============================================

const SUPABASE_URL =
  "https://uxoshrxqseumyfmhvxmh.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4b3NoHnhxc2V1bXlmbWh2eG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTEzMDgsImV4cCI6MjEwNTk4NzMwOH0.8qhdGGlwJ8rqFkLcuxh1eXnPOlhIYERZzOK_YBosDlo";

const NOTIFICATION_FUNCTION =
  `${SUPABASE_URL}/functions/v1/notify-sana-registration`;

const REGISTRATION_DEADLINE =
  new Date("2026-10-20T00:00:00+01:00");

const WHATSAPP_GROUP =
  "https://chat.whatsapp.com/B5MYfUfGXzyDTHSAJ5m2mC?mode=gi_t";


// ============================================
// SUPABASE
// ============================================

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


// ============================================
// INITIALIZE AFTER PAGE LOAD
// ============================================

function initializeSanaStyle() {

  const countdown =
    document.getElementById("countdown");

  const registerButtons =
    [...document.querySelectorAll(
      "[data-open-register]"
    )];

  const modal =
    document.getElementById("registerModal");

  const steps =
    [...document.querySelectorAll(
      ".modal-step"
    )];

  const dots =
    [...document.querySelectorAll(
      "[data-step-dot]"
    )];

  const receiptInput =
    document.getElementById("receiptInput");

  const submitReceipt =
    document.getElementById("submitReceipt");

  const uploadTitle =
    document.getElementById("uploadTitle");

  const uploadHint =
    document.getElementById("uploadHint");

  const uploadStatus =
    document.getElementById("uploadStatus");

  const fullName =
    document.getElementById("fullName");

  const whatsappNumber =
    document.getElementById("whatsappNumber");

  const emailAddress =
    document.getElementById("emailAddress");

  // ==========================================
  // SAFETY CHECK
  // ==========================================

  if (!modal) {
    console.error(
      "SÀNA STYLES: registerModal was not found."
    );
    return;
  }


  // ==========================================
  // REGISTRATION STATUS
  // ==========================================

  function isRegistrationOpen() {

    return (
      new Date() <
      REGISTRATION_DEADLINE
    );

  }


  // ==========================================
  // COUNTDOWN
  // ==========================================

  function updateCountdown() {

    if (!countdown) {
      return;
    }

    const remaining =
      REGISTRATION_DEADLINE -
      new Date();

    if (remaining <= 0) {

      countdown.innerHTML =
        '<div class="closed-message">Registration is now closed.</div>';

      registerButtons.forEach(button => {

        button.disabled = true;
        button.textContent =
          "Registration closed";

        button.classList.add(
          "is-disabled"
        );

      });

      return;
    }

    const totalSeconds =
      Math.floor(
        remaining / 1000
      );

    const days =
      Math.floor(
        totalSeconds / 86400
      );

    const hours =
      Math.floor(
        (totalSeconds % 86400) / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );

    const seconds =
      totalSeconds % 60;

    const daysElement =
      document.getElementById("days");

    const hoursElement =
      document.getElementById("hours");

    const minutesElement =
      document.getElementById("minutes");

    const secondsElement =
      document.getElementById("seconds");

    if (daysElement) {
      daysElement.textContent =
        String(days).padStart(2, "0");
    }

    if (hoursElement) {
      hoursElement.textContent =
        String(hours).padStart(2, "0");
    }

    if (minutesElement) {
      minutesElement.textContent =
        String(minutes).padStart(2, "0");
    }

    if (secondsElement) {
      secondsElement.textContent =
        String(seconds).padStart(2, "0");
    }

  }

  updateCountdown();

  setInterval(
    updateCountdown,
    1000
  );


  // ==========================================
  // MODAL STEP CONTROL
  // ==========================================

  function showStep(number) {

    steps.forEach(step => {

      step.classList.toggle(
        "active",
        step.dataset.step ===
        String(number)
      );

    });

    dots.forEach(dot => {

      dot.classList.toggle(
        "active",
        dot.dataset.stepDot ===
        String(number)
      );

    });

    const modalContent =
      modal.querySelector(".modal");

    if (modalContent) {
      modalContent.scrollTop = 0;
    }

  }


  // ==========================================
  // OPEN MODAL
  // ==========================================

  function openModal(event) {

    if (event) {
      event.preventDefault();
    }

    if (!isRegistrationOpen()) {

      alert(
        "Registration for this class has closed."
      );

      return;
    }

    modal.classList.add("open");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

    showStep(1);

  }


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  function closeModal() {

    modal.classList.remove(
      "open"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      "";

  }


  // ==========================================
  // REGISTRATION BUTTONS
  // ==========================================

  registerButtons.forEach(button => {

    button.addEventListener(
      "click",
      openModal
    );

  });


  // ==========================================
  // CLOSE BUTTON
  // ==========================================

  const closeButton =
    document.querySelector(
      "[data-close-register]"
    );

  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeModal
    );

  }


  // ==========================================
  // CLICK OUTSIDE MODAL
  // ==========================================

  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        closeModal();

      }

    }
  );


  // ==========================================
  // ESC KEY
  // ==========================================

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        modal.classList.contains("open")
      ) {

        closeModal();

      }

    }
  );


  // ==========================================
  // NEXT STEP
  // ==========================================

  document
    .querySelectorAll("[data-next]")
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          showStep(
            button.dataset.next
          );

        }
      );

    });


  // ==========================================
  // PREVIOUS STEP
  // ==========================================

  document
    .querySelectorAll("[data-prev]")
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          showStep(
            button.dataset.prev
          );

        }
      );

    });


  // ==========================================
  // COPY ACCOUNT NUMBER
  // ==========================================

  const copyAccount =
    document.getElementById(
      "copyAccount"
    );

  if (copyAccount) {

    copyAccount.addEventListener(
      "click",
      async () => {

        const accountNumber =
          document
            .getElementById(
              "accountNumber"
            )
            ?.textContent
            .trim();

        try {

          await navigator.clipboard.writeText(
            accountNumber
          );

          const original =
            copyAccount.textContent;

          copyAccount.textContent =
            "Copied ✓";

          setTimeout(() => {

            copyAccount.textContent =
              original;

          }, 1500);

        } catch {

          alert(
            "Account number: 6141871365"
          );

        }

      }
    );

  }


  // ==========================================
  // RECEIPT UPLOAD
  // ==========================================

  if (receiptInput) {

    receiptInput.addEventListener(
      "change",
      () => {

        const file =
          receiptInput.files[0];

        submitReceipt.disabled =
          true;

        uploadStatus.textContent =
          "";

        if (!file) {

          uploadTitle.textContent =
            "Choose receipt";

          uploadHint.textContent =
            "PNG, JPG, WEBP or PDF · max 10MB";

          return;

        }

        const maximumSize =
          10 * 1024 * 1024;

        const allowedTypes = [
          "image/png",
          "image/jpeg",
          "image/webp",
          "application/pdf"
        ];

        if (
          file.size >
          maximumSize
        ) {

          receiptInput.value =
            "";

          uploadStatus.textContent =
            "That file is larger than 10MB. Please choose a smaller receipt.";

          return;

        }

        if (
          !allowedTypes.includes(
            file.type
          )
        ) {

          receiptInput.value =
            "";

          uploadStatus.textContent =
            "Please upload a PNG, JPG, WEBP or PDF receipt.";

          return;

        }

        uploadTitle.textContent =
          file.name;

        uploadHint.textContent =
          `${(
            file.size /
            1024 /
            1024
          ).toFixed(2)} MB · Ready to submit`;

        uploadStatus.textContent =
          "Receipt selected successfully.";

        submitReceipt.disabled =
          false;

      }
    );

  }


  // ==========================================
  // VALIDATE STUDENT DETAILS
  // ==========================================

  function validateDetails() {

    const name =
      fullName.value.trim();

    const phone =
      whatsappNumber.value.trim();

    const email =
      emailAddress.value.trim();

    if (name.length < 2) {

      uploadStatus.textContent =
        "Please enter your full name.";

      fullName.focus();

      return false;

    }

    if (
      phone.replace(
        /\D/g,
        ""
      ).length < 10
    ) {

      uploadStatus.textContent =
        "Please enter a valid WhatsApp number.";

      whatsappNumber.focus();

      return false;

    }

    if (
      email &&
      !/^\S+@\S+\.\S+$/.test(email)
    ) {

      uploadStatus.textContent =
        "Please enter a valid email address or leave it blank.";

      emailAddress.focus();

      return false;

    }

    return true;

  }


  // ==========================================
  // SUBMIT REGISTRATION
  // ==========================================

  if (submitReceipt) {

    submitReceipt.addEventListener(
      "click",
      async () => {

        if (!isRegistrationOpen()) {

          uploadStatus.textContent =
            "Registration has closed. Thank you for your interest in SÀNA STYLE.";

          submitReceipt.disabled =
            true;

          return;

        }

        if (!validateDetails()) {
          return;
        }

        const file =
          receiptInput.files[0];

        if (!file) {

          uploadStatus.textContent =
            "Please choose your payment receipt.";

          return;

        }

        const originalText =
          submitReceipt.textContent;

        submitReceipt.disabled =
          true;

        submitReceipt.textContent =
          "Submitting…";

        uploadStatus.textContent =
          "Uploading your receipt securely…";


        // ====================================
        // CREATE UNIQUE REGISTRATION ID
        // ====================================

        const registrationId =
          crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`;


        // ====================================
        // SAFE FILE NAME
        // ====================================

        const extension =
          (
            file.name
              .split(".")
              .pop() ||
            "file"
          )
            .toLowerCase()
            .replace(
              /[^a-z0-9]/g,
              ""
            );

        const safeName =
          fullName.value
            .trim()
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            )
            .replace(
              /^-|-$/g,
              ""
            )
            .slice(
              0,
              50
            ) ||
          "student";

        const receiptPath =
          `receipts/${registrationId}-${safeName}.${extension}`;


        try {

          // ==================================
          // 1. UPLOAD RECEIPT
          // ==================================

          const {
            error: uploadError
          } =
            await supabaseClient
              .storage
              .from(
                "payment-receipts"
              )
              .upload(
                receiptPath,
                file,
                {
                  contentType:
                    file.type,

                  upsert:
                    false
                }
              );

          if (uploadError) {

            throw new Error(
              uploadError.message ||
              "Receipt upload failed."
            );

          }


          // ==================================
          // 2. SAVE REGISTRATION
          //
          // IMPORTANT:
          // NO .select()
          // NO .single()
          // ==================================

          const {
            error: insertError
          } =
            await supabaseClient
              .from(
                "registrations"
              )
              .insert({
                id:
                  registrationId,

                full_name:
                  fullName.value.trim(),

                whatsapp:
                  whatsappNumber.value.trim(),

                email:
                  emailAddress.value.trim() ||
                  null,

                receipt_path:
                  receiptPath,

                payment_status:
                  "receipt_submitted"
              });


          if (insertError) {

            // Delete uploaded receipt
            // if database insert fails.

            await supabaseClient
              .storage
              .from(
                "payment-receipts"
              )
              .remove([
                receiptPath
              ]);

            throw new Error(
              insertError.message ||
              "Registration could not be saved."
            );

          }


          // ==================================
          // 3. SEND EMAIL NOTIFICATION
          // ==================================

          try {

            const notificationResponse =
              await fetch(
                NOTIFICATION_FUNCTION,
                {
                  method:
                    "POST",

                  headers: {
                    "Content-Type":
                      "application/json"
                  },

                  body:
                    JSON.stringify({
                      full_name:
                        fullName.value.trim(),

                      whatsapp:
                        whatsappNumber.value.trim(),

                      email:
                        emailAddress.value.trim() ||
                        "",

                      receipt_path:
                        receiptPath,

                      registration_id:
                        registrationId
                    })
                }
              );

            if (
              !notificationResponse.ok
            ) {

              console.error(
                "Notification returned an error:",
                await notificationResponse.text()
              );

            }

          } catch (
            notificationError
          ) {

            // Email failure must NOT
            // cancel a successful registration.

            console.error(
              "Email notification failed:",
              notificationError
            );

          }


          // ==================================
          // 4. SUCCESS
          // ==================================

          uploadStatus.textContent =
            "Registration submitted successfully.";

          showStep(3);

          // Reset form
          fullName.value = "";
          whatsappNumber.value = "";
          emailAddress.value = "";
          receiptInput.value = "";

          uploadTitle.textContent =
            "Choose receipt";

          uploadHint.textContent =
            "PNG, JPG, WEBP or PDF · max 10MB";

          submitReceipt.disabled =
            true;

          submitReceipt.textContent =
            originalText;


        } catch (error) {

          console.error(
            "SÀNA STYLE registration error:",
            error
          );

          uploadStatus.textContent =
            "We couldn't submit your registration. Please check your connection and try again, or contact Hassanat on WhatsApp.";

          submitReceipt.disabled =
            false;

          submitReceipt.textContent =
            originalText;

        }

      }
    );

  }


  // ==========================================
  // CLOSE MODAL WHEN INTERNAL ANCHOR CLICKED
  // ==========================================

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(anchor => {

      anchor.addEventListener(
        "click",
        () => {

          if (
            !anchor.closest(
              "#registerModal"
            )
          ) {

            closeModal();

          }

        }
      );

    });

}


// ============================================
// START
// ============================================

// This handles BOTH cases:
// - script loaded before DOM is ready
// - script loaded after DOM is ready

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeSanaStyle
  );

} else {

  initializeSanaStyle();

}
