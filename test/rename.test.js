'use strict';

'use strict';

var container = require('../lib/container');
var mocker = require('./mocker');
var sinon = require('sinon');
var assert = require('chai').assert;
var readSource = require('./test-utils/read-source');
var editorFactory = require('./test-utils/editorFactory');
var testUtils = require('./test-utils/test-utils');
var prettyJson = testUtils.prettyJson;

var approvalsConfig = require('./test-utils/approvalsConfig');
var approvals = require('approvals').configure(approvalsConfig).mocha('./test/approvals');

describe('Rename Variable', function () {

    var subcontainer;
    var updateSourceSpy;

    beforeEach(function () {
        subcontainer = container.new();

        mocker.registerMock('editActionsFactory');
        mocker.registerMock('dialogFactory');

        subcontainer.register(mocker.getMock('editActionsFactory').mock);
        subcontainer.register(mocker.getMock('dialogFactory').mock);

        updateSourceSpy = sinon.spy();

        mocker.getMock('editActionsFactory').api.updateSource = function (content, callback) {
            updateSourceSpy(content);
        };

        mocker.getMock('dialogFactory').api.open = function (prompt, callback) {
            callback('quux');
        };
    });

    it('should rename selected variable correctly', function () {
        var sourceTokens = readSource('./test/fixtures/rename/renameFactory.js');
        var range = {
          start: {
            row: 2,
            column: 15
          },
          end: {
            row: 2,
            column: 18
          }
        };

        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('renameFactory')(editorFake);

        this.verify(prettyJson(updateSourceSpy.args));
    });

    it('should rename selected variable in react code correctly', function () {
        var sourceTokens = readSource('./test/fixtures/rename/react-source.js');
        var range = {
          start: {
            row: 23,
            column: 14
          },
          end: {
            row: 23,
            column: 14
          }
        };

        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('renameFactory')(editorFake);

        this.verify(prettyJson(updateSourceSpy.args));
    });

});
