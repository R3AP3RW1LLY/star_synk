// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["step", "stepCircle"]

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

    this.stepCircleTargets.forEach((circle, i) => {
      circle.classList.toggle("bg-[var(--clr-primary-a0)]", i + 1 === this.currentStep)
    })

    document.dispatchEvent(new Event("form:updated"))
  }

  async filterTimezones(event) {
    const countryCode = event.target.value
    const timezoneSelect = document.querySelector("#timezone-select")
    if (!timezoneSelect) return

    timezoneSelect.innerHTML = '<option value="">Loading...</option>'
    if (!countryCode) {
      timezoneSelect.innerHTML = '<option value="">Select Time Zone</option>'
      return
    }

    try {
      const response = await fetch(`/timezones?country=${encodeURIComponent(countryCode)}`)
      const zones = await response.json()

      timezoneSelect.innerHTML = '<option value="">Select Time Zone</option>'
      zones.forEach((zone) => {
        const opt = document.createElement("option")
        opt.value = zone.id
        opt.textContent = zone.name
        timezoneSelect.appendChild(opt)
      })

      console.info(`✅ Loaded ${zones.length} time zones for ${countryCode}`)
    } catch (err) {
      console.error("❌ Failed to load time zones:", err)
      timezoneSelect.innerHTML = '<option value="">Error loading time zones</option>'
    }
  }
}
