const background = browser.extension.getBackgroundPage();

const status = document.getElementById("status");

const loadBookmarksButton = document.getElementById("loadBookmarks");
loadBookmarksButton.addEventListener("click", e => {
  background.loadBookmarks().then(bookmarks => {
    bookmarks.map(post => {
      console.log(post.getAttribute("href"));
      return post;
    });
  });
});

const loginButton = document.getElementById("login");
loginButton.addEventListener("click", e => {
  e.preventDefault();
  background
    .login()
    .then(response => {
      console.log("RESPONSE", response);
      status.innerHTML = "Successfully logged in";
    })
    .catch(err => {
      console.error(err);
      status.innerHTML = "Error during login";
    });
  status.innerHTML = "Submitted";
});
