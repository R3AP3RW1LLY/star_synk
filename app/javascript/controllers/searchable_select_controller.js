// app/javascript/controllers/searchable_select_controller.js
import { Controller } from "@hotwired/stimulus"

// Controller to populate timezones after selecting a country
export default class extends Controller {
  static targets = ["countrySelect", "timezoneInput", "timezoneDropdown"]

  connect() {
    if (this.isDev()) console.log("✅ searchable-select controller connected")
    this.country = null
    this.timezone = null
  }

  async loadTimezones(event) {
    this.country = event.target.value.trim()
    this.timezone = null

    const tzInput = this.timezoneInputTarget
    const tzDropdown = this.timezoneDropdownTarget

    tzInput.value = ""
    tzDropdown.innerHTML = ""
    tzInput.disabled = true

    if (!this.country) return

    try {
      const response = await fetch(`/timezones?country_code=${encodeURIComponent(this.country)}`)
      const data = await response.json()

      if (data.timezones?.length > 0) {
        tzDropdown.innerHTML = ""
        data.timezones.forEach((zone) => {
          const li = document.createElement("li")
          li.textContent = zone
          li.className =
            "px-3 py-1 hover:bg-[var(--clr-surface-a40)] cursor-pointer text-[var(--clr-light-a0)] text-sm"
          li.addEventListener("mousedown", () => {
            tzInput.value = zone
            this.timezone = zone
            this.updateStepStatus()
            this.closeDropdown()
          })
          tzDropdown.appendChild(li)
        })

        tzInput.disabled = false
      } else {
        tzDropdown.innerHTML =
          "<li class='px-3 py-1 text-[var(--clr-warning-a0)] text-sm'>No timezones found</li>"
      }
    } catch (error) {
      console.error("❌ Failed to load timezones:", error)
    }
  }

  openDropdown() {
    if (this.timezoneDropdownTarget.children.length > 0) {
      this.timezoneDropdownTarget.classList.remove("hidden")
    }
  }

  closeDropdown() {
    setTimeout(() => {
      this.timezoneDropdownTarget.classList.add("hidden")
    }, 200)
  }

  filterOptions(event) {
    const filter = event.target.value.toLowerCase()
    const items = this.timezoneDropdownTarget.querySelectorAll("li")
    items.forEach((item) => {
      const visible = item.textContent.toLowerCase().includes(filter)
      item.style.display = visible ? "" : "none"
    })
  }

  updateStepStatus() {
    const countrySelected = !!this.country
    const timezoneSelected = !!this.timezone

    // 🔥 Dispatch global event to registration controller
    const detail = { countrySelected, timezoneSelected }
    window.dispatchEvent(new CustomEvent("searchable-select:locationChange", { detail }))

    if (this.isDev()) {
      console.log(
        `%c📡 searchable-select:locationChange fired → ${JSON.stringify(detail)}`,
        "color: limegreen;"
      )
    }
  }

  isDev() {
    return ["localhost", "127.0.0.1"].includes(window.location.hostname)
  }
}
