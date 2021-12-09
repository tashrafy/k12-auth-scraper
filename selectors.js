const WHITELISTED_LOGIN_SELECTORS = [
    'input[name*=username]',
    'input[name*=UserName]',
    'input[name*=Username_Aeries]',
    'input[name*=userName]',
    'input[name*=portalAccountUsername]',
    'input[name*=Email]',
    'input[name*=email]',
    'input[type*=email]',
    'input[name*=ctl00$mainLogin$Email]',
    'input[name*=ctl00$ContentPlaceHolder1$txtUsername]',
    'input[name*=ctl00$MainContent$username]',
    'input[name*=ctl00$ctl00$PrimaryPlaceHolder$ContentPlaceHolderMain$LoginControl$LogInServerControl$UserName]',
    '#login_form',
    '#login-form',
    '#LoginForm',
    '#Username',
    '#username',
    'input[name*=txtUID]',
    'input[name*=TxtBxUName]',
    'input[name*=inputEmail]',
];

const WHITELISTED_SSO_SELECTORS = [
    '.sso-login-link',
    '.sso-button-schoolpointe',
    '#qa-singlesignon-link',
    '#single_signon_link',
    '.AuthMethod--container',
    '.google-login',
    'a[class*="Google"]',
    'img[alt*=Microsoft]',
    'img[alt*=Google]',
    'input[name*=identifier]',
    'input[name*=loginfmt]',
    'input[name*=\'ctl00$ContentPlaceHolder1$imgGoogle\']',
];

module.exports = {
    WHITELISTED_LOGIN_SELECTORS,
    WHITELISTED_SSO_SELECTORS
}