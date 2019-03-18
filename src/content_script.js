browser.runtime.onMessage.addListener(request => {
  if (request.action === "GET_DESCRIPTION") {
    let description = window.getSelection().toString();
    if (description.length < 1) {
      // if nothing is selected, try to get description from meta tag
      const metaDescription = document.querySelector(
        "meta[name='description']"
      );
      if (metaDescription) {
        description = metaDescription.getAttribute("content");
      }
    }
    return Promise.resolve(description);
  }
});
