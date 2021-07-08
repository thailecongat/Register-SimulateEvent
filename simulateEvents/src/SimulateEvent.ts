import React from "react";
import { SimulateEvent } from "./models";
import {
  IEventGameSession,
  IEventToSimulate,
  IPropSimulateEvents,
} from "./types/eventInterface";

// @ts-ignore
const onmoHtmlGame = window.onmoHtmlGame;

export const SimulateEventComponet = (props: IPropSimulateEvents) => {
  const { gameSessionId } = props;
  const [simulateEvents, setSimulateEvents] = React.useState<SimulateEvent>();
  const [eventsToSimulate, setEventsToSimulate] = React.useState<
    IEventToSimulate[]
  >([]);

  React.useEffect(() => {
    const simulateEvents = new SimulateEvent();
    setSimulateEvents(simulateEvents);
  }, []);

  const fetchGameSessionEvents = async () => {
    try {
      const response = await SimulateEvent.fetch({
        gameSessionId: gameSessionId,
      });
      const event = JSON.parse(response.data.events);
      setEventsToSimulate(event);
      if (
        event.length === eventsToSimulate.length &&
        simulateEvents?.isDoneSimulateEventGroup
      ) {
        console.log("Lost Internet");
        const timeout = setTimeout(() => {
          onmoHtmlGame?.pause();
          simulateEvents.isPause = true;
          clearTimeout(timeout);
          //TODO
          //check lost internet if > 1 min
          //send final score and kill the docker
        }, 3000);
      } else {
        console.log("Conected");
        if (!simulateEvents) return;
        const timeout = setTimeout(() => {
          onmoHtmlGame?.resume();
          simulateEvents.isPause = false;
          clearTimeout(timeout);
        }, 3000);
      }
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
