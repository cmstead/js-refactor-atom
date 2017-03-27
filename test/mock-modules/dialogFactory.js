'use strict';

function dialogFactory (api) {
    return function dialogFactory() {
        return api;
    }
}

module.exports = dialogFactory;
