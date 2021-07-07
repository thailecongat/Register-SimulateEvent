import EventTypes from "../constants/gameSessionEvents";

export interface IGameSessionEventsFetchPayload {
  gameSessionId: string;
}

export interface IDataSimulate {
  type: string;
  x: number;
  y: number;
}
export interface IEventToSimulate {
  type: EventTypes;
  time: number;
  data: string;
}

export interface IEventGameSession {
  type: EventTypes;
  time?: number;
  data?: string;
}
export interface IPropSimulateEvents {
  gameSessionId: string;
}
