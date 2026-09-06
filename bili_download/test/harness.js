'use strict';
/**
 * harness.js
 * Loads a Tampermonkey-style userscript (bili_download.js) into a jsdom sandbox
 * with mocked GM_* APIs, fake timers, jQuery and a findAndReplaceDOMText stub.
 * Lets tests drive the script exactly like a browser would.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

// 被测脚本默认即仓库内唯一一份：bili_download.js；可用 SCRIPT_PATH 覆盖
const SCRIPT_PATH = process.env.SCRIPT_PATH || path.join(__dirname, '..', 'bili_download.js');
const JQUERY_SRC = fs.readFileSync(path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.js'), 'utf8');

// ---------------------------------------------------------------------------
// Fake timers: deterministic control over setTimeout / setInterval.
// Must be installed *before* the userscript is evaluated.
// ---------------------------------------------------------------------------
function installFakeTimers(window) {
  const state = {
    timeouts: [],     // {id, fn, args}
    intervals: [],    // {id, fn, args}
    nextId: 1,
  };
  window.setTimeout = (fn, _ms, ...args) => {
    const id = state.nextId++;
    state.timeouts.push({ id, fn, args });
    return id;
  };
  window.clearTimeout = (id) => {
    const i = state.timeouts.findIndex((t) => t.id === id);
    if (i >= 0) state.timeouts.splice(i, 1);
  };
  window.setInterval = (fn, _ms, ...args) => {
    const id = state.nextId++;
    state.intervals.push({ id, fn, args });
    return id;
  };
  window.clearInterval = (id) => {
    const i = state.intervals.findIndex((t) => t.id === id);
    if (i >= 0) state.intervals.splice(i, 1);
  };
  // Run every pending one-shot timer once (in insertion order).
  state.runTimeouts = () => {
    const pending = state.timeouts.splice(0, state.timeouts.length);
    for (const t of pending) t.fn(...t.args);
  };
  // Run every interval callback `rounds` times (default 1).
  state.runIntervals = (rounds = 1) => {
    for (let r = 0; r < rounds; r++) {
      for (const iv of [...state.intervals]) iv.fn(...iv.args);
    }
  };
  state.count = {
    get timeouts() { return state.timeouts.length; },
    get intervals() { return state.intervals.length; },
  };
  return state;
}

// ---------------------------------------------------------------------------
// Minimal findAndReplaceDOMText stand-in. Only supports what this script uses:
// find a RegExp inside text nodes, replace the first match in each node with the
// element returned by `replace(matchInfo, regexp)`.
// ---------------------------------------------------------------------------
function installFindAndReplaceDOMText(window) {
  const doc = window.document; // stub executes in Node context -> never refer to bare `document`
  const MARK = 'data-shx-linkified';
  function textNodes(root) {
    const out = [];
    (function walk(node) {
      if (node.nodeType === 3) { out.push(node); return; }          // TEXT_NODE
      if (node.nodeType !== 1) return;                              // only elements descend
      const tag = node.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'A') return; // never touch <a>/script/style
      for (const child of node.childNodes) walk(child);
    })(root);
    return out;
  }
  window.findAndReplaceDOMText = (root, opts) => {
    const re = opts.find; // global RegExp
    for (const textNode of textNodes(root)) {
      re.lastIndex = 0;
      const value = textNode.nodeValue || '';
      const m = re.exec(value);
      if (!m) continue;
      const idx = m.index;
      const matched = m[0];
      const before = value.slice(0, idx);
      const after = value.slice(idx + matched.length);
      const el = opts.replace({ text: matched, node: textNode }, re);
      if (!el || !el.nodeType) continue;
      el.setAttribute(MARK, '1');
      const frag = doc.createDocumentFragment();
      if (before) frag.appendChild(doc.createTextNode(before));
      frag.appendChild(el);
      if (after) frag.appendChild(doc.createTextNode(after));
      textNode.parentNode.replaceChild(frag, textNode);
    }
  };
}

// ---------------------------------------------------------------------------
// GM mocks
// ---------------------------------------------------------------------------
function installGmMocks(window, seedValues = {}, router) {
  const store = new Map(Object.entries(seedValues));
  const requests = [];
  const menuCommands = new Map();

  window.GM_getValue = (key, def) => (store.has(key) ? store.get(key) : def);
  window.GM_setValue = (key, value) => { store.set(key, value); };
  window.GM_addStyle = () => {};
  window.GM_registerMenuCommand = (name, fn) => { menuCommands.set(name, fn); };
  window.GM_openInTab = () => {};
  window.GM_xmlhttpRequest = (cfg) => {
    const rec = { url: cfg.url, method: cfg.method, headers: cfg.headers, data: cfg.data };
    requests.push(rec);
    const resp = router(rec);
    if (resp && !resp.error) {
      cfg.onload && cfg.onload({ status: 200, responseText: resp.body, response: resp.body });
    } else {
      cfg.onerror && cfg.onerror({ status: resp && resp.status ? resp.status : 0, error: 'fail' });
    }
  };
  // Promise flavoured GM.* namespace (some fallback branches in the script check these)
  window.GM = {
    getValue: (key, def) => Promise.resolve(store.has(key) ? store.get(key) : def),
    setValue: (key, value) => { store.set(key, value); return Promise.resolve(); },
    openInTab: () => {},
  };
  window.unsafeWindow = window;
  return { store, requests, menuCommands };
}

// ---------------------------------------------------------------------------
// Sandbox factory
// ---------------------------------------------------------------------------
function makeSandbox(options = {}) {
  const {
    url = 'https://www.bilibili.com/',
    bodyHtml = '',
    seedValues = {},
    router = defaultRouter(),
  } = options;

  const vc = new VirtualConsole(); // silent: swallow "Not implemented" noise
  const dom = new JSDOM(`<!doctype html><html><head></head><body>${bodyHtml}</body></html>`, {
    url,
    runScripts: 'outside-only',
    virtualConsole: vc,
    pretendToBeVisual: true,
  });
  const { window } = dom;

  // ---- web globals that jsdom lacks --------------------------------------
  // innerText is not implemented by jsdom, yet the script (and many sites) rely on it.
  try {
    Object.defineProperty(window.HTMLElement.prototype, 'innerText', {
      configurable: true,
      get() { return this.textContent; },
      set(v) { this.textContent = v; },
    });
  } catch (_) {}

  // ---- web globals that jsdom lacks --------------------------------------
  window.confirm = () => true;
  window.prompt = () => 'yes';
  window.open = () => null;
  window.alert = () => {};
  const wsInstances = [];
  window.WebSocket = class WebSocketStub {
    constructor(targetUrl) { this.url = targetUrl; wsInstances.push(this); this.sent = null; this.closed = false; }
    send(data) { try { this.sent = JSON.parse(data); } catch (_) { this.sent = String(data); } }
    close() { this.closed = true; }
  };
  try { Object.defineProperty(window.location, 'reload', { value() {}, configurable: true }); } catch (_) {}

  const timers = installFakeTimers(window);
  installFindAndReplaceDOMText(window);
  const gm = installGmMocks(window, seedValues, router);

  // jQuery：仅当被测脚本依赖它时才需要注入。当前脚本为原生 DOM 实现，
  // 设置 NO_JQUERY=1 可验证其确无 jQuery 依赖。
  // 在 window 内执行 UMD 构建，使其绑定到本 jsdom 文档。
  if (process.env.NO_JQUERY !== '1') {
    window.eval(JQUERY_SRC);
    if (!window.$) throw new Error('failed to bootstrap jQuery in sandbox');
  }

  const flush = async (rounds = 12) => {
    for (let i = 0; i < rounds; i++) await new Promise((r) => setImmediate(r));
  };

  return { window, document: window.document, dom, timers, gm, wsInstances, flush };
}

// ---------------------------------------------------------------------------
// Default API router: canned Bilibili / aria2-server responses
// ---------------------------------------------------------------------------
const DEFAULT_VIEW = {
  code: 0, message: '0', ttl: 1,
  data: {
    bvid: 'BV1GJ411x7h7',
    aid: 170001,
    pic: 'https://i0.hdslb.com/bfs/archive/cover.jpg',
    title: '测试视频标题',
    cid: 1,
    pages: [
      { cid: 1001, page: 1, part: 'P1-开箱', first_frame: 'https://i0.hdslb.com/1.jpg' },
      { cid: 1002, page: 2, part: 'P2-评测', first_frame: 'https://i0.hdslb.com/2.jpg' },
      { cid: 1003, page: 3, part: 'P3-总结', first_frame: 'https://i0.hdslb.com/3.jpg' },
    ],
  },
};
const DEFAULT_PLAYURL = {
  code: 0, message: '0', ttl: 1,
  data: {
    durl: [{ url: 'https://upos-sz-mirrorcos.bilivideo.com/ok/test.mp4' }],
  },
};
const DEFAULT_SERVER = {
  data: { html: '<div class="server-mod">fake server html</div>', track: 'from=nav_test' },
};

function defaultRouter(cfg = {}) {
  const view = cfg.view || DEFAULT_VIEW;
  const playurl = cfg.playurl || DEFAULT_PLAYURL;
  const server = cfg.server || DEFAULT_SERVER;
  return (rec) => {
    if (rec.url.includes('/x/web-interface/view')) return { body: JSON.stringify(view) };
    if (rec.url.includes('/x/player/playurl')) return { body: JSON.stringify(playurl) };
    if (rec.url.includes('server.staticj.top')) return { body: JSON.stringify(server) };
    return null; // unhandled -> onerror
  };
}

module.exports = { makeSandbox, defaultRouter, DEFAULT_VIEW, SCRIPT_PATH };
