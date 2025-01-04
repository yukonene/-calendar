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

-------フォルダ構成-----------------------------------
react にはメジャーなフォルダー構成の方法として二つある。
https://zenn.dev/t_keshi/articles/bulletproof-react-2022
◎bulletproof
https://zenn.dev/kazu1/articles/c395f18633275c
・atomic design

/////デプロイ///////////////////////////////////////////////////////////////////////
cloudSQL...データベース
PostgreSQL→API を有効 →
「Enterprise→ サンドボックス → 最新 → 入れる → 生成（prodaction.local に memo）→ 東京 → シングル
→ インスタンスの構成>マシンのカスタマイズ>共有コア →1 vCPU、0.614 GB」
最小構成でやった場合インスタンスを立ち上げるのに１時間は見ておく
