import { developerToken } from "./developerToken.server";

const rootUrl = "https://api.music.apple.com/v1";



export const getCharts: MusicKit.API["charts"] = async (types, params) => {
  try {
    const response = await fetch(
      `${rootUrl}/catalog/us/charts?types=${types.join(
        ","
      )}&${new URLSearchParams(params).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
        },
      }
    );
    const data = await response.json();

    return data.results;
  } catch (error) {
    throw error;
  }
};
