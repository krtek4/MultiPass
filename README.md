MultiPass for basic authentication
==================================

This extension allows you to register credential associated to a regular expression.

When you browse a website that requires HTTP basic authentication, if the URL match against
one of the regular expression, the credentials will be automatically sent.

No more cumbersome login popin, everything is done in the background.

Chrome web store
----------------

The extension is available on the Chrome web store: [MultiPass for HTTP basic authentication](https://chrome.google.com/webstore/detail/multipass-for-http-basic/enhldmjbphoeibbpdhmjkchohnidgnah).

Firefox Add-ons
---------------

The extension is available as a Firefox add-on : [MultiPass](https://addons.mozilla.org/en-US/firefox/addon/multipass/).

Opera add-ons
-------------

Currently awaiting moderation.

Report an issue
---------------

If you want to report an issue, use the Github issue tracker: [MultiPass issues](https://github.com/krtek4/MultiPass/issues).

Please make sure the issue is not already opened.

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

Credits
-------

* [Gilles Crettenand](http://gilles.crettenand.info): original idea and development
* [Jeroen Thora](https://github.com/acrobat): Dutch translation
