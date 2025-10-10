import { Controller } from "@hotwired/stimulus"

// Dynamically centers a main content container between the header and footer.
// Keeps footer visible, prevents scrollbars, and centers vertically.
export default class extends Controller {
  connect() {
    this.updateLayout()
    window.addEventListener("resize", this.updateLayout.bind(this))
  }

  disconnect() {
    window.removeEventListener("resize", this.updateLayout.bind(this))
    document.body.style.overflow = ""
    document.body.style.height = ""
  }

  updateLayout() {
    const header = document.querySelector("header")
    const footer = document.querySelector("footer")

    const headerHeight = header ? header.offsetHeight : 0
    const footerHeight = footer ? footer.offsetHeight : 0
    const availableHeight = window.innerHeight - headerHeight - footerHeight

    // Set content height to fill remaining space perfectly
    this.element.style.minHeight = `${availableHeight}px`
    this.element.style.display = "flex"
    this.element.style.alignItems = "center"
    this.element.style.justifyContent = "center"

    // No scrolling; ensure full viewport fit
    document.body.style.overflow = "hidden"
  }
}
