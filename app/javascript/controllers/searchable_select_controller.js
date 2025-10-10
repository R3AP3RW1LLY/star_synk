import { Controller } from "@hotwired/stimulus"

// Filters the options of a select element as you type in the overlay input
export default class extends Controller {
  static targets = ["select", "search"]

  connect() {
    this.originalOptions = Array.from(this.selectTarget.options)
  }

  filter() {
    const query = this.searchTarget.value.toLowerCase()
    const matches = this.originalOptions.filter(o =>
      o.textContent.toLowerCase().includes(query)
    )
    this.selectTarget.innerHTML = ""
    matches.forEach(o => this.selectTarget.appendChild(o))
  }
}
