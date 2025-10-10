import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["select", "search"]

  connect() {
    this.originalOptions = Array.from(this.selectTarget.options)
  }

  show() {
    this.searchTarget.classList.remove("hidden")
  }

  hide() {
    setTimeout(() => this.searchTarget.classList.add("hidden"), 150)
    this.filter() // reset view
  }

  filter() {
    const query = this.searchTarget.value.toLowerCase()
    this.selectTarget.innerHTML = ""
    const matches = this.originalOptions.filter(opt =>
      opt.textContent.toLowerCase().includes(query)
    )
    matches.forEach(opt => this.selectTarget.appendChild(opt))
  }
}
