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

describe('Inline Variable', function () {
    var subcontainer;
    var inlineVariableFactory;
    var applySetEditSpy;

    beforeEach(function () {
        subcontainer = container.new();

        mocker.registerMock('logger');
        mocker.registerMock('editActionsFactory');

        subcontainer.register(mocker.getMock('logger').mock);
        subcontainer.register(mocker.getMock('editActionsFactory').mock);

        applySetEditSpy = sinon.spy();

        mocker.getMock('editActionsFactory').api.applyDeleteEdit = function (coords) {
            applySetEditSpy(text, coords);

            return {
                then: function (callback) {
                    callback()
                }
            };
        };

        mocker.getMock('editActionsFactory').api.applySetEdit = function (text, coords) {
            applySetEditSpy(text, coords);

            return {
                then: function (callback) {

                }
            };
        };

        mocker.getMock('logger').api.log = sinon.spy();
        mocker.getMock('logger').api.info = sinon.spy();
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var range = {
          start: {
            row: 0,
            column: 1
          },
          end: {
            row: 0,
            column: 1
          }
        };
        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('inlineVariableFactory')(editorFake, function () { });

        this.verify(prettyJson(info.args));
    });

    it('should log an error if selection is not inside a function', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var range = {
          start: {
            row: 2,
            column: 0
          },
          end: {
            row: 2,
            column: 18
          }
        };
        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('inlineVariableFactory')(editorFake, function () { });

        this.verify(prettyJson(info.args));
    });

    it('should log an error if variable is not assigned', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var range = {
          start: {
            row: 11,
            column: 0
          },
          end: {
            row: 11,
            column: 12
          }
        };
        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        var info = mocker.getMock('logger').api.info;
        subcontainer.build('inlineVariableFactory')(editorFake, function () { });

        this.verify(prettyJson(info.args));
    });

    it('should inline variable when selection is okay', function () {
        var sourceTokens = readSource('./test/fixtures/inlineVariable/inlineVariable.js');
        var range = {
          start: {
            row: 12,
            column: 0
          },
          end: {
            row: 12,
            column: 21
          }
        };
        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        subcontainer.build('inlineVariableFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

});
