import { developerToken } from "./developerToken.server";

const rootUrl = "https://api.music.apple.com/v1";
const meUrl = `${rootUrl}/me`;

export const CITY_CHARTS_ID = [
  "pl.a88b5c26caea48a59484370b6f79c9df",
  "pl.a42d6fd3917f4445b18468109d27f201",
  "pl.0f2ba910f3a64209933184678f99d6cd",
  "pl.00fc149058624fb5b3cb83433591902c",
  "pl.1b1c79dc0a0f4ce2a15860d358d03f68",
  "pl.1b99e63d957149acbf0989700687514d",
  "pl.1dda1db8daa3413a9b413c1705c51c86",
  "pl.1f48d456fa8746b8b52a7cb276f2a166",
  "pl.2c8d727a51474f14b10ca3753354a4c9",
  "pl.3a862f5540f44d6baa96db6b2888c751",
  "pl.3ca6b5a302c44ee0b67b7a18bd914686",
  "pl.3e312e7513c74051a3f0e1292c7b3e6c",
  "pl.3f22ec9c90ce447d87c61762c9876726",
  "pl.4c17ccf006634d67b09aaac56f22d200",
  "pl.4cc86bb8172b45f4a2f4aec473176320",
  "pl.5b45c8decd4c4c40b40239136fe5b9ff",
  "pl.5d6f621aee9b420887ee2c5cdf0bbbeb",
  "pl.5d2984c17afd43bdae1abc3b07ee18f9",
  "pl.5f853ea66be94055a9d03637c1675a01",
  "pl.6c442d057f374a16bd8afa917058382c",
  "pl.6d0ecb499dd240fa932efc853c126c09",
  "pl.07ee0d128ca94d1986b3f753003db642",
  "pl.7a4de42a661b41438c0d3e5708307952",
  "pl.7e6336e0dc274436a4403699c39ecea8",
  "pl.8b96d5abac044af08b112b785dd7f8d0",
  "pl.8efc1650d4a841f8808a522b47893f07",
  "pl.8f35027eb4f5434691799f18390d885f",
];

const fields = [
  "albumName",
  "artistName",
  "artwork",
  "attribution",
  "composerName",
  "contentRating",
  "discNumber",
  "durationInMillis",
  "editorialNotes",
  "genreNames",
  "hasLyrics",
  "isrc",
  "movementCount",
  "movementName",
  "movementNumber",
  "name",
  "playParams",
  "previews",
  "releaseDate",
  "trackNumber",
  "url",
  "workName",
  "artistUrl",
  "inLibrary",
];

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

export const getAlbum: MusicKit.API["album"] = async (id, params) => {
  try {
    const response = await fetch(
      `${rootUrl}/catalog/us/albums/${id}?fields=${fields.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          ...(params?.userToken
            ? { "Music-User-Token": params?.userToken }
            : {}),
        },
      }
    );

    const data = await response.json();

    if (data.errors) {
      throw data.error;
    }

    return data.data[0];
  } catch (error) {
    throw error;
  }
};

export const getPlaylist: MusicKit.API["playlist"] = async (id, params) => {
  try {
    const response = await fetch(
      `${rootUrl}/catalog/us/playlists${id}?fields=${fields.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          ...(params?.userToken
            ? { "Music-User-Token": params?.userToken }
            : {}),
        },
      }
    );
    const data = await response.json();

    if (data.errors) {
      throw data.error;
    }
    return data.data;
  } catch (error) {
    throw error;
  }
};

// Authenticated Personalized Calls
export const getLibrarySongs: MusicKit.API["library"]["songs"] = async (
  ids = [],
  params
) => {
  const limit = params?.limit || 100;
  const offset = params?.offset || 0;
  try {
    const response = await fetch(
      `${meUrl}/library/songs?${new URLSearchParams({
        limit,
        offset,
        ...(ids?.length ? { ids: ids.join(",") } : {}),
      }).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          ...(params?.userToken
            ? { "Music-User-Token": params?.userToken }
            : {}),
        },
      }
    );

    const data = await response.json();

    if (data.errors) {
      throw data.error;
    }
    return data.data;
  } catch (error) {
    console.log(error, "error>");
    throw error;
  }
};

export const getLibraryAlbums: MusicKit.API["library"]["albums"] = async (
  ids = [],
  params
) => {
  const limit = params?.limit || 100;
  const offset = params?.offset || 0;
  try {
    const response = await fetch(
      `${meUrl}/library/albums?${new URLSearchParams(
        ids?.length ? { ids: ids.join(",") } : { limit, offset }
      ).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          ...(params?.userToken
            ? { "Music-User-Token": params?.userToken }
            : {}),
        },
      }
    );

    const data = await response.json();

    if (data.errors) {
      throw data.error;
    }
    return data.data;
  } catch (error) {
    console.log(error, "error>");
    throw error;
  }
};

export const getLibraryRecentlyAdded: MusicKit.API["library"]["recentlyAdded"] =
  async ({ userToken, ...params }: any) => {
    try {
      const response = await fetch(
        `${meUrl}/library/recently-added?${new URLSearchParams(
          params
        ).toString()}`,
        {
          headers: {
            Authorization: `Bearer ${developerToken}`,
            ...(userToken ? { "Music-User-Token": userToken } : {}),
          },
        }
      );

      const data = await response.json();

      if (data.errors) {
        throw data.error;
      }

      return data.data;
    } catch (error) {
      console.log(error, "error>");
      throw error;
    }
  };

export const addToLibrary = async ({ userToken, ...params }: any) => {
  try {
    const response = await fetch(
      `${meUrl}/library?${new URLSearchParams(params).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          ...(userToken ? { "Music-User-Token": userToken } : {}),
        },
        method: "POST",
      }
    );

    const string = await response.text();
    const data = string === "" ? {} : JSON.parse(string);

    return data;
  } catch (error) {
    console.log(error, "error");
    throw error;
  }
};
