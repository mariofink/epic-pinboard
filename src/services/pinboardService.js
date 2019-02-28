import xmljs from "xml-js";
import postConverter from "../converters/postConverter";

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
    console.log("Load bookmarks...", token);
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
}
