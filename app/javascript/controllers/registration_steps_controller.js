// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

// Handles the 4-step registration wizard
export default class extends Controller {
  static targets = ["step", "stepCircle"]

  connect() {
    this.currentStep = 1
    this.totalSteps = this.stepTargets.length

    if (this.isDev()) {
      console.log("✅ registration-steps controller connected")
      console.log(`Current step: ${this.currentStep}/${this.totalSteps}`)
    }

    this.showStep(this.currentStep)
  }

  // === Navigation ===
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

    if (this.isDev()) console.log(`➡️ Showing step ${stepNumber}`)
  }

  // === Step 1: Email validation ===
  validateEmail(event) {
    const email = event.target.value.trim()
    const nextBtn = document.getElementById("step1-next-btn")
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (valid) {
      nextBtn.disabled = false
      nextBtn.classList.remove("opacity-50", "cursor-not-allowed")
    } else {
      nextBtn.disabled = true
      nextBtn.classList.add("opacity-50", "cursor-not-allowed")
    }

    if (this.isDev()) console.log(`📧 Email valid: ${valid}`)
  }

  // === Step 2: Country + Timezone ===
  handleLocationChange(event) {
    const { countrySelected, timezoneSelected } = event.detail
    const nextBtn = document.getElementById("step2-next-btn")
    const ready = countrySelected && timezoneSelected

    if (ready) {
      nextBtn.disabled = false
      nextBtn.classList.remove("opacity-50", "cursor-not-allowed")
      nextBtn.classList.add("hover:bg-[var(--clr-primary-a20)]", "transition-all")
    } else {
      nextBtn.disabled = true
      nextBtn.classList.add("opacity-50", "cursor-not-allowed")
      nextBtn.classList.remove("hover:bg-[var(--clr-primary-a20)]")
    }

    if (this.isDev())
      console.log(`🌎 Location valid: country=${countrySelected}, timezone=${timezoneSelected}`)
  }

  // === Step 3: Star Citizen Handle ===
  checkHandle(event) {
    const handle = event.target.value.trim()
    const nextBtn = document.getElementById("step3-next-btn")
    const valid = handle.length >= 3

    nextBtn.disabled = !valid
    nextBtn.classList.toggle("opacity-50", !valid)
    nextBtn.classList.toggle("cursor-not-allowed", !valid)

    if (this.isDev()) console.log(`🪐 Handle valid: ${valid}`)
  }

  // === Utility: dev-only logging ===
  isDev() {
    try {
      if (process?.env?.NODE_ENV === "development") return true
    } catch {
      /* ignore */
    }
    return (
      window?.location?.hostname === "localhost" ||
      window?.location?.hostname === "127.0.0.1"
    )
  }
}
