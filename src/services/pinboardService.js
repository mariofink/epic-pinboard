import urlcat from "urlcat";

export default class PinboardService {
  constructor(baseApiUrl) {
    this.baseApiUrl = baseApiUrl;
  }
  login(token) {
    const url = urlcat(this.baseApiUrl, "/user/api_token", {
      auth_token: token,
    });
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getSuggestedTagsForUrl(token, bookmarkUrl) {
    const url = urlcat(this.baseApiUrl, "/posts/suggest", {
      auth_token: token,
      url: bookmarkUrl,
      format: "json",
    });
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

  getBookmarksForUrl(token, bookmarkUrl) {
    const url = urlcat(this.baseApiUrl, "/posts/get", {
      auth_token: token,
      url: bookmarkUrl,
      format: "json",
    });
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

  getAllTags(token) {
    const url = urlcat(this.baseApiUrl, "/tags/get", {
      auth_token: token,
      format: "json",
    });
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

  addBookmark(token, bookmark) {
    const url = urlcat(this.baseApiUrl, "/posts/add", {
      auth_token: token,
      url: bookmark.url,
      description: bookmark.title,
      extended: bookmark.notes,
      tags: bookmark.tags,
      shared: bookmark.shared,
      toread: bookmark.toread,
    });
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
