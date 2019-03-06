<template>
  <div>
    <div v-if="token.length < 1">
      <div class="panel-section panel-section-header">
        <p>Please provide your Pinboard API token in the options.</p>
      </div>
      <div class="panel-section panel-section-footer">
        <div class="panel-section-footer-button default" id="openOptions">Open Pinboard++ options</div>
      </div>
    </div>
    <div v-else>ADD BOOKMARK FORM goes here</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: ""
    };
  },
  async mounted() {
    const background = await browser.runtime.getBackgroundPage();
    this.token = await background.retrieveApiToken();
  }
};
</script>

