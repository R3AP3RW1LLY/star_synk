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
    if (this.stepCircleTargets) {
      this.stepCircleTargets.forEach((circle, i) => {
        circle.classList.toggle("bg-[var(--clr-primary-a0)]", i + 1 === this.currentStep)
      })
    }
  }

  async filterTimezones(event) {
    const countryCode = event.target.value
    const timezoneSelect = document.querySelector("#timezone-select")
    timezoneSelect.innerHTML = '<option value="">Select Time Zone</option>'

    if (!countryCode) return

    try {
      // Full list of supported time zones
      const allZones = Intl.supportedValuesOf("timeZone")

      // Simple filter: match by country substring (handles common cases)
      const filtered = allZones.filter(zone =>
        zone.toLowerCase().includes(countryCode.toLowerCase())
      )

      const zones = filtered.length > 0 ? filtered : allZones

      zones.forEach(zone => {
        const opt = document.createElement("option")
        opt.value = zone
        opt.textContent = zone.replaceAll("_", " ")
        timezoneSelect.appendChild(opt)
      })
    } catch (err) {
      console.error("Timezone load failed:", err)
      timezoneSelect.innerHTML = '<option>Error loading time zones</option>'
    }
  }
}
