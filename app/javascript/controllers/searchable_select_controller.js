// app/javascript/controllers/searchable_select_controller.js
import { Controller } from "@hotwired/stimulus"

// Handles country → timezone selection and dispatches progress to registration-steps
export default class extends Controller {
  static targets = ["countrySelect", "timezoneInput", "timezoneDropdown"]

  connect() {
    this.zones = []
    this.countrySelected = false
    this.timezoneSelected = false

    if (this.isDev()) {
      console.log("✅ searchable-select controller connected")
    }
  }

  async loadTimezones(event) {
    const countryCode = event.target.value
    this.countrySelected = !!countryCode
    this.timezoneSelected = false

    // Notify registration-steps controller
    this.dispatch("location-change", {
      detail: {
        countrySelected: this.countrySelected,
        timezoneSelected: this.timezoneSelected,
      },
      bubbles: true,
    })

    if (!countryCode) return
    try {
      const response = await fetch(`/timezones?country_code=${encodeURIComponent(countryCode)}`)
      const data = await response.json()
      this.zones = data.timezones || []
      this.timezoneInputTarget.disabled = false
      this.timezoneInputTarget.placeholder = "Search or select your timezone"
      this.renderDropdown(this.zones)

      if (this.isDev()) console.log(`🕓 Loaded ${this.zones.length} zones for ${countryCode}`)
    } catch (error) {
      if (this.isDev()) console.error("❌ Failed to load timezones:", error)
    }
  }

  renderDropdown(zones) {
    const dropdown = this.timezoneDropdownTarget
    dropdown.innerHTML = ""

    zones.forEach((zone) => {
      const li = document.createElement("li")
      li.textContent = zone
      li.className =
        "px-3 py-2 cursor-pointer hover:bg-[var(--clr-surface-a30)] text-[var(--clr-light-a0)] text-sm"
      li.addEventListener("mousedown", () => this.selectTimezone(zone))
      dropdown.appendChild(li)
    })

    this.openDropdown()
  }

  filterOptions(event) {
    const query = event.target.value.toLowerCase()
    const filtered = this.zones.filter((z) => z.toLowerCase().includes(query))
    this.renderDropdown(filtered)
  }

  selectTimezone(zone) {
    this.timezoneInputTarget.value = zone
    this.timezoneSelected = true
    this.closeDropdown()

    // Notify registration-steps controller
    this.dispatch("location-change", {
      detail: {
        countrySelected: this.countrySelected,
        timezoneSelected: this.timezoneSelected,
      },
      bubbles: true,
    })

    if (this.isDev()) console.log(`✅ Selected timezone: ${zone}`)
  }

  openDropdown() {
    this.timezoneDropdownTarget.classList.remove("hidden")
  }

  closeDropdown() {
    setTimeout(() => {
      this.timezoneDropdownTarget.classList.add("hidden")
    }, 150)
  }

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
