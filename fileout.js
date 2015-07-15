/**
 * ファイル出力用モジュール
 *
 */

var fs = require("fs");
var path = require("path");

exports.write = function (filename, data) {
  var filepath = path.resolve(filename);
  fs.writeFile(filepath, data, "utf8", function (err) {
    if (err) {
      console.error(err);
    }
    console.log("Write:", filename);
  });
};
