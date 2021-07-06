import { RegisterEvents } from "../models";

//TODO
describe("api/index", () => {
  it("Create data events", () => {
    const test = RegisterEvents.createGameSessionEvents({
      gameSessionId: "test",
      events: "{type: PING}",
    });

    console.log(test);
  });
});
