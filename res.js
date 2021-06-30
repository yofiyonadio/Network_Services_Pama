'use strict';

exports.ok = function (values, res, format) {
  var data = {
    'status': 200,
    'values': values
  };

  res.json(data);
  res.end();
};

exports.text = function (values, res, format) {
  res.send(values);
  res.end();
};

