MultiPass for basic authentication
==================================

This extension allows you to register credential associated to a regular expression.

When you browse a website that requires HTTP basic authentication, if the URL match against
one of the regular expression, the credentials will be automatically sent.

No more cumbersome login popin, everything is done in the background.

Chrome web store
----------------

The extension is available on the Chrome web store: [MultiPass for HTTP basic authentication](https://chrome.google.com/webstore/detail/multipass-for-http-basic/enhldmjbphoeibbpdhmjkchohnidgnah).

Opera add-ons
-------------

The extension is available as a Firefox add-on : [MultiPass](https://addons.opera.com/en/extensions/details/multipass/).

Firefox Add-ons
---------------

The extension was refused on the Firefox add-ons website due to infringement of the policy concerning Google Analytics.
See https://github.com/krtek4/MultiPass/issues/40 for more information.

In the meantime, you can download the latest release install it manually: https://github.com/krtek4/MultiPass/releases/latest and there is also a fork without Analytics: https://github.com/excitoon/MultiPassDisarmed

Report an issue
---------------

If you want to report an issue, use the Github issue tracker: [MultiPass issues](https://github.com/krtek4/MultiPass/issues).

Please make sure the issue is not already opened.

Build the extension
-------------------

1. Clone the github repository : `git clone git@github.com:krtek4/MultiPass.git`.
2. Enter the directory : `cd MultiPass`.
3. Install dependencies : `npm install`.
4. Build the extension : `npm run dist`.
5. The package for all supported browser is now available in the `dist` folder.

The installation process will depend on your browser.

Use the development version
---------------------------

If you want to use the development version, follow those steps :

1. Clone the github repository : `git clone git@github.com:krtek4/MultiPass.git`.
2. Enter the directory : `cd MultiPass`.
3. Install dependencies : `npm install`.
4. Build the extension : `npm run build`.
5. Open the Extension panel in Chrome : Tools / Extensions.
6. Make sure the "Developer mode" checkbox is checked.
7. Click on "Load unpacked extension...", first browse to the directory where you cloned the extension and then select the `build/chrome` folder.

Using the development version on Opera and Firefox is left as an exercise for the reader ;)

Credits
-------

* [Gilles Crettenand](http://gilles.crettenand.info): original idea and development
* [Jeroen Thora](https://github.com/acrobat): Dutch translation
* [Pascal Thormeier](https://github.com/thormeier): German translation
* [AceGentile](https://github.com/AceGentile): Italian translation
