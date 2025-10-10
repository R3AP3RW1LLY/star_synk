import { Controller } from "@hotwired/stimulus"

// Handles active state highlighting for navbar links
export default class extends Controller {
  connect() {
    const currentPath = window.location.pathname

    this.element.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href")
      if (href === currentPath) {
        link.classList.add("active")
      }
    })
  }
}
