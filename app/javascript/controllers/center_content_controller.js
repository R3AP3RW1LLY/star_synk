// app/javascript/controllers/center_content_controller.js
import { Controller } from "@hotwired/stimulus"

// Centers content between the navbar and footer while allowing dynamic height (for stepped forms)
export default class extends Controller {
  connect() {
    this.recenter()
    window.addEventListener("resize", this.recenter.bind(this))

    // Listen for custom events (e.g. when switching form steps)
    document.addEventListener("form:updated", this.recenter.bind(this))
  }

  disconnect() {
    window.removeEventListener("resize", this.recenter.bind(this))
    document.removeEventListener("form:updated", this.recenter.bind(this))
  }

  recenter() {
    const nav = document.querySelector("nav")
    const footer = document.querySelector("footer")
    const navHeight = nav ? nav.offsetHeight : 0
    const footerHeight = footer ? footer.offsetHeight : 0
    const viewportHeight = window.innerHeight
    const availableHeight = viewportHeight - navHeight - footerHeight

    // Let form expand naturally, but keep it centered vertically
    this.element.style.minHeight = `${availableHeight}px`
    this.element.style.display = "flex"
    this.element.style.flexDirection = "column"
    this.element.style.justifyContent = "center"
    this.element.style.alignItems = "center"
  }
}
