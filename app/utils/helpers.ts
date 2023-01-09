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

export const getLinkToUrl = (url: string = "") => {
  return url.replace("https://music.apple.com/us", "");
};

export const calculateTime = (ms: number) => {
  if (!ms || isNaN(ms) || ms < 0) {
    ms = 0;
    return;
  }

  const time = 1000 * Math.round(ms / 1000);
  const date = new Date(time);

  return `${date.getUTCMinutes()}:${String(`0${date.getUTCSeconds()}`).slice(
    -2
  )}`;
};

export const timeConversion = (duration: number) => {
  const portions: string[] = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + " hours");
    duration = duration - hours * msInHour;
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + " minutes");
    duration = duration - minutes * msInMinute;
  }

  const seconds = Math.trunc(duration / 1000);
  if (seconds > 0) {
    portions.push(seconds + " seconds");
  }

  return portions.join(" ");
};

export const getAlbumId = (url: string = "") => {
  return new URL(url).pathname.split("/").filter(Boolean).pop();
};