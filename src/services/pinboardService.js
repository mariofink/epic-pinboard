const baseApiUrl = "https://api.pinboard.in/v1";
const requestOptions = {
  method: "GET"
};

export default class PinboardService {
  login(token) {
    const url = baseApiUrl + "/user/api_token";
    return new Promise((resolve, reject) => {
      fetch(url + `?auth_token=${token}`, requestOptions)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  loadRecent(token) {
    const url = baseApiUrl + "/posts/recent";
    console.log("Load bookmarks...", token);
    return new Promise((resolve, reject) => {
      fetch(url + `?auth_token=${token}`, requestOptions)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
          const posts = [...data.children[0].children];
          resolve(posts);
        })
        .catch(err => {
          console.error("Could not load bookmarks", err);
          reject(err);
        });
    });
  }
}
