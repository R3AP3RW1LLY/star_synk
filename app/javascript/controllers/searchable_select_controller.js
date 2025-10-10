// app/javascript/controllers/searchable_select_controller.js
import { Controller } from "@hotwired/stimulus"

// Makes <select> searchable by adding a small filter <input> above it.
export default class extends Controller {
  static targets = ["select", "input", "wrapper"]

  connect() {
    // Create a wrapper div for styling if not already present
    if (!this.hasWrapperTarget) {
      const wrapper = document.createElement("div")
      wrapper.dataset.searchableSelectTarget = "wrapper"
      this.element.parentNode.insertBefore(wrapper, this.element)
      wrapper.appendChild(this.element)
    }

    // Insert search box if missing
    if (!this.hasInputTarget) {
      const searchInput = document.createElement("input")
      searchInput.type = "text"
      searchInput.placeholder = "Search..."
      searchInput.classList.add(
        "mb-2", "w-full", "rounded-md",
        "bg-[var(--clr-surface-a20)]", "text-[var(--clr-light-a0)]",
        "border", "border-[var(--clr-surface-a40)]", "px-2", "py-1",
        "focus:outline-none", "focus:ring-2", "focus:ring-[var(--clr-primary-a20)]"
      )
      searchInput.dataset.searchableSelectTarget = "input"
      searchInput.addEventListener("input", this.filterOptions.bind(this))
      this.element.parentNode.insertBefore(searchInput, this.element)
    }
  }

  filterOptions(event) {
    const filter = event.target.value.toLowerCase()
    const options = this.selectTarget.options

    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      const text = option.text.toLowerCase()
      option.style.display = text.includes(filter) ? "block" : "none"
    }
  }
}
