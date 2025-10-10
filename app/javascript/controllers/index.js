import { application } from "./application"

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

import SearchableSeclectController from "./searchable_select_controller"
application.register("searchable-select", SearchableSeclectController)