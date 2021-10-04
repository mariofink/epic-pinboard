const background = browser.extension.getBackgroundPage();

const status = document.getElementById("status");
const bookmarkContainer = document.getElementById("bookmarks");

const loadBookmarksButton = document.getElementById("loadBookmarks");
loadBookmarksButton.addEventListener("click", (e) => {
  background.loadBookmarks().then((posts) => {
    const markup = `
    <ul class="bookmarks-list">
    ${posts
      .map(
        (post) =>
          `<li><a target="_blank" href="${post.href}">${post.description}</a></li>`
      )
      .join("")}
    </ul>
    `;
    bookmarkContainer.innerHTML = markup;
    posts.map((post) => {
      return post;
    });
  });
});

const loginButton = document.getElementById("login");
loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  background
    .login()
    .then((response) => {
      status.innerHTML = "Successfully logged in";
    })
    .catch((err) => {
      console.error(err);
      status.innerHTML = "Error during login";
    });
  status.innerHTML = "Submitted";
});
