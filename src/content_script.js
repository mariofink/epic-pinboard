browser.runtime.onMessage.addListener(request => {
  if (request.action === "GET_DESCRIPTION") {
    let selection = window.getSelection().toString();
    return Promise.resolve(selection);
  }
});
