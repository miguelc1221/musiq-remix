export const formatArtworkURL = (url = "", width = 220, height = 220) => {
  let h = height;
  let w = width;

  if (!url) {
    return;
  }

  return url
    .replace("{h}", "" + h)
    .replace("{w}", "" + w)
    .replace("{f}", "jpeg");
};

export const formatUrlName = (str: string) => {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .join("-")
    .toLowerCase();
};

export const calculateTime = (secs: number) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

export const getAlbumId = (url: string = "") => {
  return new URL(url).pathname.split("/").filter(Boolean).pop();
};

export const findNextSong = (
  currentSong?: MusicKit.Songs | MusicKit.MusicVideos,
  songs?: (MusicKit.Songs | MusicKit.MusicVideos)[]
) => {
  if (!songs?.length || !currentSong) {
    return;
  }

  const currentSongId = currentSong.id;
  let results;

  songs?.forEach((song, idx) => {
    if (song.id === currentSongId) {
      const nextId = idx + 1;
      if (nextId === songs.length) {
        results = songs[0];
      } else {
        results = songs[nextId];
      }
    }
  });

  return results;
};

export const findPreviousSong = (
  currentSong?: MusicKit.Songs | MusicKit.MusicVideos,
  songs?: (MusicKit.Songs | MusicKit.MusicVideos)[]
) => {
  if (!songs?.length || !currentSong) {
    return;
  }
  const currentSongId = currentSong.id;
  let results;

  songs.forEach((song, idx) => {
    if (song.id === currentSongId) {
      const nextId = idx - 1;
      if (nextId < 0) {
        results = songs[songs.length - 1];
      } else {
        results = songs[nextId];
      }
    }
  });

  return results;
};