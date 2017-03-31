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

describe('Convert to Named Function', function () {
    var subcontainer;
    var convertToMemberFunctionFactory;
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
        };

        mocker.getMock('logger').api.log = sinon.spy();
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/convertToNamedFunction/convertToNamedFunction.js');
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

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('convertToNamedFunctionFactory')(editorFake, function () { });

        this.verify(prettyJson(log.args));

    });

    it('should log an error if selection is invalid', function () {
        var sourceTokens = readSource('./test/fixtures/convertToNamedFunction/convertToNamedFunction.js');
        var range = {
          start: {
            row: 5,
            column: 1
          },
          end: {
            row: 6,
            column: 1
          }
        };

        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('convertToNamedFunctionFactory')(editorFake, function () { });

        this.verify(prettyJson(log.args));

    });

    it('should convert member function to named function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToNamedFunction/convertToNamedFunction.js');
        var range = {
          start: {
            row: 3,
            column: 0
          },
          end: {
            row: 4,
            column: 0
          }
        };

        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('convertToNamedFunctionFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should convert variable assigned a function to named function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToNamedFunction/convertToNamedFunction.js');
        var range = {
          start: {
            row: 8,
            column: 0
          },
          end: {
            row: 9,
            column: 0
          }
        };

        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('convertToNamedFunctionFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

});
