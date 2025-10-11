// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["step", "stepCircle"]

  connect() {
    this.currentStep = 1
    this.totalSteps = this.stepTargets.length
    this.debounceTimer = null

    if (this.isDev()) console.log("✅ registration-steps controller connected")
    this.showStep(this.currentStep)
  }

  // === Step navigation ===
  next() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++
      this.showStep(this.currentStep)
    }
  }

  previous() {
    if (this.currentStep > 1) {
      this.currentStep--
      this.showStep(this.currentStep)
    }
  }

  showStep(stepNumber) {
    this.stepTargets.forEach((el) => {
      el.classList.toggle("hidden", parseInt(el.dataset.step) !== stepNumber)
    })

    this.stepCircleTargets.forEach((circle) => {
      const step = parseInt(circle.dataset.step)
      circle.classList.toggle("bg-[var(--clr-primary-a0)]", step === stepNumber)
      circle.classList.toggle("text-[var(--clr-light-a0)]", step === stepNumber)
    })
  }

  // === Step 1: Email validation ===
  validateEmail(event) {
    const email = event.target.value.trim()
    const nextBtn = document.getElementById("step1-next-btn")
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    nextBtn.disabled = !valid
    nextBtn.classList.toggle("opacity-50", !valid)
    nextBtn.classList.toggle("cursor-not-allowed", !valid)
  }

  // === Step 2: Country + Timezone ===
  handleLocationChange(event) {
    const { countrySelected, timezoneSelected } = event.detail
    const nextBtn = document.getElementById("step2-next-btn")
    const ready = countrySelected && timezoneSelected

    nextBtn.disabled = !ready
    nextBtn.classList.toggle("opacity-50", !ready)
    nextBtn.classList.toggle("cursor-not-allowed", !ready)
  }

  // === Step 3: RSI Citizen Handle Verification ===
  checkHandle(event) {
    clearTimeout(this.debounceTimer)
    const handle = event.target.value.trim()
    const nextBtn = document.getElementById("step3-next-btn")
    const msg = document.getElementById("handle-validation-msg")
    const spinner = document.getElementById("handle-spinner")

    msg.innerHTML = ""
    msg.className = "mt-1 text-sm flex items-center space-x-1"
    nextBtn.disabled = true
    nextBtn.classList.add("opacity-50", "cursor-not-allowed")

    if (spinner) spinner.classList.add("hidden")

    if (!/^[A-Za-z0-9]{3,100}$/.test(handle)) {
      msg.innerHTML = `
        <span style="color: var(--clr-warning-a0);" class="flex items-center space-x-1">
          <i class="fa-solid fa-xmark"></i>
          <span>Handle must be 3–100 characters.</span>
        </span>`
      return
    }

    if (spinner) spinner.classList.remove("hidden")

    this.debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(`/rsi_check?handle=${encodeURIComponent(handle)}`)
        const data = await response.json()
        if (spinner) spinner.classList.add("hidden")

        const cleanMessage = data.message.replace(/[✅✔️❌]/g, "").trim()

        if (data.valid) {
          msg.innerHTML = `
            <span style="color: var(--clr-success-a0);" class="flex items-center space-x-1">
              <i class="fa-solid fa-check"></i>
              <span>${cleanMessage}</span>
            </span>`
          nextBtn.disabled = false
          nextBtn.classList.remove("opacity-50", "cursor-not-allowed")
        } else {
          msg.innerHTML = `
            <span style="color: var(--clr-danger-a0);" class="flex items-center space-x-1">
              <i class="fa-solid fa-xmark"></i>
              <span>${cleanMessage}</span>
            </span>`
        }
      } catch (error) {
        if (spinner) spinner.classList.add("hidden")
        msg.innerHTML = `
          <span style="color: var(--clr-warning-a0);" class="flex items-center space-x-1">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Unable to verify handle. Please try again.</span>
          </span>`
      }
    }, 500)
  }

  // === Utility ===
  isDev() {
    return (
      process?.env?.NODE_ENV === "development" ||
      ["localhost", "127.0.0.1"].includes(window.location.hostname)
    )
  }
}
