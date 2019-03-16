<template>
  <div>
    <div v-if="token.length < 1">
      <div class="panel-section panel-section-header">
        <p>Please provide your Pinboard API token in the options.</p>
      </div>
      <div class="panel-section panel-section-footer">
        <div
          class="panel-section-footer-button default"
          @click="openOptions()"
        >Open Pinboard++ options</div>
      </div>
    </div>
    <div v-else>
      <div class="panel-section panel-section-formElements">
        <form id="addBoomarkForm">
          <div class="form-item browser-style">
            <label for="url">URL</label>
            <input type="text" name="url" id="url" maxlength="2000" v-model="url">
          </div>
          <div class="form-item browser-style">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" maxlength="255" v-model="title">
          </div>
          <div class="form-item browser-style">
            <label for="tags">Tags</label>
            <vue-tags-input
              v-model="tag"
              :tags="tags"
              maxlength="255"
              :autocomplete-items="filteredTags"
              @tags-changed="newTags => tags = newTags"
            />
          </div>
          <div class="form-item browser-style">
            <label for="suggested">Suggested Tags</label>
            <ul class="suggested-tags">
              <li
                class="suggested-tag"
                v-for="tag in suggestedTags"
                :key="tag"
                @click="addSuggestedTag(tag)"
              >{{tag}}</li>
            </ul>
          </div>
          <div class="form-item browser-style">
            <label for="notes">Notes</label>
            <textarea
              class="browser-style"
              name="notes"
              id="notes"
              maxlength="65536"
              v-model="notes"
            ></textarea>
          </div>
          <div class="form-item browser-style">
            <input type="checkbox" id="private" name="private" v-model="privateBookmark">
            <label for="private" class="inline">Private bookmark</label>
          </div>
          <div class="form-item browser-style">
            <input type="checkbox" id="readlater" name="readlater" v-model="readLater">
            <label for="readlater" class="inline">Read later</label>
          </div>
        </form>
      </div>
      <div class="panel-section panel-section-footer">
        <div
          class="panel-section-footer-button default"
          id="addBookmarkButton"
          @click="addBookmark"
        >Add bookmark</div>
      </div>
    </div>
  </div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";

export default {
  components: {
    VueTagsInput
  },
  data() {
    return {
      token: "",
      allTags: [],
      url: "",
      title: "",
      suggestedTags: [],
      notes: "",
      privateBookmark: false,
      tags: [],
      tag: "",
      readLater: false
    };
  },
  async mounted() {
    const background = await browser.runtime.getBackgroundPage();
    this.token = await background.retrieveApiToken();
    const allTagsObject = await background.getAllTags();
    this.allTags = Object.keys(allTagsObject);
    browser.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0];
      this.url = tab.url;
      this.title = tab.title;
      background.getSuggestedTagsForUrl(tab.url).then(suggestions => {
        this.suggestedTags = suggestions[1].recommended;
      });
    });
  },
  methods: {
    openOptions() {
      browser.runtime.openOptionsPage();
      window.close();
    },
    addSuggestedTag(tag) {
      this.tags.push({ text: tag });
    },
    async addBookmark() {
      const background = await browser.runtime.getBackgroundPage();
      const bookmark = {
        url: this.url,
        title: this.title,
        tags: this.tags.map(tag => tag.text).join(" "),
        notes: this.notes,
        shared: this.privateBookmark ? "no" : "yes",
        toread: this.readLater ? "yes" : "no"
      };
      background.addBookmark(bookmark).then(response => {
        window.close();
      });
    }
  },
  computed: {
    filteredTags: function() {
      const filtered = this.allTags.filter(tag => {
        return tag.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
      return filtered.slice(0, 5);
    }
  }
};
</script>

