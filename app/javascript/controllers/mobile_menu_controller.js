import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]

  open() {
    this.menuTarget.classList.remove("hidden")
    document.addEventListener("click", this._outsideClickHandler)
  }

  close() {
    this.menuTarget.classList.add("hidden")
    document.removeEventListener("click", this._outsideClickHandler)
  }

  _outsideClickHandler = (event) => {
    if (!this.menuTarget.contains(event.target)) {
      this.close()
    }
  }
}