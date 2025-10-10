// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"

import "@fortawesome/fontawesome-free/js/all.js";

// Confirm Hotwire is loading
document.addEventListener("turbo:load", () => {
  console.log("✅ Turbo is active and loaded correctly")
})