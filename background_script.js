// Put all the javascript code here, that you want to execute in background.
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

async function loadBookmarks() {
  const token = await retrieveApiToken();
  const url = "https://api.pinboard.in/v1/posts/recent";
  console.log("Load bookmarks...", token);
  return new Promise((resolve, reject) => {
    fetch(url + `?auth_token=${token}`, requestOptions)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => {
        const posts = [...data.children[0].children];
        console.log("----", posts);
        posts.map(post => {
          console.log(post.getAttribute("href"));
          return post;
        });
        resolve(data);
      })
      .catch(err => {
        console.error("Could not load bookmarks", err);
        reject(err);
      });
  });
}
