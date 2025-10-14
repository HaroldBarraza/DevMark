chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "createBookmark") {
        handleBookmarkCreation(request.data);
    }
});