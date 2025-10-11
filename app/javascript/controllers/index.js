// app/javascript/controllers/index.js
import { application } from "./application"

// Core controllers
import MobileMenuController from "./mobile_menu_controller"
application.register("mobile-menu", MobileMenuController)

import ActiveLinkController from "./active_link_controller"
application.register("active-link", ActiveLinkController)

import CenterContentController from "./center_content_controller"
application.register("center-content", CenterContentController)

import PasswordVisibilityController from "./password_visibility_controller"
application.register("password-visibility", PasswordVisibilityController)

import RegistrationStepsController from "./registration_steps_controller"
application.register("registration-steps", RegistrationStepsController)

// ✅ FIXED: correct name for your searchable select controller
import SearchableSelectController from "./searchable_select_controller"
application.register("searchable-select", SearchableSelectController)

// ✅ Dev-only diagnostics
if (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") {
  console.log(
    "%cStimulus application loaded and controllers registered:",
    "color: limegreen; font-weight: bold;"
  )
  console.log(Array.from(application.router.modulesByIdentifier.keys()))
}
