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

describe('Convert To Member Function', function () {

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

            return {
                then: function () { }
            };
        };

        mocker.getMock('logger').api.log = sinon.spy();
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/convertToMemberFunction/convertToMemberFunction.js');
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
        subcontainer.build('convertToMemberFunctionFactory')(editorFake, function () { });

        this.verify(prettyJson(log.args));
    });


    it('should log an error if selection does not contain a function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToMemberFunction/convertToMemberFunction.js');
        var range = {
          start: {
            row: 1,
            column: 1
          },
          end: {
            row: 2,
            column: 1
          }
        };

        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        var log = mocker.getMock('logger').api.log;
        subcontainer.build('convertToMemberFunctionFactory')(editorFake, function () { });

        this.verify(prettyJson(log.args));
    });

    it('should convert function to member function', function () {
        var sourceTokens = readSource('./test/fixtures/convertToMemberFunction/convertToMemberFunction.js');
        var range = {
          start: {
            row: 2,
            column: 0
          },
          end: {
            row: 3,
            column: 0
          }
        };

        var editorFake = editorFactory(sourceTokens, range);
        var applySetEdit = mocker.getMock('editActionsFactory').api.applySetEdit;

        subcontainer.build('convertToMemberFunctionFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

});
