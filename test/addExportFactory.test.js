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

describe('Add Export', function () {

    var subcontainer;
    var addExportFactory;
    var applySetEditSpy;

    beforeEach(function () {
        subcontainer = container.new();

        mocker.registerMock('logger');
        mocker.registerMock('editActionsFactory');

        subcontainer.register(mocker.getMock('logger').mock);
        subcontainer.register(mocker.registerMock('editActionsFactory').mock);

        applySetEditSpy = sinon.spy();
        mocker.getMock('editActionsFactory').api.applySetEdit = function (text, coords) {
            applySetEditSpy(text, coords);

            return {
                then: function(){}
            };
        };

        mocker.getMock('logger').api.log = sinon.spy();
    });

    it('should log an error if function name comes back blank', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-no-exports.js');
        var range = {
          start: {
            row: 0,
            column: 0
          },
          end: {
            row: 0,
            column: 0
          }
        };
        var editorFake =  editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('addExportFactory')(editorFake, function(){});

        this.verify(prettyJson(log.args));
    });

    it('should add an export to file source when one does not exist', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-no-exports.js');
        var range = {
          start: {
            row: 2,
            column: 0
          },
          end: {
            row: 5,
            column: 1
          }
        }
        var editorFake =  editorFactory(sourceTokens, range);

        subcontainer.build('addExportFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should add a single line export to file sourceif other exports are single line', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-line-exports.js');
        var range = {
          start: {
            row: 2,
            column: 0
          },
          end: {
            row: 5,
            column: 1
          }
        }
        var editorFake =  editorFactory(sourceTokens, range);

        subcontainer.build('addExportFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should add an export line to existing exported object', function () {
        var sourceTokens = readSource('./test/fixtures/addExport/addExport-object-exports.js');
        var range = {
          start: {
            row: 2,
            column: 0
          },
          end: {
            row: 5,
            column: 1
          }
        }
        var editorFake =  editorFactory(sourceTokens, range);

        subcontainer.build('addExportFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

});
