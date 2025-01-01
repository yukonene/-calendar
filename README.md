//docker 立ち上げ　 docker compose up
//DB 立ち上げ　　　　 npm run studio

※ctrl+shift+p → 　リロード window 　 window 全てをリセット

type の変更の書き方其々
Number(eventId)　　　　　　 string から number
new Date(body.endDateTime) ISO 文字列から date 型
.toISOString()　　　　　　　 date 型からの変換
.toString() string 型に

[日付関係は全て date-fns で行う]

[google cloud strage で CORS の設定を行う]
・<CORS とは>https://qiita.com/TaikiTkwkbysh/items/ec1f9163d286a94c929d
・<python の install>https://x.gd/PhZ6H
・<gestil の install>https://x.gd/Apgom

・<設定する>ターミナル、もしくは powershell で
gsutil cors set cors_setting_local.json gs://nenecalendar-local-bucket

・<設定できているか確認>ターミナル、もしくは powershell で
gsutil cors get gs://nenecalendar-local-bucket
