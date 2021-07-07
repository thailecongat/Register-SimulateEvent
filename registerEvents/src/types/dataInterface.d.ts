import { EVENT_TYPE } from "../constants/constants";

export interface IGameSessionEventsCreatePayload {
  gameSessionId: string;
  events: string;
}

export interface IGameSessionEventsUpdatePayload {
  gameSessionId: string;
  events: string;
}

export interface IGameSessionEventsFetchPayload {
  gameSessionId: string;
}

export interface IGameSessionEvent {
  type: EVENT_TYPE;
  time?: number;
  data?: string;
}

export interface IRegisterEventsConstructor {
  startTime: number;
}

export interface IGameSessionEventsData {
  gameSessionId: string;
  events: string;
}

export interface IMouseEvent {
  type: string;
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
}

