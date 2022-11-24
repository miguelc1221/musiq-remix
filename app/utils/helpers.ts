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

export const calculateTime = (secs: number) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

export const getAlbumId = (url: string = "") => {
  return new URL(url).pathname.split("/").filter(Boolean).pop();
};