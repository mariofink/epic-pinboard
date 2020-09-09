<template>
  <div>
    <div v-if="token.length < 1">
      <div class="panel-section panel-section-header">
        <p>Please provide your Pinboard API token in the options.</p>
      </div>
      <div class="panel-section panel-section-footer">
        <div class="panel-section-footer-button default" @click="openOptions()">
          Open Epic Pinboard options
        </div>
      </div>
    </div>
    <div v-else>
      <div v-show="loading">
        <div class="ball-pulse">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="panel-section panel-section-formElements" v-show="!loading">
        <form id="addBoomarkForm">
          <div class="form-item browser-style">
            <label for="url">URL</label>
            <input
              type="text"
              name="url"
              id="url"
              maxlength="2000"
              v-model="url"
            />
          </div>
          <div class="form-item browser-style">
            <label for="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              maxlength="255"
              v-model="title"
            />
          </div>
          <div class="form-item browser-style">
            <label for="tags">Tags</label>
            <vue-tags-input
              ref="tagsInput"
              v-model="tag"
              :tags="tags"
              :autocomplete-items="filteredTags"
              @tags-changed="(newTags) => (tags = newTags)"
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
              >
                {{ tag }}
              </li>
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
            <input
              type="checkbox"
              id="private"
              name="private"
              v-model="privateBookmark"
            />
            <label for="private" class="inline">Private bookmark</label>
          </div>
          <div class="form-item browser-style">
            <input
              type="checkbox"
              id="readlater"
              name="readlater"
              v-model="readLater"
            />
            <label for="readlater" class="inline">Read later</label>
          </div>
        </form>
      </div>
      <div class="panel-section panel-section-footer" v-show="!loading">
        <div
          class="panel-section-footer-button default"
          id="addBookmarkButton"
          @click="addBookmark"
        >
          {{ buttonCaption }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueTagsInput, createTags } from "@johmun/vue-tags-input";

function getActiveTab() {
  return new Promise((resolve, reject) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

const ctaAddBookmark = "Add bookmark";
const ctaUpdateBookmark = "Update bookmark";

export default {
  components: {
    VueTagsInput,
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
      readLater: false,
      loading: true,
      buttonCaption: ctaAddBookmark,
    };
  },
  async mounted() {
    this.token = await browser.runtime.sendMessage({
      action: "retrieveApiToken",
    });
    const allTagsObject = await browser.runtime.sendMessage({
      action: "getAllTags",
    });
    this.allTags = allTagsObject.map((i) => i.name);
    getActiveTab().then((tab) => {
      this.url = tab.url;
      this.title = tab.title;
      browser.runtime
        .sendMessage({ action: "getBookmarksForUrl", payload: tab.url })
        .then((bookmarks) => {
          if (bookmarks.posts.length > 0) {
            this.buttonCaption = ctaUpdateBookmark;
            const existingBookmark = bookmarks.posts[0];
            this.title = existingBookmark.description;
            this.notes = existingBookmark.extended;
            this.privateBookmark = existingBookmark.shared === "no";
            this.readLater = existingBookmark.toread === "yes";
            if (existingBookmark.tags.length > 0) {
              const existingTags = existingBookmark.tags.split(" ");
              this.tags = existingTags;
              if (existingTags.length > 0) {
                this.tags = createTags(existingTags);
              }
            }
          } else {
            browser.tabs
              .sendMessage(tab.id, {
                action: "GET_DESCRIPTION",
              })
              .then(
                (description) => {
                  this.notes = description;
                },
                (err) => {
                  console.error("err", err);
                }
              );
          }
        });
      browser.runtime
        .sendMessage({
          action: "getSuggestedTagsForUrl",
          payload: tab.url,
        })
        .then((suggestions) => {
          this.suggestedTags = suggestions[1].recommended;
          this.loading = false;
          // see: https://github.com/JohMun/vue-tags-input/issues/65
          this.$nextTick(() => {
            this.$refs.tagsInput.$refs.newTagInput.focus();
          });
        })
        .catch((err) => {
          this.loading = false;
        });
    });
    browser.commands.onCommand.addListener((command) => {
      if (command === "submit_add_bookmark_form") {
        this.addBookmark();
      }
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
      const bookmark = {
        url: this.url,
        title: this.title,
        tags: this.tags.map((tag) => tag.text).join(" "),
        notes: this.notes,
        shared: this.privateBookmark ? "no" : "yes",
        toread: this.readLater ? "yes" : "no",
      };
      browser.runtime
        .sendMessage({
          action: "addBookmark",
          payload: bookmark,
        })
        .catch((error) => {
          console.error("Error during addBookmark", error);
        })
        .finally(() => {
          /* 
          Since Firefox 79 there are some strange errors that can 
          occur during the above sendMessage call.
          As a quick fix, let's assume that the above call is always successful
          */
          getActiveTab().then((tab) => {
            browser.runtime.sendMessage({
              action: "setActiveIcon",
              payload: { active: true, tabId: tab.id },
            });
          });
          window.close();
        });
    },
  },
  computed: {
    filteredTags: function () {
      const filtered = this.allTags
        .filter((tag) => {
          return tag.toLowerCase().startsWith(this.tag.toLowerCase());
        })
        .map((tag) => {
          return {
            text: tag,
          };
        });
      return filtered.slice(0, 5);
    },
  },
};
</script>

<style>
.suggested-tags {
  list-style: none;
  padding: 0;
}

.suggested-tag {
  background: hsl(210.3, 100%, 63.5%);
  color: white;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  margin-top: 0.25rem;
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1.5;
}

.suggested-tag.active,
.suggested-tag:hover {
  cursor: pointer;
  background: #0060df;
}

.vue-tags-input .ti-item.ti-selected-item,
.vue-tags-input .ti-tag {
  background: hsl(210.3, 100%, 63.5%) !important;
}
</style>
