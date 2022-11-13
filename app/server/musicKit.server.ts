import { developerToken } from "./developerToken.server";

const rootUrl = "https://api.music.apple.com/v1";

export const getCharts = async (
  types = ["songs", "albums", "playlists"],
  limit = 36
) => {
  try {
    const response = await fetch(
      `${rootUrl}/catalog/us/charts?types=${types.join(",")}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
        },
      }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
