import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="password-visibility"
export default class extends Controller {
  static targets = ["input", "icon"]

  connect() {
    // Start with eye-slash icon (password hidden by default)
    const icon = this.iconTarget
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
  }

  toggle() {
    const input = this.inputTarget
    const icon = this.iconTarget

    if (input.type === "password") {
      // Reveal password
      input.type = "text"
      icon.classList.remove("fa-eye-slash")
      icon.classList.add("fa-eye")
    } else {
      // Hide password again
      input.type = "password"
      icon.classList.remove("fa-eye")
      icon.classList.add("fa-eye-slash")
    }
  }
}
