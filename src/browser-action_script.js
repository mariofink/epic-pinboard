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
  addBookmark(addBookmarksForm);
});

const addBookmarkButton = document.getElementById("addBookmarkButton");
addBookmarkButton.addEventListener("click", e => {
  addBookmark(addBookmarksForm);
});

function addBookmark(form) {
  const bookmark = {
    url: form.url.value,
    title: form.title.value,
    tags: form.tags.value,
    notes: form.notes.value
  };
  background.addBookmark(bookmark).then(response => {
    console.log("added bookmark", response);
  });
}

async function init() {
  const apiToken = await background.retrieveApiToken();
  if (typeof apiToken === "undefined" || apiToken.length < 1) {
    document.getElementById("notoken").style.display = "block";
    document.getElementById("token").style.display = "none";
  } else {
    document.getElementById("notoken").style.display = "none";
    document.getElementById("token").style.display = "block";
    fillAddBookmarkForm();
  }
}

async function fillAddBookmarkForm() {
  browser.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0];
    const bookmarkUrl = tab.url;
    document.getElementById("url").value = bookmarkUrl;
    document.getElementById("title").value = tab.title;
    background.getSuggestedTagsForUrl(bookmarkUrl).then(suggestions => {
      console.log("SUGGEST", suggestions, bookmarkUrl);
      document.getElementById("suggested").value = suggestions.recommended.join(
        " "
      );
    });
  });
}

init();
