import { EVENT_TYPE, gameRatio } from "../constants/eventType";
import axios from "axios";
import {
  IMouseEvent,
  IGameSessionEvent,
  IGameSessionEventsCreatePayload,
  IGameSessionEventsUpdatePayload,
} from "../types/dataInterface";
import { MOCK_GAME_SESSION_ID } from "../mocks/datas";

const dataCreate = {
  gameSessionId: MOCK_GAME_SESSION_ID,
  events: JSON.stringify([{ type: EVENT_TYPE.PING }]),
};
export class RegisterEvents {
  static ROOT_URL = "http://localhost:4100";
  gameSessionEvents: IGameSessionEvent[] = [];
  startTime: number = 0;

  constructor() {
    this.initialize();
  }

  setDefault = () => {
    console.log("[Register events] - set default");
    this.gameSessionEvents = [{ type: EVENT_TYPE.PING }];
  };

  initialize = () => {
    this.startTime = Date.now();
    this.gameSessionEvents = [{ type: EVENT_TYPE.PING }];
  };

  /**
   * Register all event
   * @returns
   */
  register = () => {
    const htmlGameCanvas = document.getElementById("UT_CANVAS");
    let isMouseDown = false;

    const mousedownCallback = (event: MouseEvent) => {
      isMouseDown = true;
      this.saveMouseEvent(event);
    };
    const mouseupCallback = (event: MouseEvent) => {
      this.saveMouseEvent(event);
      isMouseDown = false;
    };
    const mousemoveCallback = (event: MouseEvent) => {
      isMouseDown && this.saveMouseEvent(event);
    };
    const touchstartCallback = (event: TouchEvent) => {
      this.saveTouchEvent(event);
      isMouseDown = true;
    };
    const touchmoveCallback = (event: TouchEvent) => {
      isMouseDown && this.saveTouchEvent(event);
    };
    const touchendCallback = (event: TouchEvent) => {
      this.saveTouchEvent(event);
      isMouseDown = false;
    };

    htmlGameCanvas?.addEventListener("mousedown", mousedownCallback);
    htmlGameCanvas?.addEventListener("mouseup", mouseupCallback);
    htmlGameCanvas?.addEventListener("mousemove", mousemoveCallback);
    htmlGameCanvas?.addEventListener("touchstart", touchstartCallback);
    htmlGameCanvas?.addEventListener("touchmove", touchmoveCallback);
    htmlGameCanvas?.addEventListener("touchend", touchendCallback);

    return (): void => {
      htmlGameCanvas?.removeEventListener("mousedown", mousedownCallback);
      htmlGameCanvas?.removeEventListener("mouseup", mouseupCallback);
      htmlGameCanvas?.removeEventListener("mousemove", mousemoveCallback);
      htmlGameCanvas?.removeEventListener("touchstart", touchstartCallback);
      htmlGameCanvas?.removeEventListener("touchmove", touchmoveCallback);
      htmlGameCanvas?.removeEventListener("touchend", touchendCallback);
    };
  };

  /**
   * Set prescription follow screen push MouseEvent to gameSessionEvents
   * @param event Mouse event from eventListener
   */
  saveMouseEvent = (event: IMouseEvent) => {
    let screenX = window.innerWidth,
      screenY = window.innerHeight;
    const canvasRatio = screenX / screenY;

    if (canvasRatio > gameRatio) {
      screenX = window.innerHeight * gameRatio;
    } else screenY = window.innerWidth / gameRatio;

    const canvasEvent = {
      type: event.type,
      screenX: screenX,
      screenY: screenY,
      clientX: event.clientX - (window.innerWidth - screenX) / 2,
      clientY: event.clientY - (window.innerHeight - screenY) / 2,
    };

    const time = Date.now() - this.startTime;

    this.gameSessionEvents.push({
      type: EVENT_TYPE.INPUT,
      time: time,
      data: JSON.stringify(canvasEvent),
    });
  };

  /**
   * Save PauseEvent
   * @param isPause
   */
  savePauseEvent = (isPause: boolean) => {
    const time = Date.now() - this.startTime;

    if (isPause) {
      this.gameSessionEvents.push({
        type: EVENT_TYPE.PAUSE,
        time: time,
      });
    } else {
      this.gameSessionEvents.push({
        type: EVENT_TYPE.RESUME,
        time: time,
      });
    }
  };

  /**
   * Save Player left event
   * @param isPause
   */
  savePlayerLeftEvent = () => {
    const time = Date.now() - this.startTime;

    this.gameSessionEvents.push({
      type: EVENT_TYPE.PLAYER_LFET,
      time: time,
    });
  };

  /**
   * Save touch Event
   * @param event - Touch event from eventListener
   */
  saveTouchEvent = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    const touchEvent = {
      type: event.type,
      clientX: touch.clientX,
      clientY: touch.clientY,
      screenX: touch.screenX,
      screenY: touch.screenY,
    };

    this.saveMouseEvent(touchEvent as IMouseEvent);
  };

  /**
   *
   * @param {Object} payload - Object GameSessionId + first event
   * @returns
   */
  static async createGameSessionEvents(
    payload: IGameSessionEventsCreatePayload
  ): Promise<any> {
    try {
      const fullURL = `${this.ROOT_URL}/create`;
      return axios.post(fullURL, payload);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   *
   * @param {Object} payload - Object GameSessionId + list event to update
   * @returns
   */
  static async updateGameSessionEvents(
    payload: IGameSessionEventsUpdatePayload
  ): Promise<any> {
    try {
      const fullURL = `${this.ROOT_URL}/update/`;
      return axios.put(fullURL, payload);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Update event
   * @param {number} startTime - Time start register event
   * @returns {Promise<any>}
   */
  updateGameSessionEvents = () => {
    this.register();

    //Update event every 5s
    const requestId = setInterval(async () => {
      await RegisterEvents.updateGameSessionEvents({
        gameSessionId: MOCK_GAME_SESSION_ID,
        events: JSON.stringify(this.gameSessionEvents),
      });
      this.setDefault();
    }, 5000);

    return () => {
      clearInterval(requestId);
    };
  };

  /**
   * Create then update event
   * @returns {Promise<any>}
   */
  registerEventHtmlGame = async () => {
    await RegisterEvents.createGameSessionEvents(dataCreate);
    this.updateGameSessionEvents();
  };
}
