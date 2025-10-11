// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

// Registration form flow: handles validation, progress, and UI state
export default class extends Controller {
  static targets = ["step", "stepCircle"]

  connect() {
    this.currentStep = 1
    this.totalSteps = this.stepTargets.length
    this.validHandle = false
    this.debounceTimer = null

    // Listen for location changes from searchable-select controller
    window.addEventListener("searchable-select:locationChange", (e) => this.handleLocationChange(e))

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

  // === Show Step Logic ===
  showStep(stepNumber) {
    this.stepTargets.forEach((el) => {
      el.classList.toggle("hidden", parseInt(el.dataset.step) !== stepNumber)
    })

    this.stepCircleTargets.forEach((circle) => {
      const step = parseInt(circle.dataset.step)
      circle.classList.toggle("bg-[var(--clr-primary-a0)]", step === stepNumber)
      circle.classList.toggle("text-[var(--clr-light-a0)]", step === stepNumber)
    })

    const leftCard = document.getElementById("left-checklist")
    const rightCard = document.getElementById("right-password-check")
    const layout = document.getElementById("registration-layout")

    // === Left card: Registration Progress ===
    if (leftCard) {
      if (stepNumber >= 2) {
        leftCard.classList.remove("hidden", "opacity-0")
        leftCard.classList.add("opacity-100", "transition-opacity", "duration-500")
      } else {
        leftCard.classList.add("hidden", "opacity-0")
        leftCard.classList.remove("opacity-100")
      }
    }

    // === Right card: Password Requirements ===
    if (rightCard) {
      if (stepNumber === 4) {
        rightCard.classList.remove("hidden", "opacity-0")
        rightCard.classList.add("opacity-100", "transition-opacity", "duration-500")
      } else {
        rightCard.classList.add("hidden", "opacity-0")
        rightCard.classList.remove("opacity-100")
      }
    }

    // === Layout centering ===
    if (layout) {
      if (stepNumber >= 2) {
        layout.classList.add("justify-between")
        layout.classList.remove("justify-center")
      } else {
        layout.classList.add("justify-center")
        layout.classList.remove("justify-between")
      }
    }
  }

  // === Step 1: Email Validation ===
  validateEmail(event) {
    const email = event.target.value.trim()
    const nextBtn = document.getElementById("step1-next-btn")
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    nextBtn.disabled = !valid
    nextBtn.classList.toggle("opacity-50", !valid)
    nextBtn.classList.toggle("cursor-not-allowed", !valid)
    this.updateChecklist("check-email", valid)
  }

  // === Step 2: Country + Timezone ===
  handleLocationChange(event) {
    const { countrySelected, timezoneSelected } = event.detail || {}
    const nextBtn = document.getElementById("step2-next-btn")
    const ready = countrySelected && timezoneSelected

    if (nextBtn) {
      nextBtn.disabled = !ready
      nextBtn.classList.toggle("opacity-50", !ready)
      nextBtn.classList.toggle("cursor-not-allowed", !ready)
    }

    this.updateChecklist("check-location", ready)

    if (this.isDev()) {
      console.log(`📡 Step 2 updated → Country: ${countrySelected}, Timezone: ${timezoneSelected}`)
    }
  }

  // === Step 3: RSI Handle Checker ===
  checkHandle(event) {
    clearTimeout(this.debounceTimer)
    const handle = event.target.value.trim()
    const nextBtn = document.getElementById("step3-next-btn")
    const msg = document.getElementById("handle-validation-msg")
    const spinner = document.getElementById("handle-spinner")
    const checkboxWrapper = document.getElementById("ownership-checkbox")
    const checkbox = document.getElementById("user_confirmed_rsi_ownership")

    msg.innerHTML = ""
    this.validHandle = false
    nextBtn.disabled = true
    nextBtn.classList.add("opacity-50", "cursor-not-allowed")
    spinner.classList.add("hidden")
    checkboxWrapper.classList.add("hidden")

    // Local validation
    if (!/^[A-Za-z0-9]{3,100}$/.test(handle)) {
      msg.innerHTML = `<span style='color: var(--clr-warning-a0);'>
        <i class='fa-solid fa-xmark'></i> Handle must be 3–100 characters (letters/numbers only).</span>`
      this.updateChecklist("check-handle", false)
      return
    }

    spinner.classList.remove("hidden")

    this.debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/rsi_check?handle=${encodeURIComponent(handle)}`)
        const data = await res.json()
        spinner.classList.add("hidden")

        const cleanMessage = data.message.replace(/[✅✔️❌]/g, "").trim()

        if (data.valid) {
          msg.innerHTML = `<span style='color: var(--clr-success-a0);'>
            <i class='fa-solid fa-check'></i> ${cleanMessage}</span>`
          this.validHandle = true
          this.updateChecklist("check-handle", true)
          checkboxWrapper.classList.remove("hidden")
          checkbox.addEventListener("change", () => this.updateStep3Next())
          this.updateStep3Next()
        } else {
          msg.innerHTML = `<span style='color: var(--clr-danger-a0);'>
            <i class='fa-solid fa-xmark'></i> ${cleanMessage}</span>`
          this.validHandle = false
          this.updateChecklist("check-handle", false)
          checkboxWrapper.classList.add("hidden")
          this.updateStep3Next()
        }
      } catch {
        spinner.classList.add("hidden")
        msg.innerHTML = `<span style='color: var(--clr-warning-a0);'>
          <i class='fa-solid fa-triangle-exclamation'></i> Unable to verify handle. Please try again.</span>`
        this.updateChecklist("check-handle", false)
      }
    }, 500)
  }

  updateStep3Next() {
    const checkbox = document.getElementById("user_confirmed_rsi_ownership")
    const nextBtn = document.getElementById("step3-next-btn")
    const ready = this.validHandle && checkbox?.checked

    nextBtn.disabled = !ready
    nextBtn.classList.toggle("opacity-50", !ready)
    nextBtn.classList.toggle("cursor-not-allowed", !ready)
    this.updateChecklist("check-handle", ready)
  }

  // === Step 4: Password Validation ===
  evaluatePassword(event) {
    const pwd = event.target.value
    const submitBtn = document.getElementById("step4-submit-btn")

    const rules = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      symbol: /[^A-Za-z0-9]/.test(pwd),
    }

    let allValid = true
    Object.entries(rules).forEach(([key, valid]) => {
      const ruleEl = document.querySelector(`#password-rules [data-rule='${key}'] i`)
      if (valid) {
        ruleEl.classList.remove("fa-circle", "text-[var(--clr-surface-a40)]")
        ruleEl.classList.add("fa-check", "text-[var(--clr-success-a0)]")
      } else {
        ruleEl.classList.remove("fa-check", "text-[var(--clr-success-a0)]")
        ruleEl.classList.add("fa-circle", "text-[var(--clr-surface-a40)]")
        allValid = false
      }
    })

    submitBtn.disabled = !allValid
    submitBtn.classList.toggle("opacity-50", !allValid)
    submitBtn.classList.toggle("cursor-not-allowed", !allValid)
    this.updateChecklist("check-password", allValid)
  }

  // === Checklist updater ===
  updateChecklist(id, valid) {
    const el = document.getElementById(id)
    const icon = el?.querySelector("i")
    if (!icon) return

    if (valid) {
      icon.classList.remove("fa-xmark", "text-[var(--clr-danger-a0)]")
      icon.classList.add("fa-check", "text-[var(--clr-success-a0)]")
    } else {
      icon.classList.remove("fa-check", "text-[var(--clr-success-a0)]")
      icon.classList.add("fa-xmark", "text-[var(--clr-danger-a0)]")
    }
  }

  isDev() {
    return ["localhost", "127.0.0.1"].includes(window.location.hostname)
  }
}
