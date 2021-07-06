import axios from "axios";
import { EventTypes } from "../constants/gameSessionEvents";
import { ROOT_URL } from "../mocks/datasMock";
import {
  IDataSimulate,
  IEventToSimulate,
  IGameSessionEventsFetchPayload,
  IRegisterEventsConstructor,
} from "../types/eventInterface";

// @ts-ignore
const onmoHtmlGame = window.onmoHtmlGame;
export class SimulateEvent {
  startTime: number = 0;
  isDoneSimulateEventGroup: boolean = false;
  requestFrameId: number = 0;
  startAnimationTime: number = 0;
  canvas = document.createElement("canvas");
  eventsToSimulate: IEventToSimulate[] = [];
  currentEventIndex: number = 0;

  constructor({ startTime }: IRegisterEventsConstructor) {
    this.startTime = startTime;
  }

  setDefault = (): void => {
    this.startTime = 0;
    this.requestFrameId = 0;
    this.isDoneSimulateEventGroup = false;
    this.currentEventIndex = 0;
  };

  initializeData = (): void => {
    this.setDefault();
  };

  /**
   *
   * @param canvas
   * @param data
   */
  simulateMouseEvent = (canvas: any, data: IDataSimulate) => {
    // const start = new Date().getTime();
    switch (data.type) {
      case "touchstart":
        data.type = "mousedown";
        break;
      case "touchmove":
        data.type = "mousemove";
        break;
      case "touchend":
        data.type = "mouseup";
        break;

      default:
        break;
    }
    const event = new MouseEvent(data.type, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: data.x,
      clientY: data.y,
    });

    canvas.dispatchEvent(event);
    // console.log("Duration", new Date().getTime() - start);
  };

  /**
   *
   * @param event
   * @returns
   */
  setPrescription = (event: any) => {
    const isOverWidth =
      window.innerWidth / window.innerHeight > event.screenX / event.screenY;

    const fixByX = window.innerWidth / event.screenX;
    const fixByY = window.innerHeight / event.screenY;

    const x = isOverWidth
      ? (window.innerWidth - event.screenX * fixByY) / 2 +
        event.clientX * fixByY
      : event.clientX * fixByX;
    const y = isOverWidth
      ? event.clientY * fixByY
      : (window.innerHeight - event.screenY * fixByX) / 2 +
        event.clientY * fixByX;
    return { type: event.type, x: x, y: y };
  };

  /**
   *
   * @param event
   */
  simulateEvents = async () => {
    const event = this.eventsToSimulate[this.currentEventIndex];
    const node = document.getElementById("UT_CANVAS");
    if (!node || !event) return;

    if (event.type === EventTypes.PAUSE) {
      console.log("PAUSE");
      onmoHtmlGame?.pause();
      this.currentEventIndex = this.currentEventIndex + 1;
    }

    if (event.type === EventTypes.RESUME) {
      console.log("RESUME");
      onmoHtmlGame?.resume();
      this.currentEventIndex = this.currentEventIndex + 1;
    }

    if (event.type === EventTypes.INPUT) {
      this.simulateMouseEvent(
        node,
        this.setPrescription(JSON.parse(event?.data))
      );
      this.currentEventIndex = this.currentEventIndex + 1;
    }
  };

  onFrameAnimation = (timestamp: number): void => {
    if (this.startAnimationTime === undefined) {
      this.startAnimationTime = timestamp;
      this.requestFrameId = requestAnimationFrame(this.onFrameAnimation);
      return;
    }

    const elapsedMs = timestamp - this.startAnimationTime;
    let duration = null;
    if (this.currentEventIndex >= 1) {
      const prev = this.eventsToSimulate[this.currentEventIndex - 1]?.time || 0;
      const now = this.eventsToSimulate[this.currentEventIndex]?.time;
      duration = now - prev;
    }

    if (duration !== null && elapsedMs < duration) {
      this.requestFrameId = requestAnimationFrame(this.onFrameAnimation);
      return;
    }

    this.startAnimationTime = timestamp;
    this.simulateEvents(); // event
    this.requestFrameId = requestAnimationFrame(this.onFrameAnimation);
  };

  zeroTimeout = () => {
    const timeouts: any = [];
    var messageName = "zero-timeout-message";

    // Like setTimeout, but only takes a function argument.  There's
    // no time argument (always zero) and no arguments (you have to
    // use a closure).
    function setZeroTimeout(fn: any) {
      timeouts.push(fn);
      window.postMessage(messageName, "*");
    }

    function handleMessage(event: any) {
      if (event.source === window && event.data === messageName) {
        event.stopPropagation();
        if (timeouts.length > 0) {
          var fn = timeouts.shift();
          fn();
        }
      }
    }

    window.addEventListener("message", handleMessage, true);

    // Add the one thing we want added to the window object.

    // @ts-ignore
    window.setZeroTimeout = setZeroTimeout;
  };

  cancelAnimationFrameRequest = () => cancelAnimationFrame(this.requestFrameId);

  /**
   * @returns {void}
   */
  initGameDisplayBlock = (): void => {
    console.log("[Simulate events] - Hide the game display block");
    const node = document.getElementById("UT_CANVAS");
    node?.style.setProperty("maxWidth", "100vw");
    node?.style.setProperty("maxHeight", "100vh");
    node?.style.setProperty("display", "block");
    node?.style.setProperty("background", "#222323");
    node?.style.setProperty("cursor", "none");
  };

  /**
   * @returns {void}
   */
  hideGameDisplayBlock = (): void => {
    console.log("[Simulate events] - Hide the game display block");
    const node = document.getElementById("UT_CANVAS");
    node?.style.setProperty("display", "none");
  };

  /**
   * Fetch all gameSessionEvent with gameSession
   * @param payload
   * @returns {Promise<any>}
   */
  static async fetch(payload: IGameSessionEventsFetchPayload): Promise<any> {
    const fullURL = `${ROOT_URL}/fetch/${payload.gameSessionId}`;
    return axios.get(fullURL);
  }
}
