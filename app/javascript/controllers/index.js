import HelloController from "./hello_controller.js";

export function registerControllers(app) {
  app.register("hello", HelloController);
}