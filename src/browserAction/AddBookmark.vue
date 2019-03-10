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
            <input
              type="text"
              name="tags"
              id="tags"
              maxlength="255"
              data-maxitems="5"
              data-autofirst="true"
            >
          </div>
          <div class="form-item browser-style">
            <label for="suggested">Suggested Tags</label>
            <ul class="suggested-tags">
              <li class="suggested-tag" v-for="tag in suggestedTags" :key="tag">{{tag}}</li>
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
        </form>
      </div>
      <div class="panel-section panel-section-footer">
        <div class="panel-section-footer-button default" id="addBookmarkButton">Add bookmark</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: "",
      url: "",
      title: "",
      suggestedTags: [],
      notes: ""
    };
  },
  async mounted() {
    const background = await browser.runtime.getBackgroundPage();
    this.token = await background.retrieveApiToken();
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
    }
  }
};
</script>

