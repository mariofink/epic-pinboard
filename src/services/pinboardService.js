import xmljs from "xml-js";
import postConverter from "../converters/postConverter";
import suggestionsConverter from "../converters/suggestionsConverter";
import tagConverter from "../converters/tagConverter";

export default class PinboardService {
  constructor(baseApiUrl) {
    this.baseApiUrl = baseApiUrl;
  }
  login(token) {
    const url = this.baseApiUrl + "/user/api_token";
    return new Promise((resolve, reject) => {
      fetch(url + `?auth_token=${token}`)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  loadRecent(token) {
    const url = this.baseApiUrl + "/posts/recent";
    return new Promise((resolve, reject) => {
      fetch(url + `?auth_token=${token}`)
        .then(response => response.text())
        .then(xmlstring => {
          const responseObject = xmljs.xml2js(xmlstring);
          const posts = responseObject.elements[0].elements.map(post =>
            postConverter(post)
          );
          resolve(posts);
        })
        .catch(err => {
          console.error("Could not load bookmarks", err);
          reject(err);
        });
    });
  }

  getSuggestedTagsForUrl(token, bookmarkUrl) {
    const url = this.baseApiUrl + "/posts/suggest";
    return new Promise((resolve, reject) => {
      fetch(url + `?auth_token=${token}&url=${bookmarkUrl}`)
        .then(response => response.text())
        .then(xmlstring => {
          const responseObject = xmljs.xml2js(xmlstring);
          const suggestions = suggestionsConverter(
            responseObject.elements[0].elements
          );
          resolve(suggestions);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getAllTags(token) {
    const url = this.baseApiUrl + "/tags/get";
    return new Promise((resolve, reject) => {
      fetch(url + `?auth_token=${token}`)
        .then(response => response.text())
        .then(xmlstring => {
          const responseObject = xmljs.xml2js(xmlstring);
          const tags = responseObject.elements[0].elements.map(tag =>
            tagConverter(tag)
          );
          resolve(tags);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  addBookmark(token, bookmark) {
    const url = this.baseApiUrl + "/posts/add";
    return new Promise((resolve, reject) => {
      fetch(
        url +
          `?auth_token=${token}&url=${bookmark.url}&description=${
            bookmark.title
          }&extended=${bookmark.notes}&tags=${bookmark.tags}`
      )
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
