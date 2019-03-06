require("awesomplete/awesomplete.css");
import Awesomplete from "awesomplete";
const background = browser.extension.getBackgroundPage();

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
    window.close();
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
    new Awesomplete("#tags", {
      list: Object.keys(allTags),
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
      const markup = `
        <ul class="suggested-tags">
        ${suggestions[1].recommended
          .map(suggestion => `<li class="suggested-tag">${suggestion}</li>`)
          .join("")}
        </ul>
        `;
      document.getElementById("suggestedTags").innerHTML = markup;
      initTagEvents();
    });
  });
}

function tagOnClickHandler(event) {
  const tagElement = event.target;
  tagElement.classList.add("active");
  document.getElementById("tags").value += tagElement.innerHTML + " ";
  tagElement.removeEventListener("click", tagOnClickHandler);
}

function initTagEvents() {
  const tags = document.querySelectorAll(".suggested-tag");
  tags.forEach(tag => {
    tag.addEventListener("click", tagOnClickHandler);
  });
}

init();
