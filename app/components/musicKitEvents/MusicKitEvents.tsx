import { useCallback } from "react";
import type { DispatchType, PlayerType } from "~/appReducer";
import { AppReducerActionType } from "~/appReducer";
import { useMusicKitListener } from "~/hooks/useMusicKitListener";

export const MusicKitEvents = ({
  dispatch,
  player,
}: {
  player: PlayerType;
  dispatch: DispatchType;
}) => {
  const handleApplePlaybackStateChange = useCallback(
    ({ state }: { state: MusicKit.PlaybackState }) => {
      /**
       * NONE, 0
       * LOADING, 1
       * PLAYING,2
       * PAUSED, 3
       * STOPPED, 4
       * ENDED, 5
       * SEEKING, 6
       * waiting, 7
       * stalled, 8
       * completed, 9
       */
      switch (state) {
        case 2: // Playing
          dispatch({
            type: AppReducerActionType.SET_PLAYER_STATE,
            payload: "PLAYING",
          });
          break;
        case 3: // Pause
          dispatch({
            type: AppReducerActionType.SET_PLAYER_STATE,
            payload: "PAUSE",
          });
          break;
        case 1: // Loading
          // case 7: // waiting
          // case 8: // stalled
          dispatch({
            type: AppReducerActionType.SET_PLAYER_STATE,
            payload: "LOADING",
          });
          break;
      }
    },
    [dispatch]
  );

  const handleQueueItemsDidChange = useCallback(
    (mediaItem: MusicKit.MediaItem[] = []) => {
      dispatch({
        type: AppReducerActionType.SET_QUEUE_LENGTH,
        payload: mediaItem.length,
      });
    },
    [dispatch]
  );

  const handleMediaItemStateDidChange = useCallback(
    (state: MusicKit.MediaItem) => {
      return dispatch({
        type: AppReducerActionType.SET_SELECTED_MEDIA_ITEM,
        payload: state,
      });
    },
    [dispatch]
  );

  const handleShuffleDidChange = useCallback(
    (shuffle: number) => {
      return dispatch({
        type: AppReducerActionType.SET_SHUFFLE,
        payload: shuffle,
      });
    },
    [dispatch]
  );

  const handleRepeatDidChange = useCallback(
    (repeat: number) => {
      return dispatch({
        type: AppReducerActionType.SET_REPEAT,
        payload: repeat,
      });
    },
    [dispatch]
  );

  useMusicKitListener("playbackStateDidChange", handleApplePlaybackStateChange);
  useMusicKitListener("queueItemsDidChange", handleQueueItemsDidChange);
  useMusicKitListener("mediaItemStateDidChange", handleMediaItemStateDidChange);
  useMusicKitListener("shuffleModeDidChange", handleShuffleDidChange);
  useMusicKitListener("repeatModeDidChange", handleRepeatDidChange);

  return <></>;
};
