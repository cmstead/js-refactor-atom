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

describe('Negate Condition', function () {

    var subcontainer;
    var negateExpressionFactory;
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

        negateExpressionFactory = subcontainer.build('negateExpressionFactory');
    });

    it('should log an error if selection is empty', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
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
        subcontainer.build('negateExpressionFactory')(editorFake, function () { });

        this.verify(prettyJson(log.args));
    });

    it('should negate a single value', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var range = {
          start: {
            row: 3,
            column: 7
          },
          end: {
            row: 3,
            column: 10
          }
        };
        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('negateExpressionFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate negated value', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var range = {
          start: {
            row: 4,
            column: 7
          },
          end: {
            row: 4,
            column: 11
          }
        };
        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('negateExpressionFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate multiple values', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var range = {
          start: {
            row: 5,
            column: 7
          },
          end: {
            row: 5,
            column: 17
          }
        };
        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('negateExpressionFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate multiple values in parentheses', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var range = {
          start: {
            row: 6,
            column: 7
          },
          end: {
            row: 6,
            column: 19
          }
        };
        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('negateExpressionFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate negated values in parentheses', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var range = {
          start: {
            row: 7,
            column: 7
          },
          end: {
            row: 7,
            column: 28
          }
        };
        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('negateExpressionFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate un-grouped values with first value negated', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var range = {
          start: {
            row: 8,
            column: 7
          },
          end: {
            row: 8,
            column: 18
          }
        };
        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('negateExpressionFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });

    it('should negate un-grouped, individually grouped values with first value negated', function () {
        var sourceTokens = readSource('./test/fixtures/negateExpression/negateExpression.js');
        var range = {
          start: {
            row: 9,
            column: 7
          },
          end: {
            row: 9,
            column: 22
          }
        };
        var editorFake = editorFactory(sourceTokens, range);

        subcontainer.build('negateExpressionFactory')(editorFake, function () { });

        this.verify(prettyJson(applySetEditSpy.args));
    });



});
