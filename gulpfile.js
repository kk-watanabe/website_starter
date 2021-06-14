// gulpパッケージの読み込み
const requireDir = require('require-dir');

// タスクの読み込み
requireDir('./gulpfile/task/', {recurse: true});
