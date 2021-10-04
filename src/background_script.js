import PinboardService from "./services/pinboardService";
const baseApiUrl = "https://api.pinboard.in/v1";
const svc = new PinboardService(baseApiUrl);

function retrieveApiToken() {
  return new Promise((resolve, reject) => {
    browser.storage.sync.get("apitoken").then((res) => {
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
  const tagArray = Object.keys(allTags).map((k) => {
    return { name: k, count: allTags[k] };
  });
  const tagsByCount = tagArray.sort((a, b) => {
    return b.count - a.count;
  });
  return tagsByCount;
}

function setActiveIcon(params) {
  const path = params.active
    ? "icons/pinboard.svg"
    : "icons/pinboard_inactive.svg";
  browser.pageAction.setIcon({
    tabId: params.tabId,
    path,
  });
}

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  if (changeInfo.url) {
    getBookmarksForUrl(tab.url)
      .then((bookmarks) => {
        if (bookmarks.posts.length > 0) {
          setActiveIcon({ active: true, tabId: tab.id });
        } else {
          setActiveIcon({ active: false, tabId: tab.id });
        }
      })
      .finally((e) => {
        console.warn("Error while getting bookmarks", e);
      });
  }
});

const actions = {
  retrieveApiToken,
  loadBookmarks,
  login,
  addBookmark,
  getSuggestedTagsForUrl,
  getAllTags,
  getBookmarksForUrl,
  setActiveIcon,
};

browser.runtime.onMessage.addListener((message, sender, response) => {
  const action = actions[message.action];
  if (typeof action === "function") {
    return action(message.payload);
  } else {
    console.warn(`action ${message.action} not supported`);
    return;
  }
});
