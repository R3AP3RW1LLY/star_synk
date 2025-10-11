// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

// Handles multi-step registration and time zone filtering.
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
    this.stepTargets.forEach((step, i) => {
      step.classList.toggle("hidden", i + 1 !== this.currentStep)
    })
    this.stepCircleTargets?.forEach((circle, i) => {
      circle.classList.toggle("bg-[var(--clr-primary-a0)]", i + 1 === this.currentStep)
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

    // Find ISO alpha2 from datalist
    const datalistOptions = document.querySelectorAll("#country-list option")
    let alpha2 = null
    datalistOptions.forEach(opt => {
      if (opt.value.toLowerCase() === selectedCountry.toLowerCase()) {
        alpha2 = opt.dataset.alpha2
      }
    })

    const zones = (alpha2 && this.timezonesValue[alpha2]) || []

    if (Array.isArray(zones) && zones.length > 0) {
      zones.forEach(zone => {
        const option = document.createElement("option")
        option.value = zone
        timezoneList.appendChild(option)
      })
      timezoneInput.disabled = false
      timezoneInput.placeholder = "Start typing..."
    } else {
      timezoneInput.placeholder = "No zones available"
    }
  }
}
