var Option = function() {
    'use strict';

    function init() {
    }

    return {
        'init': init
    }
}();

$(function () {
    Analytics.event('Options', 'opened');
    Option.init();
});
