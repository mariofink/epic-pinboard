import Vue from "vue";
import AddBookmark from "./browserAction/AddBookmark.vue";

console.log("ADD", AddBookmark);
new Vue({
  el: "#pinboardAddBookmark",
  render(h) {
    return h("AddBookmark");
  },
  components: { AddBookmark }
});
