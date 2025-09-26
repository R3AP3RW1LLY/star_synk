import "@hotwired/turbo-rails";
import { Application } from "@hotwired/stimulus";
import { registerControllers } from "./controllers";

window.Stimulus = Application.start();
registerControllers(window.Stimulus);