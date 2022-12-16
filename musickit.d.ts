declare namespace MusicKit {
  /**
   * The options to use when setting a music player's playback queue.
   */
  interface SetQueueOptions {
    startPlaying?: boolean | undefined;
  }

  interface MusicKitInstance extends MusicKit.Player {}
}
