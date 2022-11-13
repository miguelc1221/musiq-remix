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
