var credentials = [];

chrome.storage.sync.get('credentials', function (result) {
    if (result.hasOwnProperty('credentials')) {
        credentials = result.credentials;
    } else {
        chrome.storage.sync.set({'credentials': []});
        credentials = [];
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === 'sync' && changes.hasOwnProperty('credentials')) {
        credentials = changes.credentials.newValue;
    }
});


/**
 * Should return login information when a Basic Auth popin is opened on a website
 */
send_credentials = function (status) {
    for (var key in credentials) {
        if (credentials.hasOwnProperty(key)) {
            var re = new RegExp(credentials[key].url);
            if (re.test(status.url)) {
                return {
                    authCredentials: {
                        username: credentials[key].username,
                        password: credentials[key].password
                    }
                };
            }
        }
    }
    return {};
};

chrome.webRequest.onAuthRequired.addListener(send_credentials, {urls: ["<all_urls>"]}, ["blocking"]);
