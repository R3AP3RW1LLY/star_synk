// app/javascript/controllers/registration_steps_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["step", "stepCircle"]

  connect() {
    this.currentStep = 1
    this.showStep()
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
  // Load Country Data
  // ---------------------------
  loadCountries() {
    const dataset = document.getElementById("country-data")
    if (!dataset) return

    let countries = []
    try {
      if (dataset.textContent.trim().startsWith("[")) {
        countries = JSON.parse(dataset.textContent)
      }
    } catch (err) {
      console.error("Error parsing countries JSON:", err)
    }

    if (!countries.length) {
      console.warn("No countries found")
      return
    }

    this.initSearchableDropdown("country", countries.map(c => ({ label: c.name, value: c.code })))
  }

  // ---------------------------
  // Load Timezones when Country Selected
  // ---------------------------
  async loadTimezones(countryCode) {
    const container = document.getElementById("timezone-dropdown")
    container.innerHTML = '<div class="text-sm text-[var(--clr-light-a0)]">Loading...</div>'

    try {
      const response = await fetch(`/timezones?country=${countryCode}`)
      const zones = await response.json()
      this.initSearchableDropdown("timezone", zones.map(z => ({ label: z, value: z })))
    } catch (err) {
      console.error("Error loading timezones:", err)
      container.innerHTML = '<div class="text-red-400 text-sm">Failed to load time zones.</div>'
    }
  }

  // ---------------------------
  // Create Searchable Dropdown
  // ---------------------------
  initSearchableDropdown(type, items) {
    const container = document.getElementById(`${type}-dropdown`)
    container.innerHTML = ""

    const wrapper = document.createElement("div")
    wrapper.className = "relative"

    const input = document.createElement("input")
    input.type = "text"
    input.placeholder = `Search ${type === "country" ? "Country" : "Time Zone"}...`
    input.className =
      "w-full py-2 px-3 rounded-md bg-[var(--clr-surface-a20)] text-[var(--clr-light-a0)] border border-[var(--clr-surface-a40)] focus:outline-none focus:ring-2 focus:ring-[var(--clr-primary-a20)]"
    input.autocomplete = "off"

    const hiddenInput = document.createElement("input")
    hiddenInput.type = "hidden"
    hiddenInput.name = type === "country" ? "user[country]" : "user[time_zone]"

    const dropdown = document.createElement("div")
    dropdown.className =
      "absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-[var(--clr-surface-a20)] border border-[var(--clr-surface-a40)] rounded-md shadow-lg hidden"

    items.forEach((item) => {
      const option = document.createElement("div")
      option.textContent = item.label
      option.dataset.value = item.value
      option.className =
        "px-3 py-2 text-sm text-[var(--clr-light-a0)] hover:bg-[var(--clr-primary-a20)] cursor-pointer"
      option.addEventListener("click", () => {
        input.value = item.label
        hiddenInput.value = item.value
        dropdown.classList.add("hidden")

        if (type === "country") {
          this.loadTimezones(item.value)
        }
      })
      dropdown.appendChild(option)
    })

    input.addEventListener("input", () => {
      const query = input.value.toLowerCase()
      dropdown.querySelectorAll("div").forEach((opt) => {
        opt.style.display = opt.textContent.toLowerCase().includes(query) ? "" : "none"
      })
      dropdown.classList.remove("hidden")
    })

    input.addEventListener("focus", () => dropdown.classList.remove("hidden"))
    input.addEventListener("blur", () => setTimeout(() => dropdown.classList.add("hidden"), 150))

    wrapper.appendChild(input)
    wrapper.appendChild(hiddenInput)
    wrapper.appendChild(dropdown)
    container.appendChild(wrapper)
  }
}
