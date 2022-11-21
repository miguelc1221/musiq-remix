import type { Dispatch } from "react";

export type PlayerType = {
  selectedSongInfo?: MusicKit.Songs;
  selectedSong?: string;
  isPlaying: boolean;
};

export type initialStateType = {
  musicKit?: MusicKit.MusicKitInstance;
  player: PlayerType;
  isAuthenticated: boolean;
};

/**
 * Actions
 */
export enum AppReducerActionType {
  SET_MUSICKIT_INSTANCE,
  SET_SELECTED_SONG,
  SET_IS_PLAYING_ON,
  SET_IS_PLAYING_OFF,
}

export type AppReducerAction =
  | {
      type: AppReducerActionType.SET_MUSICKIT_INSTANCE;
      payload: MusicKit.MusicKitInstance;
    }
  | {
      type: AppReducerActionType.SET_SELECTED_SONG;
      payload: MusicKit.Songs;
    }
  | {
      type: AppReducerActionType.SET_IS_PLAYING_ON;
    }
  | {
      type: AppReducerActionType.SET_IS_PLAYING_OFF;
    };

/**
 * App Reducer
 */
export const appInitialState: initialStateType = {
  musicKit: undefined,
  player: {
    selectedSongInfo: undefined,
    selectedSong: "",
    isPlaying: false,
  },
  isAuthenticated: false,
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
    case AppReducerActionType.SET_SELECTED_SONG:
      return {
        ...state,
        player: {
          ...state.player,
          selectedSongInfo: action.payload,
          selectedSong: state.isAuthenticated
            ? ""
            : action.payload.attributes?.previews[0].url,
          isPlaying: true,
        },
      };
    case AppReducerActionType.SET_IS_PLAYING_ON:
      return {
        ...state,
        player: {
          ...state.player,
          isPlaying: true,
        },
      };
    case AppReducerActionType.SET_IS_PLAYING_OFF:
      return {
        ...state,
        player: {
          ...state.player,
          isPlaying: false,
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
