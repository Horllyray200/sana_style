// SÀNA STYLE registration system — GitHub Pages + Supabase
// The anon/public key is intended for browser use. Never put a service-role key here.
const SUPABASE_URL = "https://uxoshrxqseumyfmhvxmh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4b3Nocnhxc2V1bXlmbWh2eG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MTEzMDgsImV4cCI6MjEwNTk4NzMwOH0.8qhdGGlwJ8rqFkLcuxh1eXnPOlhIYERZzOK_YBosDlo";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Registration closes at 11:59 PM on 19 October 2026, Nigeria time.
const registrationDeadline = new Date("2026-10-20T00:00:00+01:00");
const countdown = document.getElementById("countdown");
const registerButtons = [...document.querySelectorAll("[data-open-register]")];

function isRegistrationOpen(){ return new Date() < registrationDeadline; }

function updateRegistrationStatus(){
  const now = new Date();
  const remaining = registrationDeadline - now;
  if(!countdown) return;
  if(remaining <= 0){
    countdown.innerHTML = '<div class="closed-message">Registration is now closed.</div>';
    registerButtons.forEach(btn => {
      btn.disabled = true;
      btn.textContent = "Registration closed";
      btn.classList.add("is-disabled");
    });
    return;
  }
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}
updateRegistrationStatus();
setInterval(updateRegistrationStatus, 1000);

const modal = document.getElementById("registerModal");
const steps = [...document.querySelectorAll(".modal-step")];
const dots = [...document.querySelectorAll("[data-step-dot]")];
const receiptInput = document.getElementById("receiptInput");
const submitReceipt = document.getElementById("submitReceipt");
const uploadTitle = document.getElementById("uploadTitle");
const uploadHint = document.getElementById("uploadHint");
const uploadStatus = document.getElementById("uploadStatus");
const fullName = document.getElementById("fullName");
const whatsappNumber = document.getElementById("whatsappNumber");
const emailAddress = document.getElementById("emailAddress");

function showStep(n){
  steps.forEach(s => s.classList.toggle("active", s.dataset.step === String(n)));
  dots.forEach(d => d.classList.toggle("active", d.dataset.stepDot === String(n)));
  document.querySelector(".modal").scrollTop = 0;
}
function openModal(){
  if(!isRegistrationOpen()) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  showStep(1);
}
function closeModal(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.style.overflow=""; }

registerButtons.forEach(btn => btn.addEventListener("click", openModal));
document.querySelector("[data-close-register]").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if(e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if(e.key === "Escape" && modal.classList.contains("open")) closeModal(); });

document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click", () => showStep(btn.dataset.next)));
document.querySelectorAll("[data-prev]").forEach(btn => btn.addEventListener("click", () => showStep(btn.dataset.prev)));

document.getElementById("copyAccount").addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(document.getElementById("accountNumber").textContent.trim());
    const btn = document.getElementById("copyAccount");
    const old = btn.textContent; btn.textContent = "Copied ✓";
    setTimeout(() => btn.textContent = old, 1500);
  }catch(e){ alert("Account number: 6141871365"); }
});

function validateDetails(){
  const name = fullName.value.trim();
  const phone = whatsappNumber.value.trim();
  const email = emailAddress.value.trim();
  if(name.length < 2){ uploadStatus.textContent = "Please enter your full name."; fullName.focus(); return false; }
  if(phone.replace(/\D/g, "").length < 10){ uploadStatus.textContent = "Please enter a valid WhatsApp number."; whatsappNumber.focus(); return false; }
  if(email && !/^\S+@\S+\.\S+$/.test(email)){ uploadStatus.textContent = "Please enter a valid email address or leave it blank."; emailAddress.focus(); return false; }
  return true;
}

receiptInput.addEventListener("change", () => {
  const file = receiptInput.files[0];
  submitReceipt.disabled = true;
  uploadStatus.textContent = "";
  if(!file){ uploadTitle.textContent = "Choose receipt"; uploadHint.textContent = "PNG, JPG, WEBP or PDF · max 10MB"; return; }
  const max = 10 * 1024 * 1024;
  const allowed = ["image/png","image/jpeg","image/webp","application/pdf"];
  if(file.size > max){
    receiptInput.value = "";
    uploadStatus.textContent = "That file is larger than 10MB. Please choose a smaller receipt.";
    return;
  }
  if(!allowed.includes(file.type)){
    receiptInput.value = "";
    uploadStatus.textContent = "Please upload a PNG, JPG, WEBP or PDF receipt.";
    return;
  }
  uploadTitle.textContent = file.name;
  uploadHint.textContent = `${(file.size/1024/1024).toFixed(2)} MB · Ready to submit`;
  uploadStatus.textContent = "Receipt selected successfully.";
  submitReceipt.disabled = false;
});

submitReceipt.addEventListener("click", async () => {
  if(!isRegistrationOpen()){
    uploadStatus.textContent = "Registration has closed. Thank you for your interest in SÀNA STYLE.";
    submitReceipt.disabled = true;
    return;
  }
  if(!validateDetails()) return;
  const file = receiptInput.files[0];
  if(!file){ uploadStatus.textContent = "Please choose your payment receipt."; return; }

  const originalText = submitReceipt.textContent;
  submitReceipt.disabled = true;
  submitReceipt.textContent = "Submitting…";
  uploadStatus.textContent = "Uploading your receipt securely…";

  const extension = (file.name.split(".").pop() || "file").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeName = fullName.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "student";
  const uniqueId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const receiptPath = `receipts/${uniqueId}-${safeName}.${extension}`;

  try{
    // Upload the receipt to the private Supabase Storage bucket.
    const { error: uploadError } = await supabaseClient.storage
      .from("payment-receipts")
      .upload(receiptPath, file, { contentType: file.type, upsert: false });

    if(uploadError) throw new Error(uploadError.message || "Receipt upload failed.");

    // Store the student registration and the private receipt path.
    const { error: insertError } = await supabaseClient
      .from("registrations")
      .insert({
        full_name: fullName.value.trim(),
        whatsapp: whatsappNumber.value.trim(),
        email: emailAddress.value.trim() || null,
        receipt_path: receiptPath,
        payment_status: "receipt_submitted"
      });

    if(insertError){
      // Best-effort cleanup if the database insert fails after the file upload.
      await supabaseClient.storage.from("payment-receipts").remove([receiptPath]);
      throw new Error(insertError.message || "Registration could not be saved.");
    }

    uploadStatus.textContent = "Registration submitted successfully.";
    showStep(3);
  }catch(error){
    console.error(error);
    uploadStatus.textContent = "We couldn't submit your registration. Please check your connection and try again, or contact Hassanat on WhatsApp.";
    submitReceipt.disabled = false;
    submitReceipt.textContent = originalText;
  }
});

document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", () => closeModal()));
