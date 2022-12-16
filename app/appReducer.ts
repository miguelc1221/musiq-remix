import type { Dispatch } from "react";

export type PlayerState = "PLAYING" | "PAUSE" | "LOADING";

export type PlayerType = {
  playerState: PlayerState;
  queueLength: number;
  selectedMediaItem?: MusicKit.MediaItem;
};

export type initialStateType = {
  musicKit?: MusicKit.MusicKitInstance;
  player: PlayerType;
};

/**
 * Actions
 */
export enum AppReducerActionType {
  SET_MUSICKIT_INSTANCE,
  SET_PLAYER_STATE,
  SET_QUEUE_LENGTH,
  SET_SELECTED_MEDIA_ITEM,
}

export type AppReducerAction =
  | {
      type: AppReducerActionType.SET_MUSICKIT_INSTANCE;
      payload: MusicKit.MusicKitInstance;
    }
  | {
      type: AppReducerActionType.SET_PLAYER_STATE;
      payload: PlayerState;
    }
  | {
      type: AppReducerActionType.SET_QUEUE_LENGTH;
      payload: number;
    }
  | {
      type: AppReducerActionType.SET_SELECTED_MEDIA_ITEM;
      payload: any;
    };

/**
 * App Reducer
 */
export const appInitialState: initialStateType = {
  musicKit: undefined,
  player: {
    playerState: "PAUSE",
    queueLength: 0,
    selectedMediaItem: undefined,
  },
};

export const appReducer = (
  state: initialStateType,
  action: AppReducerAction
) => {
  switch (action.type) {
    case AppReducerActionType.SET_MUSICKIT_INSTANCE:
      return {
        ...state,
        musicKit: action.payload,
      };
    case AppReducerActionType.SET_PLAYER_STATE:
      return {
        ...state,
        player: {
          ...state.player,
          playerState: action.payload,
        },
      };
    case AppReducerActionType.SET_QUEUE_LENGTH:
      return {
        ...state,
        player: {
          ...state.player,
          queueLength: action.payload,
        },
      };
    case AppReducerActionType.SET_SELECTED_MEDIA_ITEM:
      return {
        ...state,
        player: {
          ...state.player,
          selectedMediaItem: action.payload,
        },
      };
    default:
      return state;
  }
};

/**
 * Context
 */

export type DispatchType = Dispatch<AppReducerAction>;

export type AppContextType = initialStateType & { dispatch: DispatchType };
