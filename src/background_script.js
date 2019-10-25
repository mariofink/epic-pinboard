import PinboardService from "./services/pinboardService";
const baseApiUrl = "https://api.pinboard.in/v1";
const svc = new PinboardService(baseApiUrl);

function retrieveApiToken() {
  return new Promise((resolve, reject) => {
    browser.storage.sync.get("apitoken").then(res => {
      resolve(res.apitoken || "");
    });
  });
}

async function login() {
  const token = await retrieveApiToken();
  return svc.login(token);
}

async function loadBookmarks() {
  const token = await retrieveApiToken();
  return svc.loadRecent(token);
}

async function addBookmark(bookmark) {
  const token = await retrieveApiToken();
  return svc.addBookmark(token, bookmark);
}

async function getBookmarksForUrl(bookmarkUrl) {
  const token = await retrieveApiToken();
  return svc.getBookmarksForUrl(token, bookmarkUrl);
}

async function getSuggestedTagsForUrl(bookmarkUrl) {
  const token = await retrieveApiToken();
  return svc.getSuggestedTagsForUrl(token, bookmarkUrl);
}

async function getAllTags() {
  const token = await retrieveApiToken();
  const allTags = await svc.getAllTags(token);
  const tagArray = Object.keys(allTags).map(k => {
    return { name: k, count: allTags[k] };
  });
  const tagsByCount = tagArray.sort((a, b) => {
    return b.count - a.count;
  });
  return tagsByCount;
}

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  if (changeInfo.url) {
    getBookmarksForUrl(tab.url)
      .then(bookmarks => {
        if (bookmarks.posts.length > 0) {
          browser.pageAction.setIcon({
            tabId: tab.id,
            path: "icons/pinboard.svg"
          });
        } else {
          browser.pageAction.setIcon({
            tabId: tab.id,
            path: "icons/pinboard_inactive.svg"
          });
        }
      })
      .finally(e => {
        console.warn("Error while getting bookmarks", e);
      });
  }
});

window.retrieveApiToken = retrieveApiToken;
window.loadBookmarks = loadBookmarks;
window.login = login;
window.addBookmark = addBookmark;
window.getSuggestedTagsForUrl = getSuggestedTagsForUrl;
window.getAllTags = getAllTags;
window.getBookmarksForUrl = getBookmarksForUrl;
