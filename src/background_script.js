// Put all the javascript code here, that you want to execute in background.
const baseApiUrl = "https://api.pinboard.in/v1";
const requestOptions = {
  method: "GET"
};

function retrieveApiToken() {
  return new Promise((resolve, reject) => {
    browser.storage.sync.get("apitoken").then(res => {
      resolve(res.apitoken);
    });
  });
}

async function login() {
  const token = await retrieveApiToken();
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

async function loadBookmarks() {
  const token = await retrieveApiToken();
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

window.loadBookmarks = loadBookmarks;
