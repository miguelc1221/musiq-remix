declare namespace MusicKit {
  /**
   * The options to use when setting a music player's playback queue.
   */
  interface SetQueueOptions {
    startPlaying?: boolean | undefined;
  }

  interface MusicKitInstance extends MusicKit.Player {}

  /**
   * A resource object that represents an artist of an album where an artist can be one or more persons.
   * https://developer.apple.com/documentation/applemusicapi/artists-uip
   */
  interface Artists extends Resource {
    type: "artists";
    attributes?: {
      artwork: Artwork;
      editorialNotes?: EditorialNotes;
      genreNames: string[];
      name: string;
      url: string;
    };
    relationships: {
      albums: Relationship<Albums>;
      genres: Relationship<Genres>;
      "music-videos": Relationship<MusicVideos>;
      playlists: Relationship<Playlists>;
      station: Relationship<Stations>;
    };
    views: {
      "appears-on-albums": View<Albums>;
      "compilation-albums": {
        href?: string;
        next?: string;
        attributes: {
          title: string;
        };
        data: Albums[];
      };
      "featured-albums": View<Albums>;
      "featured-playlists": View<Playlists>;
      "full-albums": View<Albums>;
      "latest-release": View<Albums>;
      "live-albums": View<Albums>;
      "similar-artists": View<Artists>;
      singles: View<Albums>;
      "top-music-videos": View<MusicVideos>;
      "top-songs": View<Songs>;
    };
  }
}
