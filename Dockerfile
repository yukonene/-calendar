FROM node:22-alpine

# ビルド時の引数を受け取る
ARG ENV_FILE
# 環境変数ファイルをコピー
COPY $ENV_FILE .env.production.local

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# dockerに./start.shの実行権限を付与する
RUN chmod +x ./start.sh
# shellスクリプトの実行
CMD ["./start.sh"] 
