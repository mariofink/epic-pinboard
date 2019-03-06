require("awesomplete/awesomplete.css");
import Awesomplete from "awesomplete";
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
    const allTags = await background.getAllTags();
    console.log("all your tags are belong to us", allTags);
    new Awesomplete("#tags", {
      list: allTags.map(tag => tag.tag),
      filter: function(text, input) {
        return Awesomplete.FILTER_CONTAINS(text, input.match(/[^\s]*$/)[0]);
      },
      item: function(text, input) {
        return Awesomplete.ITEM(text, input.match(/[^\s]*$/)[0]);
      },
      replace: function(text) {
        var before = this.input.value.match(/^.+\s\s*|/)[0];
        this.input.value = before + text + " ";
      }
    });
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
      const markup = `
        <ul class="suggested-tags">
        ${suggestions.recommended
          .map(suggestion => `<li class="suggested-tag">${suggestion}</li>`)
          .join("")}
        </ul>
        `;
      document.getElementById("suggestedTags").innerHTML = markup;
    });
  });
}

init();
