// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

// Handles step navigation and loading of countries & timezones
export default class extends Controller {
  static targets = ["step", "stepCircle"]

  connect() {
    this.currentStep = 1
    this.showStep()

    // Wait for DOM and then load countries
    requestAnimationFrame(() => this.loadCountries())
  }

  // ---------------------------
  // Step Navigation
  // ---------------------------
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
    this.stepTargets.forEach((el, i) => {
      el.classList.toggle("hidden", i + 1 !== this.currentStep)
    })
    this.stepCircleTargets.forEach((circle, i) => {
      const active = i + 1 === this.currentStep
      circle.classList.toggle("bg-[var(--clr-primary-a0)]", active)
      circle.classList.toggle("text-white", active)
      circle.classList.toggle("bg-[var(--clr-surface-a30)]", !active)
      circle.classList.toggle("text-[var(--clr-light-a0)]", !active)
    })
  }

  // ---------------------------
  // Load Countries from Dataset
  // ---------------------------
  loadCountries() {
    const select = document.getElementById("country-select")
    if (!select) return

    let countries = []
    try {
      const dataset = select.dataset.countries
      if (dataset && dataset.trim().startsWith("[")) {
        countries = JSON.parse(dataset)
      }
    } catch (err) {
      console.error("Error parsing @countries dataset:", err)
    }

    if (!countries.length) {
      console.warn("No countries available in dataset")
      return
    }

    select.innerHTML = '<option value="">Select Country</option>'
    countries.forEach((c) => {
      const option = document.createElement("option")
      option.value = c.code
      option.textContent = c.name
      select.appendChild(option)
    })

    this.makeSearchable(select)
  }

  // ---------------------------
  // Filter Time Zones
  // ---------------------------
  async filterTimezones(event) {
    const code = event.target.value
    const tzSelect = document.getElementById("timezone-select")
    if (!tzSelect) return

    tzSelect.innerHTML = '<option value="">Loading...</option>'

    if (!code) {
      tzSelect.innerHTML = '<option value="">Select Time Zone</option>'
      return
    }

    try {
      const response = await fetch(`/timezones?country=${code}`)
      const zones = await response.json()

      tzSelect.innerHTML = '<option value="">Select Time Zone</option>'
      zones.forEach((zone) => {
        const option = document.createElement("option")
        option.value = zone
        option.textContent = zone
        tzSelect.appendChild(option)
      })

      this.makeSearchable(tzSelect)
    } catch (err) {
      console.error("Error loading timezones:", err)
      tzSelect.innerHTML = '<option value="">Error loading time zones</option>'
    }
  }

  // ---------------------------
  // Add Simple Search Box
  // ---------------------------
  makeSearchable(select) {
    if (select.dataset.hasSearch) return
    select.dataset.hasSearch = true

    const wrapper = document.createElement("div")
    wrapper.classList.add("relative", "w-full", "mb-2")

    const input = document.createElement("input")
    input.type = "text"
    input.placeholder = "Type to search..."
    input.className =
      "w-full mb-2 py-2 px-3 rounded-md bg-[var(--clr-surface-a20)] text-[var(--clr-light-a0)] border border-[var(--clr-surface-a40)] focus:outline-none focus:ring-2 focus:ring-[var(--clr-primary-a20)]"

    const parent = select.parentNode
    parent.insertBefore(wrapper, select)
    wrapper.appendChild(input)
    wrapper.appendChild(select)

    input.addEventListener("input", () => {
      const query = input.value.toLowerCase()
      Array.from(select.options).forEach((opt) => {
        const visible = opt.textContent.toLowerCase().includes(query) || opt.value === ""
        opt.style.display = visible ? "" : "none"
      })
    })
  }
}
