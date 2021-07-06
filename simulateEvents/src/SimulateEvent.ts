import React from "react";
import { SimulateEvent } from "./models";
import {
  IEventGameSession,
  IEventToSimulate,
  IPropSimulateEvents,
} from "./types/eventInterface";

// @ts-ignore
// const onmoHtmlGame = window.onmoHtmlGame;

export const SimulateEventComponet = (props: IPropSimulateEvents) => {
  const { startTime } = props;
  const [simulateEvents, setSimulateEvents] = React.useState<SimulateEvent>();
  const [eventsToSimulate, setEventsToSimulate] = React.useState<
    IEventToSimulate[]
  >([]);

  React.useEffect(() => {
    const simulateEvents = new SimulateEvent({
      startTime,
    });
    setSimulateEvents(simulateEvents);
  }, [startTime]);

  React.useEffect(() => {
    if (!simulateEvents) return;
    simulateEvents.initGameDisplayBlock();
  }, [simulateEvents]);

  const fetchGameSessionEvents = async () => {
    try {
      const response = await SimulateEvent.fetch({ gameSessionId: "abc" });
      const event = JSON.parse(response.data.events);
      if (event.length === eventsToSimulate.length) {
        console.log("Lost Internet");
        // onmoHtmlGame?.pause();
      } else {
        console.log("Conected");
        // onmoHtmlGame?.resume();
      }
      setEventsToSimulate(event);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch the game session events every 5secs
  React.useEffect(() => {
    const fetchRequestId = setInterval(async () => {
      await fetchGameSessionEvents();
    }, 5000);
    return () => {
      clearInterval(fetchRequestId);
    };
  }, [eventsToSimulate]);

  React.useEffect(() => {
    if (!simulateEvents) return;
    simulateEvents.eventsToSimulate = eventsToSimulate.filter(
      (event: IEventGameSession) => event.type !== "PING"
    );

    simulateEvents.requestFrameId = requestAnimationFrame(
      simulateEvents.onFrameAnimation
    );
  }, [simulateEvents, eventsToSimulate]);

  return null;
};
