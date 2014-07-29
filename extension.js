function retrieveCredentials (status) {
    var credential = Storage.getForUrl(status.url);

    if(credential.hasOwnProperty('username') && credential.hasOwnProperty('password')) {
        return {
            authCredentials: {
                username: credential.username,
                password: credential.password
            }
        };
    }

    return {};
};

chrome.webRequest.onAuthRequired.addListener(retrieveCredentials, {urls: ["<all_urls>"]}, ["blocking"]);
