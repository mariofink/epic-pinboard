export default class PinboardService {
  constructor(baseApiUrl) {
    this.baseApiUrl = baseApiUrl;
  }
  login(token) {
    const url = this.baseApiUrl + "/user/api_token";
    return new Promise((resolve, reject) => {
      fetch(url + `?auth_token=${token}`)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getSuggestedTagsForUrl(token, bookmarkUrl) {
    const url = this.baseApiUrl + "/posts/suggest";
    return new Promise((resolve, reject) => {
      fetch(url + `?auth_token=${token}&url=${bookmarkUrl}&format=json`)
        .then(response => {
          resolve(response.json());
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getBookmarksForUrl(token, bookmarkUrl) {
    const url = this.baseApiUrl + "/posts/get";
    return new Promise((resolve, reject) => {
      fetch(url + `?auth_token=${token}&url=${bookmarkUrl}&format=json`)
        .then(response => {
          resolve(response.json());
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getAllTags(token) {
    const url = this.baseApiUrl + "/tags/get";
    return new Promise((resolve, reject) => {
      fetch(url + `?auth_token=${token}&format=json`)
        .then(response => {
          resolve(response.json());
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  addBookmark(token, bookmark) {
    const url = this.baseApiUrl + "/posts/add";
    return new Promise((resolve, reject) => {
      fetch(
        url +
          `?auth_token=${token}&url=${bookmark.url}&description=${bookmark.title}&extended=${bookmark.notes}&tags=${bookmark.tags}&shared=${bookmark.shared}&toread=${bookmark.toread}`
      )
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
