// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

// Registration form controller handling steps, validations, and visual stepper animation
export default class extends Controller {
  static targets = ["step", "stepCircle"]

  connect() {
    this.currentStep = 1
    this.showStep(this.currentStep)
  }

  // Step Navigation ---------------------------------------------------------
  next() {
    if (this.currentStep < this.stepTargets.length) {
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
    // Show current step
    this.stepTargets.forEach((el, idx) => {
      el.classList.toggle("hidden", idx + 1 !== stepNumber)
    })

    // Style the step circles
    this.stepCircleTargets.forEach((circle, idx) => {
      const n = idx + 1
      circle.classList.remove(
        "animate-pulse-primary",
        "bg-[var(--clr-primary-a0)]",
        "bg-orange-500",
        "text-white",
        "text-[var(--clr-light-a0)]",
        "bg-[var(--clr-surface-a30)]"
      )

      if (n === stepNumber) {
        // Active step → pulsing orange primary glow
        circle.classList.add(
          "animate-pulse-primary",
          "bg-[var(--clr-primary-a0)]",
          "text-white"
        )
      } else if (n < stepNumber) {
        // Completed step → solid orange
        circle.classList.add("bg-orange-500", "text-white")
      } else {
        // Inactive step → neutral surface
        circle.classList.add("bg-[var(--clr-surface-a30)]", "text-[var(--clr-light-a0)]")
      }
    })
  }

  // STEP 1 Email Validation -------------------------------------------------
  validateEmail(e) {
    const btn = document.getElementById("step1-next-btn")
    const val = e.target.value.trim()
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)
    btn.disabled = !valid
    btn.classList.toggle("opacity-50", !valid)
    btn.classList.toggle("cursor-not-allowed", !valid)
  }

  // STEP 2 Country → Timezones ---------------------------------------------
  updateTimezones(e) {
    const country = e.target.value
    const tzInput = document.getElementById("timezone-select")
    const tzList = document.getElementById("timezone-list")
    const nextBtn = document.getElementById("step2-next-btn")

    tzInput.value = ""
    tzInput.disabled = true
    tzList.innerHTML = ""

    fetch(`/timezones.json?country=${encodeURIComponent(country)}`)
      .then((r) => r.json())
      .then((zones) => {
        tzList.innerHTML = ""
        if (Array.isArray(zones) && zones.length > 0) {
          zones.forEach((z) => {
            const o = document.createElement("option")
            o.value = z
            tzList.appendChild(o)
          })
          tzInput.disabled = false
        } else {
          const o = document.createElement("option")
          o.value = "No time zones available"
          tzList.appendChild(o)
          tzInput.disabled = true
        }
      })
      .catch((err) => console.error("Timezone load error", err))

    tzInput.addEventListener("input", () => {
      const ok = tzInput.value && tzInput.value !== "No time zones available"
      nextBtn.disabled = !ok
      nextBtn.classList.toggle("opacity-50", !ok)
      nextBtn.classList.toggle("cursor-not-allowed", !ok)
    })
  }

  // STEP 3 RSI Handle Verification -----------------------------------------
  checkHandle(e) {
    const handle = e.target.value.trim()
    const msg = document.getElementById("handle-validation-msg")
    const spinner = document.getElementById("handle-spinner")
    const nextBtn = document.getElementById("step3-next-btn")

    msg.textContent = ""
    spinner.classList.remove("hidden")
    nextBtn.disabled = true

    if (handle.length < 2) {
      spinner.classList.add("hidden")
      msg.textContent = "Handle too short"
      msg.className = "mt-1 text-sm text-[var(--clr-danger-a0)]"
      return
    }

    fetch(`/rsi_citizen/${encodeURIComponent(handle)}`)
      .then((r) => r.json())
      .then((d) => {
        spinner.classList.add("hidden")
        if (d.valid) {
          msg.textContent = `${handle} citizen dossier found`
          msg.className = "mt-1 text-sm text-[var(--clr-success-a0)]"
          nextBtn.disabled = false
          nextBtn.classList.remove("opacity-50", "cursor-not-allowed")
        } else {
          msg.textContent = `${handle} citizen dossier not found – try again.`
          msg.className = "mt-1 text-sm text-[var(--clr-danger-a0)]"
          nextBtn.disabled = true
          nextBtn.classList.add("opacity-50", "cursor-not-allowed")
        }
      })
      .catch(() => {
        spinner.classList.add("hidden")
        msg.textContent = "Error checking handle."
        msg.className = "mt-1 text-sm text-[var(--clr-danger-a0)]"
      })
  }
}
