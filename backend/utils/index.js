"use strict";

const _ = require("lodash");

const getInfoData = (fields = [], object = {}) => {
  return _.pick(object, fields);
};

const flattenNestedObject = (object = {} , field) => {
  return _.merge(
      _.get(object, field), 
      _.omit(object, field)
  );
}

module.exports = {
  getInfoData,
  flattenNestedObject,
};
