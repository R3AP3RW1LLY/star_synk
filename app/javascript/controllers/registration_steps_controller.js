// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["step", "stepCircle"]
  static values = { timezones: Object }

  connect() {
    this.currentStep = 1
    this.showStep()
    this.initializeEmailWatcher()
    this.initializeTimezoneWatcher()
    this.initializeHandleWatcher()
  }

  // === STEP 1 EMAIL ===
  initializeEmailWatcher() {
    const emailInput = document.querySelector("#user_email")
    const nextBtn = document.querySelector("#step1-next-btn")
    if (!emailInput || !nextBtn) return

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const toggle = () => {
      const valid = regex.test(emailInput.value.trim())
      nextBtn.disabled = !valid
      nextBtn.classList.toggle("opacity-50", !valid)
      nextBtn.classList.toggle("cursor-not-allowed", !valid)
    }
    emailInput.addEventListener("input", toggle)
    toggle()
  }

  // === STEP 2 TIMEZONE ===
  initializeTimezoneWatcher() {
    const tzSelect = document.querySelector("#timezone-select")
    const nextBtn = document.querySelector("#step2-next-btn")
    if (!tzSelect || !nextBtn) return

    const toggle = () => {
      const valid = tzSelect.value.trim().length > 0
      nextBtn.disabled = !valid
      nextBtn.classList.toggle("opacity-50", !valid)
      nextBtn.classList.toggle("cursor-not-allowed", !valid)
    }
    tzSelect.addEventListener("input", toggle)
    toggle()
  }

  // === STEP 3 STAR CITIZEN HANDLE ===
  initializeHandleWatcher() {
    const input = document.querySelector("#user_star_citizen_handle")
    const message = document.querySelector("#handle-validation-msg")
    const nextBtn = document.querySelector("#step3-next-btn")
    const spinner = document.querySelector("#handle-spinner")
    if (!input || !nextBtn || !message || !spinner) return

    let timeoutId = null

    const validateHandle = (value) => value.length >= 2 && value.length <= 256

    const updateMessage = (text, colorVar) => {
      message.textContent = text
      message.className = `mt-1 text-sm ${colorVar}`
    }

    const showSpinner = (show) => {
      spinner.classList.toggle("hidden", !show)
    }

    const checkHandle = async (handle) => {
      try {
        const res = await fetch(`/rsi_citizen/${encodeURIComponent(handle)}`)
        const data = await res.json()

        if (res.status === 200 && data.valid) {
          updateMessage(`${handle} citizen dossier found!`, "text-[var(--clr-success-a0)]")
          nextBtn.disabled = false
          nextBtn.classList.remove("opacity-50", "cursor-not-allowed")
        } else {
          updateMessage(`${handle} citizen dossier not found – try again.`, "text-[var(--clr-danger-a0)]")
          nextBtn.disabled = true
          nextBtn.classList.add("opacity-50", "cursor-not-allowed")
        }
      } catch (err) {
        updateMessage(`Error checking dossier. Try again.`, "text-[var(--clr-danger-a0)]")
        nextBtn.disabled = true
        nextBtn.classList.add("opacity-50", "cursor-not-allowed")
      } finally {
        showSpinner(false)
      }
    }

    input.addEventListener("input", (e) => {
      const handle = e.target.value.trim()
      if (!validateHandle(handle)) {
        updateMessage("Handle must be 2–256 characters.", "text-[var(--clr-warning-a0)]")
        nextBtn.disabled = true
        nextBtn.classList.add("opacity-50", "cursor-not-allowed")
        return
      }

      updateMessage("Checking RSI dossier...", "text-[var(--clr-primary-a0)]")
      showSpinner(true)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => checkHandle(handle), 800)
    })
  }

  // === NAVIGATION ===
  next() {
    if (this.currentStep < this.stepTargets.length) {
      this.currentStep++
      this.showStep()
    }
  }

  previous() {
    if (this.currentStep > 1) {
      this.currentStep--
      this.showStep()
    }
  }

  showStep() {
    this.stepTargets.forEach((step, i) => step.classList.toggle("hidden", i + 1 !== this.currentStep))
    this.stepCircleTargets.forEach((circle, i) => {
      const stepNumber = i + 1
      circle.classList.remove(
        "bg-[var(--clr-primary-a0)]",
        "bg-orange-500",
        "text-[var(--clr-light-a0)]",
        "animate-pulse-primary"
      )
      if (stepNumber === this.currentStep)
        circle.classList.add("bg-[var(--clr-primary-a0)]", "text-white", "animate-pulse-primary")
      else if (stepNumber < this.currentStep)
        circle.classList.add("bg-orange-500", "text-white")
      else
        circle.classList.add("bg-[var(--clr-surface-a30)]", "text-[var(--clr-light-a0)]")
    })
  }

  updateTimezones(event) {
    const country = event.target.value.trim()
    const tzInput = document.querySelector("#timezone-select")
    const tzList = document.querySelector("#timezone-list")
    tzList.innerHTML = ""
    tzInput.value = ""
    tzInput.disabled = true

    if (!country) return

    const options = document.querySelectorAll("#country-list option")
    let alpha2 = null
    options.forEach(opt => {
      if (opt.value.toLowerCase() === country.toLowerCase()) alpha2 = opt.dataset.alpha2
    })

    let zones = (alpha2 && this.timezonesValue[alpha2]) || []
    if (!Array.isArray(zones)) zones = typeof zones === "string" ? [zones] : []

    zones.forEach(zone => {
      const option = document.createElement("option")
      option.value = zone
      tzList.appendChild(option)
    })

    tzInput.disabled = zones.length === 0
    tzInput.placeholder = zones.length > 0 ? "Start typing..." : "No zones available"
  }
}
