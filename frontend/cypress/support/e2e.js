import "./commands";

Cypress.on("window:before:load", (win) => {
  const observer = new win.MutationObserver(() => {
    const overlay = win.document.getElementById("webpack-dev-server-client-overlay");
    if (overlay) overlay.remove();
  });
  observer.observe(win.document, { childList: true, subtree: true });
});