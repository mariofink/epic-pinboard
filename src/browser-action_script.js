const background = browser.extension.getBackgroundPage();

const manageBookmarksButton = document.getElementById("manageBookmarks");
manageBookmarksButton.addEventListener("click", e => {
  browser.windows.create({
    type: "detached_panel",
    url: "../extensionPage/index.html",
    width: 500,
    height: 250
  });
});

const openOptionsButton = document.getElementById("openOptions");
openOptionsButton.addEventListener("click", () => {
  browser.runtime.openOptionsPage();
});

const addBookmarksForm = document.getElementById("addBoomarkForm");
addBookmarksForm.addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const bookmark = {
    url: form.url.value,
    title: form.title.value
  };
  background.addBookmark(bookmark);
});

async function init() {
  const apiToken = await background.retrieveApiToken();
  if (apiToken.length < 1) {
    document.getElementById("notoken").style.display = "block";
    document.getElementById("token").style.display = "none";
  } else {
    document.getElementById("notoken").style.display = "none";
    document.getElementById("token").style.display = "block";
    fillAddBookmarkForm();
  }
}

function fillAddBookmarkForm() {
  browser.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0];
    document.getElementById("url").value = tab.url;
    document.getElementById("title").value = tab.title;
  });
}

init();
