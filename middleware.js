export const config = {
  matcher: '/:path*',
};

const COOKIE_NAME = 'jackson_auth';
const COOKIE_VALUE = 'ok-278727-9f3a';
const MAX_AGE = 60 * 60 * 24 * 30; // 30일

function loginPage(showError) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>잭슨사무실 로그인</title>
<style>
  body { font-family: -apple-system, 'Noto Sans KR', sans-serif; background: #f4f0e8; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; box-sizing: border-box; }
  form { background: #fdfbf6; padding: 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(38,34,29,0.12); width: 100%; max-width: 320px; }
  h1 { font-size: 1.2rem; margin: 0 0 20px; color: #26221d; }
  input { width: 100%; padding: 11px; margin-bottom: 12px; border: 1px solid #ddd3bf; border-radius: 6px; box-sizing: border-box; font-size: 1rem; }
  button { width: 100%; padding: 11px; background: #a86a2a; color: #fff; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; }
  p.err { color: #c0392b; font-size: 0.85rem; margin: -6px 0 14px; }
</style>
</head>
<body>
<form method="POST" action="/login">
  <h1>잭슨사무실</h1>
  ${showError ? '<p class="err">아이디 또는 비밀번호가 틀렸습니다</p>' : ''}
  <input name="user" placeholder="아이디" autocomplete="username" required>
  <input name="pass" type="password" placeholder="비밀번호" autocomplete="current-password" required>
  <button type="submit">로그인</button>
</form>
</body>
</html>`;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get('cookie') || '';
  const isAuthed = cookieHeader
    .split(';')
    .some((c) => c.trim() === `${COOKIE_NAME}=${COOKIE_VALUE}`);

  if (url.pathname === '/login') {
    if (request.method === 'POST') {
      const body = await request.text();
      const params = new URLSearchParams(body);
      if (params.get('user') === 'jackson' && params.get('pass') === '278727') {
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/',
            'Set-Cookie': `${COOKIE_NAME}=${COOKIE_VALUE}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; SameSite=Lax`,
          },
        });
      }
      return new Response(loginPage(true), {
        status: 401,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }
    return new Response(loginPage(false), {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  if (isAuthed) {
    return;
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/login' },
  });
}
