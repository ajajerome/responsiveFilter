#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Minimal fetch polyfill for Node 18+ uses global fetch; fallback to node-fetch if needed
let fetchFn = global.fetch;
if (!fetchFn) {
  fetchFn = (...args) => import('node-fetch').then(({default: f}) => f(...args));
}

function getEnvOrThrow(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function makeJwtTokenFromP8(p8Contents, keyId, issuerId) {
  const payload = {
    iss: issuerId,
    exp: Math.floor(Date.now() / 1000) + (20 * 60),
    aud: 'appstoreconnect-v1'
  };
  const token = jwt.sign(payload, p8Contents, {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: keyId,
      typ: 'JWT'
    }
  });
  return token;
}

async function main() {
  const keyB64 = process.env.ASC_KEY_B64;
  const keyId = getEnvOrThrow('ASC_KEY_ID');
  const issuerId = getEnvOrThrow('ASC_ISSUER_ID');

  if (!keyB64) {
    throw new Error('ASC_KEY_B64 required (base64 of AuthKey_*.p8)');
  }
  const p8 = Buffer.from(keyB64, 'base64').toString('utf8');
  const token = makeJwtTokenFromP8(p8, keyId, issuerId);

  const appIdentifier = process.env.APP_IDENTIFIER || 'com.fotbollsresan.app';
  const base = 'https://api.appstoreconnect.apple.com/v1';

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Find app by bundleId
  const appRes = await fetchFn(`${base}/apps?filter[bundleId]=${encodeURIComponent(appIdentifier)}`, { headers });
  if (!appRes.ok) {
    const text = await appRes.text();
    throw new Error(`Failed to fetch apps: ${appRes.status} ${text}`);
  }
  const appJson = await appRes.json();
  const app = appJson.data && appJson.data[0];
  if (!app) {
    console.log(JSON.stringify({ ok: false, reason: 'APP_NOT_FOUND', appIdentifier }, null, 2));
    return;
  }

  const appId = app.id;
  // Fetch builds (limit 1, sort by -uploadedDate)
  const buildsRes = await fetchFn(`${base}/builds?filter[app]=${appId}&include=preReleaseVersion&sort=-uploadedDate&limit=1`, { headers });
  if (!buildsRes.ok) {
    const text = await buildsRes.text();
    throw new Error(`Failed to fetch builds: ${buildsRes.status} ${text}`);
  }
  const buildsJson = await buildsRes.json();
  const build = buildsJson.data && buildsJson.data[0];
  if (!build) {
    console.log(JSON.stringify({ ok: true, empty: true }, null, 2));
    return;
  }

  let version = null;
  if (build.relationships && build.relationships.preReleaseVersion && build.relationships.preReleaseVersion.data) {
    const prv = build.relationships.preReleaseVersion.data;
    const included = buildsJson.included || [];
    const prvObj = included.find(x => x.type === 'preReleaseVersions' && x.id === prv.id);
    version = prvObj && prvObj.attributes && prvObj.attributes.version;
  }

  const result = {
    ok: true,
    appIdentifier,
    buildNumber: build.attributes && build.attributes.version,
    processingState: build.attributes && build.attributes.processingState,
    uploadedDate: build.attributes && build.attributes.uploadedDate,
    version
  };
  console.log(JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error(err.message || String(err));
  process.exit(1);
});

