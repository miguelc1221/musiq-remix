import type { Dispatch } from "react";
import { findNextSong, findPreviousSong } from "./utils/helpers";

export type PlayerType = {
  selectedSong?: MusicKit.Songs | MusicKit.MusicVideos;
  selectedSongPlaylist?: (MusicKit.Songs | MusicKit.MusicVideos)[];
  nextSong?: MusicKit.Songs | MusicKit.MusicVideos;
  previousSong?: MusicKit.Songs | MusicKit.MusicVideos;
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
      payload: {
        selectedSong?: MusicKit.Songs | MusicKit.MusicVideos;
        selectedSongPlaylist: (MusicKit.Songs | MusicKit.MusicVideos)[];
      };
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
    selectedSong: undefined,
    selectedSongPlaylist: [],
    nextSong: undefined,
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
          selectedSong: action.payload.selectedSong,
          selectedSongPlaylist: action.payload.selectedSongPlaylist,
          nextSong: findNextSong(
            action.payload.selectedSong,
            action.payload.selectedSongPlaylist
          ),
          previousSong: findPreviousSong(
            action.payload.selectedSong,
            action.payload.selectedSongPlaylist
          ),
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
