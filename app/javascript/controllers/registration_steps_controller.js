// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

// Handles registration form navigation, validation, and RSI handle verification
export default class extends Controller {
  static targets = ["step", "stepCircle"]

  connect() {
    this.currentStep = 1
    this.totalSteps = this.stepTargets.length
    this.debounceTimer = null
    this.validHandle = false

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
    const checkboxWrapper = document.getElementById("ownership-checkbox")
    const checkbox = document.getElementById("user_confirmed_rsi_ownership")

    // Reset UI
    msg.innerHTML = ""
    msg.className = "mt-1 text-sm flex items-center space-x-1"
    nextBtn.disabled = true
    nextBtn.classList.add("opacity-50", "cursor-not-allowed")
    this.validHandle = false

    if (spinner) spinner.classList.add("hidden")
    if (checkboxWrapper) checkboxWrapper.classList.add("hidden")

    // Local validation first
    if (!/^[A-Za-z0-9]{3,100}$/.test(handle)) {
      msg.innerHTML = `
        <span style="color: var(--clr-warning-a0);" class="flex items-center space-x-1">
          <i class="fa-solid fa-xmark"></i>
          <span>Must be 3–100 characters, no spaces or symbols.</span>
        </span>`
      return
    }

    // Show spinner while checking
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

          this.validHandle = true
          if (checkboxWrapper) checkboxWrapper.classList.remove("hidden")

          // Enable checkbox event
          if (checkbox) {
            checkbox.checked = false
            checkbox.removeEventListener("change", this._checkboxListener)
            this._checkboxListener = this.toggleStep3Next.bind(this)
            checkbox.addEventListener("change", this._checkboxListener)
          }

          // Initially keep next disabled until user checks the box
          this.updateStep3Next()
        } else {
          msg.innerHTML = `
            <span style="color: var(--clr-danger-a0);" class="flex items-center space-x-1">
              <i class="fa-solid fa-xmark"></i>
              <span>${cleanMessage}</span>
            </span>`

          this.validHandle = false
          if (checkboxWrapper) checkboxWrapper.classList.add("hidden")
          this.updateStep3Next()
        }
      } catch (error) {
        if (spinner) spinner.classList.add("hidden")
        msg.innerHTML = `
          <span style="color: var(--clr-warning-a0);" class="flex items-center space-x-1">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Unable to verify handle. Please try again.</span>
          </span>`
        this.validHandle = false
        if (checkboxWrapper) checkboxWrapper.classList.add("hidden")
        this.updateStep3Next()
      }
    }, 500)
  }

  // === Enable Next only if handle valid AND checkbox checked ===
  toggleStep3Next() {
    this.updateStep3Next()
  }

  updateStep3Next() {
    const checkbox = document.getElementById("user_confirmed_rsi_ownership")
    const nextBtn = document.getElementById("step3-next-btn")
    const ready = this.validHandle && checkbox && checkbox.checked

    nextBtn.disabled = !ready
    nextBtn.classList.toggle("opacity-50", !ready)
    nextBtn.classList.toggle("cursor-not-allowed", !ready)
  }

  // === Utility ===
  isDev() {
    return (
      process?.env?.NODE_ENV === "development" ||
      ["localhost", "127.0.0.1"].includes(window.location.hostname)
    )
  }
}
