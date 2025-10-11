import { Controller } from "@hotwired/stimulus"

// Handles searchable dropdowns (country field etc.)
// Replaces <select> with a text input + dropdown list for KISS search UX.
export default class extends Controller {
  static targets = ["input", "list", "hidden"]

  connect() {
    this.options = Array.from(this.listTarget.querySelectorAll("li"))
    this.hide() // Hide dropdown on load
  }

  show() {
    this.listTarget.classList.remove("hidden")
  }

  hide() {
    setTimeout(() => this.listTarget.classList.add("hidden"), 150)
  }

  filter() {
    const query = this.inputTarget.value.toLowerCase()
    this.options.forEach(opt => {
      const text = opt.textContent.toLowerCase()
      opt.classList.toggle("hidden", !text.includes(query))
    })
    this.show()
  }

  select(event) {
    const li = event.currentTarget
    const value = li.dataset.value
    const text = li.textContent.trim()

    this.inputTarget.value = text
    this.hiddenTarget.value = value

    this.hide()
  }
}
