var util = require('util');

var ExtJsStateProviderUtil = {
  decodeValue : function(value){

    // a -> Array
    // n -> Number
    // d -> Date
    // b -> Boolean
    // s -> String
    // o -> Object
    // -> Empty (null)

    var me = this,
        re = /^(a|n|d|b|s|o|e)\:(.*)$/,
        matches = re.exec(unescape(value)),
        all,
        type,
        keyValue,
        values,
        vLen,
        v;

    if (!matches || !matches[1]) {
      return; // non state
    }

    type = matches[1];
    value = matches[2];
    switch (type) {
    case 'e':
      return null;
    case 'n':
      return parseFloat(value);
    case 'd':
      return new Date(Date.parse(value));
    case 'b':
      return (value == '1');
    case 'a':
      all = [];
      if (value !== '') {
          values = value.split('^');
          vLen   = values.length;

          for (v = 0; v < vLen; v++) {
              value = values[v];
              all.push(me.decodeValue(value));
          }
      }
      return all;
    case 'o':
      all = {};
      if (value !== '') {
        values = value.split('^');
        vLen   = values.length;

        for (v = 0; v < vLen; v++) {
          value = values[v];
          keyValue         = value.split('=');
          all[keyValue[0]] = me.decodeValue(keyValue[1]);
        }
      }
      return all;
    default:
      return value;
    }
  }
};

module.exports = function (app, prefix) {
  var data = {};

  app.get(prefix + '/cookies.json', function (req, res) {
    var records = [];
    for (var name in data) {
      if (data.hasOwnProperty(name)) {
        records.push({
          name: name,
          value: data[name]
        });
      }
    }
    res.json(200, {
      success: true,
      data: records
    });
  });

  app.post(prefix + '/cookies.json', function (req, res) {
    if (!req.body.name) {
      return res.send(500);
    }
    data[req.body.name] = req.body.value;
    util.log(util.inspect(ExtJsStateProviderUtil.decodeValue(req.body.value), {depth:null,showHidden:true,colors:true}));
    res.send(200);
  });
};