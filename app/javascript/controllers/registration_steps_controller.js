// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

// Controls multi-step registration UI and styling
export default class extends Controller {
  static targets = ["step", "stepCircle"]
  static values = { timezones: Object }

  connect() {
    this.currentStep = 1
    this.showStep()
  }

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
    // Handle step visibility
    this.stepTargets.forEach((step, i) => {
      step.classList.toggle("hidden", i + 1 !== this.currentStep)
    })

    // Handle stepper circle styles
    this.stepCircleTargets.forEach((circle, i) => {
      const stepNumber = i + 1
      circle.classList.remove(
        "bg-[var(--clr-primary-a0)]",
        "bg-orange-500",
        "text-[var(--clr-light-a0)]",
        "animate-pulse-primary"
      )

      // Active step: pulsating primary
      if (stepNumber === this.currentStep) {
        circle.classList.add(
          "bg-[var(--clr-primary-a0)]",
          "text-white",
          "animate-pulse-primary"
        )
      }
      // Completed step: solid orange
      else if (stepNumber < this.currentStep) {
        circle.classList.add("bg-orange-500", "text-white")
      }
      // Upcoming step: default surface look
      else {
        circle.classList.add(
          "bg-[var(--clr-surface-a30)]",
          "text-[var(--clr-light-a0)]"
        )
      }
    })
  }

  updateTimezones(event) {
    const selectedCountry = event.target.value.trim()
    const timezoneInput = document.querySelector("#timezone-select")
    const timezoneList = document.querySelector("#timezone-list")

    timezoneList.innerHTML = ""
    timezoneInput.value = ""
    timezoneInput.disabled = true

    if (!selectedCountry) return

    const datalistOptions = document.querySelectorAll("#country-list option")
    let alpha2 = null
    datalistOptions.forEach(opt => {
      if (opt.value.toLowerCase() === selectedCountry.toLowerCase()) {
        alpha2 = opt.dataset.alpha2
      }
    })

    let zones = (alpha2 && this.timezonesValue[alpha2]) || []
    if (!Array.isArray(zones)) {
      if (typeof zones === "string" && zones.includes(",")) zones = zones.split(",")
      else if (typeof zones === "string" && zones.trim().length > 0)
        zones = [zones.trim()]
      else zones = []
    }

    zones.forEach(zone => {
      const option = document.createElement("option")
      option.value = zone
      timezoneList.appendChild(option)
    })

    timezoneInput.disabled = zones.length === 0
    timezoneInput.placeholder =
      zones.length > 0 ? "Start typing..." : "No zones available"
  }
}
