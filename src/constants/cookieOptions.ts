export const TEN_YEARS_IN_SEC = 315360000;

// https://qiita.com/OmeletteCurry19/items/f24ee02a942d8f6931a5
export const cookieOptions = {
  maxAge: TEN_YEARS_IN_SEC, //cookieの有効期限
  secure: true, //httpsしか受け付けません
  sameSite: 'lax' as const,
  // httpOnly:
};
