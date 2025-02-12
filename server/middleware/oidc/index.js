// Copyright (c) 2024-2025 Uber Technologies Inc.
//
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const OpenIDClient = require('openid-client');
const passport = require('koa-passport');
const session = require('koa-session');
const allowUrl = ['/login', '/logout', '/oauth2/redirect'];

let settings = {};
let oiClient;

try {
  settings = require('../../config/oidc.js');
} catch (e) {
  console.log('OIDC configuration file not found, using ENV variables');
}

const clientID = settings.clientID || process.env.OPENID_CLIENT_ID;
const clientSecret = settings.clientSecret || process.env.OPENID_CLIENT_SECRET;
const callbackURL = settings.callbackURL || process.env.OPENID_CALLBACK_URL;
const discoverURL = settings.discoverURL || process.env.OPENID_DISCOVER_URL;
const scope = settings.scope || process.env.OPENID_SCOPE || 'openid';

function verifyCallback(tokenSet, user, done) {
  let email = '';

  if (tokenSet.claims().email) {
    email = tokenSet.claims().email;
  }

  return done(null, {
    accessToken: tokenSet.access_token,
    refreshToken: tokenSet.refresh_token,
    exp: tokenSet.expires_at,
    email: email,
  });
}

const middleware = async function(ctx, next) {
  if (allowUrl.includes(ctx.path)) {
    return next();
  }

  if (ctx.isUnauthenticated()) {
    return ctx.redirect('/login');
  }

  // refresh token when access token is expired
  if (
    ctx.state.user.exp !== undefined &&
    ctx.state.user.exp < Date.now() / 1000
  ) {
    const ts = await oiClient.refresh(ctx.state.user.refreshToken);

    ctx.state.user.exp = ts.expires_at;
    ctx.state.user.accessToken = ts.access_token;
  }

  ctx.authTokenHeaders = ctx.authTokenHeaders || {};
  ctx.authTokenHeaders['cadence-authorization'] = ctx.state.user.accessToken;

  await next();
};

const setupAuth = async function(app, router) {
  app.keys = ['secret'];
  app.use(session(app));
  app.use(passport.initialize());
  app.use(passport.session());

  router.get('/login', passport.authenticate('oidc'));
  router.get('/logout', async ctx => {
    ctx.logout();
    ctx.redirect('/');
  });
  router.get(
    '/oauth2/redirect',
    passport.authenticate('oidc', {
      successReturnToOrRedirect: '/',
      failureRedirect: '/login',
    })
  );
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  const discovered = await OpenIDClient.Issuer.discover(discoverURL);

  oiClient = new discovered.Client({
    client_id: clientID,
    client_secret: clientSecret,
  });

  const strategyOptions = {
    client: oiClient,
    params: {
      redirect_uri: callbackURL,
      scope: scope,
    },
    passReqToCallback: false,
  };

  passport.use(
    'oidc',
    new OpenIDClient.Strategy(strategyOptions, verifyCallback)
  );
};

module.exports = {
  setupAuth: setupAuth,
  middleware: middleware,
};
