import * as auth_controller from "./auth.controller";

// @ponicode
describe("auth_controller.Register", () => {
  test("0", () => {
    auth_controller.Register(
      {
        body: {
          password: "!Lov3MyPianoPony",
          password_confirmation: "!Lov3MyPianoPony",
        },
      },
      {
        status: () => 400,
        send: () => "https://croplands.org/app/a/reset?token=",
      }
    );
  });
});
