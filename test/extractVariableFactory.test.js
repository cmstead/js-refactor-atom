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

describe('Extract Variable', function () {
    var subcontainer;
    var extractVariableFactory;
    var applySetEditSpy;
    var applySetEditsSpy;

    beforeEach(function () {
        subcontainer = container.new();

        mocker.registerMock('logger');
        mocker.registerMock('editActionsFactory');
        mocker.registerMock('dialogFactory');

        subcontainer.register(mocker.getMock('logger').mock);
        subcontainer.register(mocker.getMock('editActionsFactory').mock);
        subcontainer.register(mocker.getMock('dialogFactory').mock);

        applySetEditSpy = sinon.spy();
        applySetEditsSpy = sinon.spy();

        mocker.getMock('editActionsFactory').api.applySetEdit = function (text, coords, callback) {
            applySetEditSpy(text, coords);
            callback();
        };

        mocker.getMock('dialogFactory').api.open = function (prompt, callback) {
            callback('foo');
        };

        mocker.getMock('logger').api.log = sinon.spy();
        mocker.getMock('logger').api.info = sinon.spy();
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
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
        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('extractVariableFactory')(editorFake, function () { });

        this.verify(prettyJson(info.args));
    });

    it('should log an error if selection is not inside a function', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        var range = {
          start: {
            row: 2,
            column: 13
          },
          end: {
            row: 2,
            column: 18
          }
        };
        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('extractVariableFactory')(editorFake, function () { });

        this.verify(prettyJson(info.args));
    });

    it('should extract variable when selection is safe', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        var range = {
          start: {
            row: 11,
            column: 17
          },
          end: {
            row: 11,
            column: 20
          }
        };
        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        subcontainer.build('extractVariableFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should extract complex variable', function () {
        var sourceTokens = readSource('./test/fixtures/extractVariable/extractVariable.js');
        var range = {
          start: {
            row: 11,
            column: 22
          },
          end: {
            row: 11,
            column: 27
          }
        };
        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        subcontainer.build('extractVariableFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

});
