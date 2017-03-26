'use strict';

function typeUtils () {

  function throwOnBadTypeName(typeName) {
    if(typeof typeName !== 'string') {
      throw new Error('Type name must be a string');
    }
  }

  function isType(typeName) {
    throwOnBadTypeName(typeName);

    return function (value) {
      return typeof value === typeName;
    };
  }

  function either (type) {
    var typePred = isType('function')(type) ? type : isType(type);

    return function (defaultValue) {
      return function (value) {
        return typePred(value) ? value : defaultValue;
      };
    };
  }

  function maybe(type){
    return either(type)(null);
  }

  function isNull(value) {
    return value === null;
  }

  function isObjectInstance(value) {
    return isType('object')(value) && !isNull(value);
  }

  return {
    isNull: isNull,
    isObjectInstance: isObjectInstance,
    isType: isType,
    either: either,
    maybe: maybe
  };

}

module.exports = typeUtils;
