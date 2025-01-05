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
-----cloudSQL(データベース)----------------------------------
PostgreSQL→API を有効 →
「Enterprise→ サンドボックス → 最新 → 入れる → 生成（prodaction.local に memo）→ 東京 → シングル
→ インスタンスの構成>マシンのカスタマイズ>共有コア →1 vCPU、0.614 GB」
最小構成でやった場合インスタンスを立ち上げるのに１時間は見ておく
データベースの作成。
ユーザーアカウントの作成。ユーザー名とパスは memo しておく。
pass は％エンコーディングする。
最終的に DATABASE_URL にまとめる。

-----クラウドラン---------------------------------------------
github と連携して使う
[リポジトリの接続 →github→cloudbuild の設定 → クラウド SQL を接続する]

-----クラウドビルド----------------------------------------------
トリガーの中から対象のトリガーを選択して構成のロケーションを「リポジトリ」に変更する。

-----クラウドストレージ-------------------------------------------
バケットを作成する。
サービスアカウントの作成。ロールに storage オブジェクト管理者を設定する。
キーを DL して、環境変数に書き込む。

-----環境変数の設定---------------------------------------------
cloudbuild.yaml の作成>>>[Dockerfile]の作成>>>cloudbuild が Dockerfile を元に Image を作成>>>container(cloudrun)が完成
※※※※※cloudbuild.yaml は seacletManager から環境変数を受け取って、その値を Dockerfile に注入する設定を記載できる。※※※※※※
シークレットマネジャーで.env.prodaction.local から全ての項目の登録をする。加えて、シークレットマネジャーで ENV_FILE の項目に.env.production.local のファイル自体ををアップロードする
cloudRun のサービスアカウントのメールアドレスを memo する。例：00000-compute@developer.gserviceaccount.com
シークレットマネジャーの各環境変数の権限タブで、新しいプリンシバルに上記メールアドレスを指定して、「SecletManager の secret アクセサー」のロールを付与する
cloudbuild.yaml で、新たに fetch-secret ステップを追加する。また build ステップで'--build-arg'と'ENV_FILE=.env.production.local'を追記する
上記を行ったうえで、cloudrun でシークレットマネージャーに入れた変数をすべて設定する（ENV_FILE は除く）
-----データベースの初期設定------------------------------------------
start.sh 内に npm prisma migrate deploy を記載する事で実行できる
-----google cloud strage で CORS の設定を行う------------------------------------------
gsutil cors set cors_setting_production.json gs://nenecalendar-bucket
gsutil cors get gs://nenecalendar-bucket
-----カスタムドメインの設定------------------------------------------
事前に Cloud Domains で、ドメインを購入しておく。
そのうえで、下の手順でマッピング
https://cloud.google.com/run/docs/mapping-custom-domains?hl=ja#map
設定後数分～１日まつとマッピングされる
