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
  console.log(allTags, tagsByCount, "---");
  return tagsByCount;
}

window.retrieveApiToken = retrieveApiToken;
window.loadBookmarks = loadBookmarks;
window.login = login;
window.addBookmark = addBookmark;
window.getSuggestedTagsForUrl = getSuggestedTagsForUrl;
window.getAllTags = getAllTags;
window.getBookmarksForUrl = getBookmarksForUrl;
