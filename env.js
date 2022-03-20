const AUTH_EMAIL = "urlshortnerpranit@gmail.com";
const AUTH_PASS = "asdfgh!@#$1234";
JWT_SECRET = "secretkey";

let url =
  "http://${req.headers.host}/user/verify-email?token=${document.emailToken}";
let url2 =
  "href=http://localhost:4000/users/verify-email/${document.emailToken}";
module.exports = { AUTH_EMAIL, AUTH_PASS, JWT_SECRET };
