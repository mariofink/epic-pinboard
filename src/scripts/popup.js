import Vue from "vue";
import AddBookmark from "../components/AddBookmark/AddBookmark.vue";

console.log("ADD", AddBookmark);
new Vue({
  el: "#pinboardAddBookmark",
  render(h) {
    return h("AddBookmark");
  },
  components: { AddBookmark },
});
