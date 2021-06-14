# 開発環境

`Gulp` + `Webpack` を使用した開発環境です。
使い方、ディレクトリなど開発環境について紹介します。

## 初期設定

### node.js のインストール

インストールされていれば不要です。
インストールされていない場合は <a href="https://nodejs.org/ja/" target="_blank">公式サイト</a>からダウンロードしてください。

### モジュールのインストール

`npm install`

### 注意点

#### ※ gulp-cil を使用しない

通常 gulp を使用する場合は gulp-cil をグローバルインストールする必要があります。
一度インストールすれば、それ以降する必要はなくなりますが、バージョンの管理が難しくなります。
この開発環境では、色々なプロジェクトで複数人を想定しているため、バージョン管理のしやすい構造を目指しました。

## コマンド

「npm install」が終わった後に実行します。

<dl>
<dt>npm run build</dt>
<dd>srcを元にdocsを作成します。</dd>

<dt>npm run start</dt>
<dd>docsをルートにWebサーバーを立ち上げます。<br>立ち上げた後、srcを編集すると自動で反映されるようになります。</dd>
</dl>

## ディレクトリルール

<dl>
<dt>gulpfile</dt>
<dd>gulp、webpackなど開発環境の設定ファイルを格納。</dd>

<dt>src</dt>
<dd>開発用のファイルを格納。<br>設定ファイル以外、ここに格納。</dd>

<dt>docs</dt>
<dd>ページを構成するPHPファイルはここに入れておきます。<br>Wordpressデータを入れる想定なためsrcフォルダに入れないようにしました。<br>Webサーバーによりこのフォルダが表示。</dd>

<dt>lint</dt>
<dd>各linterの設定ファイルを格納。</dd>

<dt>publick</dt>
<dd>PHP関連の設定ファイルが入っています。</dd>
</dl>

### 全体の構成

```
root
┣ gulpfile
┃┠ task - gulp の設定ファイルを格納
┃┠ confing.js - gulp や webpack で使用する設定をまとめたファイル
┃┗ webpack.config.js - webpack の設定ファイル
┃
┣ docs
┃┠ company
┃┃┠ detail
┃┃┃┗ index.php - 第 3 階層確認のファイル
┃┃┗ index.php - 第 2 階層確認のファイル
┃┗ index.php - TOP ページ用の PHP ファイル
┃
┣ lint
┃┠ .eslintrc.json - ESlint の設定ファイル
┃┗ .sass-lint.yml - SASS の設定ファイル
┃
┣ src
┃┣ assets
┃┃┠ img - jpg|png|gif を格納。
┃┃┠ svg - svg ファイルを格納。コンパイル後は「docs/assets/img」に出力
┃┃┠ sass - scss ファイルを格納。コンパイル後は「docs/assets/css」に出力
┃┃┠ js - js ファイルを格納。
┃┃┠ inc - include するファイル
┃┃┃┗ data - ejs で使用する全体管理のファイル
┃┃┗ json - json ファイル。コンパイル後は「docs/assets/js」に出力
┃┗ index.html|.php
┃
┣ .gitignore
┣ gulpfile.js
┣ package.json
┗ README.md
```

※外部ファイルは全て assets フォルダに格納。
※複数のディレクトリに CSS や画像が入る場合には gulpfile.js の setting 変数の変更が必要です。

## gulp プラグインのバージョン管理

npm-check-updates を使用し管理します。<br>
<a href="http://tacamy.hatenablog.com/entry/2016/08/10/193603" target="_blank">参考サイト</a>を参考に対応

## その他

### CSS の記述順

CSS の順序は<a href="https://github.com/sasstools/sass-lint/blob/develop/lib/config/property-sort-orders/concentric.yml" target="_blank">concentric</a>を使用

### sass-lint の設定

sass-lint は<a href="https://github.com/sasstools/sass-lint/tree/develop/docs/rules" target="_blank">こちら</a>を確認

## 最後に

gulpfile.js で何を行っているのか、package.json にあるモジュールは何かを事前に把握して使用してください。
