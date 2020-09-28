import urlcat from "urlcat";

function doRequest(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default class PinboardService {
  constructor(baseApiUrl) {
    this.baseApiUrl = baseApiUrl;
  }
  login(token) {
    const url = urlcat(this.baseApiUrl, "/user/api_token", {
      auth_token: token,
      format: "json",
    });
    return doRequest(url);
  }

  getSuggestedTagsForUrl(token, bookmarkUrl) {
    const url = urlcat(this.baseApiUrl, "/posts/suggest", {
      auth_token: token,
      url: bookmarkUrl,
      format: "json",
    });
    return doRequest(url);
  }

  getBookmarksForUrl(token, bookmarkUrl) {
    const url = urlcat(this.baseApiUrl, "/posts/get", {
      auth_token: token,
      url: bookmarkUrl,
      format: "json",
    });
    return doRequest(url);
  }

  getAllTags(token) {
    const url = urlcat(this.baseApiUrl, "/tags/get", {
      auth_token: token,
      format: "json",
    });
    return doRequest(url);
  }

  addBookmark(token, bookmark) {
    const url = urlcat(this.baseApiUrl, "/posts/add", {
      auth_token: token,
      url: bookmark.url,
      description: bookmark.title,
      extended: bookmark.notes,
      tags: bookmark.tags,
      shared: bookmark.shared,
      toread: bookmark.toread,
      format: "json",
    });
    return doRequest(url);
  }
}
