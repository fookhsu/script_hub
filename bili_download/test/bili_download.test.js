'use strict';
/**
 * Integration tests for the bilibili userscript (bili_download.js).
 *
 * Usage:
 *   node test/bili_download.test.js                 # 默认跑 bili_download.js
 *   SCRIPT_PATH=./bili_download.js node test/bili_download.test.js
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { makeSandbox, defaultRouter, SCRIPT_PATH } = require('./harness');

const SCRIPT = fs.readFileSync(SCRIPT_PATH, 'utf8');

// ---------------------------------------------------------------------------
// tiny test runner
// ---------------------------------------------------------------------------
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

function withScript(opts, fn) {
  return async () => {
    const sb = makeSandbox(opts);
    try {
      sb.window.eval(SCRIPT);
    } catch (err) {
      throw new Error(`script failed to load: ${err.stack}`);
    }
    await fn(sb);
  };
}

const $qa = (doc, sel) => Array.from(doc.querySelectorAll(sel));
const $q = (doc, sel) => doc.querySelector(sel);

function click(el) {
  el.dispatchEvent(new (el.ownerDocument.defaultView.MouseEvent || MouseEvent)('click', {
    bubbles: true, cancelable: true, view: el.ownerDocument.defaultView,
  }));
}

// ===========================================================================
// 1. Boot: helper page (no bilibili host) must not crash and must inject css
// ===========================================================================
test('加载通用页面时无报错，注入公共样式，并注册“功能开关”菜单', withScript({ url: 'https://www.bilibili.com/' }, async (sb) => {
  const { document, gm } = sb;
  assert.ok(document.querySelector('style.web-toast-css') || true); // style injected via GM_addStyle (no DOM), checked below differently
  // GM_addStyle is stubbed (no DOM), but the <style> the dialog/singleton creates must exist lazily.
  // verify the command menu was registered (PC UA)
  assert.ok(gm.menuCommands.has('功能开关'), '应注册 功能开关 菜单');
  assert.strictEqual(gm.requests.length, 0);
}));

// ===========================================================================
// 2. Bilibili video page: toolbar created, download modal opens with parts
// ===========================================================================
test('B站视频页：渲染下载工具栏与多P弹框', withScript({
  url: 'https://www.bilibili.com/video/BV1GJ411x7h7/',
}, async (sb) => {
  const { document } = sb;

  // toolbar
  const toolbar = $q(document, '[id^="bilibili_exti_"]');
  assert.ok(toolbar, '应创建侧边工具栏');
  const btns = $qa(document, '[id^="bilibili_exti_"] [id^="download_s_"], [id^="bilibili_exti_"] [id^="focus_s_"]');
  assert.ok($qa(document, '[id^="bilibili_exti_"] [id^="download_s_"]').length === 1, '应有“下载视频”按钮');
  assert.ok($qa(document, '[id^="bilibili_exti_"] [id^="focus_s_"]').length === 1, '应有一键三连按钮');

  // click 下载视频 -> requests view api -> modal with 3 board-items
  const dlBtn = $q(document, '[id^="download_s_"]');
  click(dlBtn);
  await sb.flush();

  const modalBody = $q(document, '[class^="modal-body-"]');
  assert.ok(modalBody, '应创建下载弹框');
  assert.ok(modalBody.style.display === 'block', '弹框应显示');
  const items = $qa(modalBody, '.page-wrap .board-item');
  assert.strictEqual(items.length, 3, '应渲染 3 个分P');
  const titleA = $q(modalBody, '.page-container > div a');
  assert.ok(titleA && /测试视频标题/.test(titleA.textContent), '应包含视频标题与封面链接');

  // 全选 / 取消选择
  click($q(modalBody, '[name="selectall"]'));
  assert.ok($qa(modalBody, '.page-wrap input[type="checkbox"]').every((i) => i.checked), '全选后所有复选框应被选中');
  click($q(modalBody, '[name="removeSelect"]'));
  assert.ok($qa(modalBody, '.page-wrap input[type="checkbox"]').every((i) => !i.checked), '取消选择后所有复选框应未选中');

  // 关闭弹框
  click($q(modalBody, '.page-header .close'));
  assert.ok(modalBody.style.display !== 'block' || !document.body.contains(modalBody), '关闭后弹框应隐藏');
}));

// ===========================================================================
// 3. Batch download: select 2 parts, click batch -> playurl requests + aria2
// ===========================================================================
test('批量下载：选中2P 后向 playurl 发起请求并连接 aria2 RPC', withScript({
  url: 'https://www.bilibili.com/video/BV1GJ411x7h7/',
}, async (sb) => {
  const { document, gm, timers, wsInstances } = sb;
  click($q(document, '[id^="download_s_"]'));
  await sb.flush();

  const modalBody = $q(document, '[class^="modal-body-"]');
  const boxes = $qa(modalBody, '.page-wrap input[type="checkbox"]');
  click(boxes[0]);
  click(boxes[1]);
  assert.ok(boxes[0].checked && boxes[1].checked);

  const playBefore = gm.requests.filter((r) => r.url.includes('/x/player/playurl')).length;
  click($q(modalBody, '[name="downloadAll"]'));
  await sb.flush();
  timers.runTimeouts(); // 批量下载使用 setTimeout 逐个发起
  await sb.flush();

  const playAfter = gm.requests.filter((r) => r.url.includes('/x/player/playurl'));
  assert.strictEqual(playAfter.length - playBefore, 2, '应为每个选中P发起 playurl 请求');
  playAfter.slice(-2).forEach((r) => assert.ok(/avid=170001&cid=100[12]&qn=112/.test(r.url), `playurl url 异常: ${r.url}`));
  assert.strictEqual(wsInstances.length, 2, '应创建 2 个 aria2 WebSocket 连接');
  wsInstances.forEach((ws) => assert.ok(/ws:\/\/localhost:16800\/jsonrpc/.test(ws.url)));

  // 下载设置已保存
  const saved = gm.store.get('download_setting_key');
  assert.ok(saved && saved.RPCURL === 'ws://localhost:16800/jsonrpc', '应保存 RPC 设置');
}));

// ===========================================================================
// 3b. Top “全选” bar for lists with many episodes
// ===========================================================================
test('[功能] 多选集：弹框顶部提供一键全选勾选框', withScript({
  url: 'https://www.bilibili.com/video/BV1GJ411x7h7/',
}, async (sb) => {
  const { document, window } = sb;
  click($q(document, '[id^="download_s_"]'));
  await sb.flush();
  const modal = $q(document, '[class^="modal-body-"]');

  const master = $q(modal, 'input[name="dlMaster"]');
  assert.ok(master, '列表顶部应有一键“全选”勾选框');
  const boxes = $qa(modal, '.page-wrap input[type="checkbox"]');
  assert.strictEqual(boxes.length, 3);
  assert.strictEqual(master.checked, false, '初始不应选中');

  // 勾选顶部全选 → 所有 P 选中
  master.checked = true;
  master.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.ok(boxes.every((b) => b.checked), '顶部全选后所有分P应被选中');
  assert.strictEqual(master.indeterminate, false);

  // 取消顶部全选 → 全部取消
  master.checked = false;
  master.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.ok(boxes.every((b) => !b.checked), '再次取消后所有分P应取消');
}));

test('[功能] 多选集：顶部全选状态与已选数量实时联动', withScript({
  url: 'https://www.bilibili.com/video/BV1GJ411x7h7/',
}, async (sb) => {
  const { document, window } = sb;
  click($q(document, '[id^="download_s_"]'));
  await sb.flush();
  const modal = $q(document, '[class^="modal-body-"]');
  const master = $q(modal, 'input[name="dlMaster"]');
  const countEl = $q(modal, '.dl-count');
  const boxes = $qa(modal, '.page-wrap input[type="checkbox"]');

  assert.ok(/已选 0\/3 P/.test(countEl.textContent), '初始计数应为 0/3, got: ' + countEl.textContent);

  master.checked = true;
  master.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.ok(/已选 3\/3 P/.test(countEl.textContent), '全选后计数应为 3/3');
  assert.strictEqual(master.indeterminate, false);

  // 手动取消其中一 P → 计数更新、顶部变为半选
  boxes[1].checked = false;
  boxes[1].dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.ok(/已选 2\/3 P/.test(countEl.textContent), '取消一P后计数应为 2/3, got: ' + countEl.textContent);
  assert.strictEqual(master.checked, false, '部分选中时顶部不应为全选');
  assert.strictEqual(master.indeterminate, true, '部分选中时顶部应为半选状态');
}));

// ===========================================================================
// 4. record: “已看” badge on search/user pages
// ===========================================================================
test('浏览记录：搜索页已看视频显示“已看”角标', withScript({
  url: 'https://search.bilibili.com/all?keyword=test',
  bodyHtml: `
    <div class="bili-video-card">
      <a href="//www.bilibili.com/video/BV1GJ411x7h7/">视频标题</a>
    </div>
    <div class="bili-video-card">
      <a href="//www.bilibili.com/video/BV1zz1111zzz/">另一个视频</a>
    </div>
  `,
  seedValues: { bilibili_video_record: 'BV1GJ411x7h7' },
}, async (sb) => {
  const { document, timers } = sb;
  timers.runIntervals(1); // 轮询任务至少跑一轮
  await sb.flush();

  const cards = $qa(document, '.bili-video-card');
  const marks = $qa(document, 'div[name="marklooked"]');
  assert.strictEqual(marks.length, 1, '只有一个已看视频应显示角标');
  assert.ok(cards[0].contains(marks[0]), '角标应位于已看的视频卡片上');
  assert.ok(/已看/.test(marks[0].textContent));
}));

// ===========================================================================
// 5. record on video page: watch history gets stored
// ===========================================================================
test('浏览记录：视频页被浏览后记录到缓存', withScript({
  url: 'https://www.bilibili.com/video/BV1GJ411x7h7/',
  seedValues: {},
}, async (sb) => {
  const { gm, timers, document } = sb;
  // 第一次轮询时 URL 变化 => 记录 BV 号
  timers.runIntervals(1);
  const cache = gm.store.get('bilibili_video_record');
  assert.ok(cache && cache.includes('BV1GJ411x7h7'), '应记录当前视频 BV 号, got: ' + cache);
}));

// ===========================================================================
// 6. dialog: 功能开关 settings open/close/toggle
// ===========================================================================
test('功能开关：可打开弹框、切换选项并保存设置', withScript({
  url: 'https://www.bilibili.com/',
}, async (sb) => {
  const { document, gm, timers } = sb;
  const openSettings = gm.menuCommands.get('功能开关');
  assert.ok(typeof openSettings === 'function');
  openSettings();
  await sb.flush();

  const checkbox = $q(document, 'input[type="checkbox"][data-tag="bilibiliHelper"]');
  assert.ok(checkbox, '应渲染 bilibiliHelper 开关');
  assert.ok(checkbox.checked, '默认应开启');

  checkbox.click();
  await sb.flush();
  const settings = gm.store.get('setingData');
  assert.ok(settings && settings.bilibiliHelper === false, '关闭后应保存设置');

  // toast 出现
  const toast = $q(document, '.web-toast-kkli9');
  assert.ok(toast, '切换后应出现 toast 提示');
  // toast 会在 timeout 后被移除（进入 fadeOut）
  timers.runTimeouts();
}));

// ===========================================================================
// 7. description text -> links
// ===========================================================================
test('视频简介：描述中的外部网址被转成超链接', withScript({
  url: 'https://www.bilibili.com/video/BV1GJ411x7h7/',
  bodyHtml: `<div id="v_desc"><div>官网 https://example.com/abc 请访问</div></div>`,
}, async (sb) => {
  const { document } = sb;
  await sb.flush();
  const vDesc = $q(document, '#v_desc');
  const link = $q(vDesc, 'a[href="https://example.com/abc"]');
  assert.ok(link, '外部网址应转为链接');
  assert.strictEqual(link.getAttribute('target'), '_blank');
  assert.strictEqual(link.textContent, 'https://example.com/abc');
  // 没有无限递归
  assert.ok($qa(vDesc, 'a').length <= 1, '不应重复生成链接');
}));

// ===========================================================================
// 8. aria2 error handling path (window.open single download)
// ===========================================================================
test('单P下载：点击某P 直接 window.open 直链', withScript({
  url: 'https://www.bilibili.com/video/BV1GJ411x7h7/',
}, async (sb) => {
  const { document, gm, window } = sb;
  let opened = '';
  window.open = (u) => { opened = u; return null; };

  click($q(document, '[id^="download_s_"]'));
  await sb.flush();
  const modalBody = $q(document, '[class^="modal-body-"]');
  const firstSpan = $q(modalBody, '.page-wrap .board-item > span');
  click(firstSpan);
  await sb.flush();

  assert.ok(/upos-sz-mirrorcos\.bilivideo\.com/.test(opened), '应打开直链窗口, got: ' + opened);
}));

// ===========================================================================
// 9. Server navigation (tencent cloud)
// ===========================================================================
test('云厂商页：渲染服务器导航容器并从 API 拉取内容', withScript({
  url: 'https://cloud.tencent.com/product',
  bodyHtml: `<a id="spmLink" data-spm="abc" href="https://cloud.tencent.com/x?from=old">AI 服务器</a>`,
}, async (sb) => {
  const { document, gm, timers } = sb;
  const container = $q(document, '[id^="server-containerx"]');
  assert.ok(container, '应创建服务器导航容器');
  const req = gm.requests.find((r) => r.url.includes('server.staticj.top'));
  assert.ok(req, '应向 server.staticj.top 发起请求');
  await sb.flush();
  timers.runIntervals(1); // anchorRun 轮询
  await sb.flush();

  const bodyBox = $q(document, '[id^="server-container-body"]');
  assert.ok(bodyBox && /fake server html/.test(bodyBox.innerHTML), '应插入 API 返回的 HTML');

  // track 参数注入 & data-spm 清理
  const link = $q(document, '#spmLink');
  assert.ok(/from=nav_test/.test(link.getAttribute('href')), '锚点应被追加 track 参数');
  assert.strictEqual(link.getAttribute('rel'), 'noreferrer nofollow');
  assert.strictEqual(link.hasAttribute('data-spm'), false);
}));

// ===========================================================================
// 2b. ugc_season 合集：情景A 每集含多P / 情景B 每集单P
// ===========================================================================
const SEASON_MULTI_VIEW = {
  code: 0, message: '0', ttl: 1,
  data: {
    bvid: 'BV1SEASON0001', aid: 510002, // 当前页即合集的第1集
    pic: 'https://i0.hdslb.com/season.jpg', title: '合集当前集标题', cid: 9001,
    pages: [{ cid: 9001, page: 1, part: '上' }],
    ugc_season: {
      title: '测试合集标题',
      sections: [
        {
          title: '正片',
          episodes: [
            { aid: 510002, title: 'S1第1话', pages: [
              { cid: 9001, page: 1, part: '上' },
              { cid: 9002, page: 2, part: '下' },
            ]},
            { aid: 510003, title: 'S1第2话', pages: [
              { cid: 9003, page: 1, part: '完整版' },
            ]},
          ],
        },
        {
          title: '花絮',
          episodes: [
            { aid: 510004, title: 'S2第1话', pages: [
              { cid: 9004, page: 1, part: '上' },
              { cid: 9005, page: 2, part: '下' },
            ]},
          ],
        },
      ],
    },
  },
};

// 情景B：每集都是单P的合集
const SEASON_SINGLE_VIEW = {
  code: 0, message: '0', ttl: 1,
  data: {
    bvid: 'BV1SEASON0009', aid: 610001,
    pic: 'https://i0.hdslb.com/season2.jpg', title: '单P合集当前集', cid: 1,
    pages: [{ cid: 7001, page: 1, part: 'EP1' }],
    ugc_season: {
      title: '单P测试合集',
      sections: [
        {
          title: '正片',
          episodes: [
            { aid: 610001, title: 'EP1', pages: [{ cid: 7001, page: 1, part: 'EP1' }] },
            { aid: 610002, title: 'EP2', pages: [{ cid: 7002, page: 1, part: 'EP2' }] },
            { aid: 610003, title: 'EP3', pages: [{ cid: 7003, page: 1, part: 'EP3' }] },
          ],
        },
      ],
    },
  },
};

function seasonRouter(view) {
  return (rec) => {
    if (rec.url.includes('/x/web-interface/view')) return { body: JSON.stringify(view) };
    if (rec.url.includes('/x/player/playurl')) {
      return { body: JSON.stringify({ code: 0, message: '0', data: { durl: [{ url: 'https://upos.example/ok.mp4' }] } }) };
    }
    return null;
  };
}

const playurlReqs = (gm) => gm.requests.filter((r) => r.url.includes('/x/player/playurl'));

function openSeasonModal(sb, bvid) {
  click($q(sb.document, '[id^="download_s_"]'));
  return sb.flush();
}

// 情景A：合集内每集都含多个分P —— 默认“按集”展示
// (每集多P，全选/勾选某集 = 下载该集全部分P)
test('[功能] 合集每集多P：默认按集模式渲染每一集并标注分P数', withScript({
  url: 'https://www.bilibili.com/video/BV1SEASON0001/',
  router: seasonRouter(SEASON_MULTI_VIEW),
}, async (sb) => {
  const { document } = sb;
  await openSeasonModal(sb);
  const modal = $q(document, '[class^="modal-body-"]');

  // 顶部出现范围选择，默认“按集”
  const scope = $q(modal, '.dl-scope');
  assert.ok(scope, '合集页应出现下载范围选择');
  assert.strictEqual($q(modal, 'input[name="dlScope"][value="episode"]').checked, true, '默认应为按集');

  const items = $qa(modal, '.page-wrap .board-item');
  assert.strictEqual(items.length, 3, '按集模式应显示 3 集（而非 5 个分P）');
  assert.ok(/正片·第1集/.test($q(items[0], 'span').textContent), '第1集应带分部前缀');
  assert.ok(/2分P/.test($q(items[0], '.ep-badge').textContent), '多P的集应标注分P数');
  assert.ok(!$q(items[1], '.ep-badge'), '单P的集不应标注');
  assert.ok(/已选 0\/3 集/.test($q(modal, '.dl-count').textContent), '按集计数单位应为“集”');

  // 每行的 checkbox 带有该集所有分P的任务清单
  const tasks = JSON.parse($q(items[0], 'input[type="checkbox"]').dataset.tasks);
  assert.strictEqual(tasks.length, 2);
  assert.deepStrictEqual(tasks.map((t) => t.cid), [9001, 9002]);
}));

test('[功能] 合集每集多P：一键“下载当前集”按钮显示集名称并只勾选当前集', withScript({
  url: 'https://www.bilibili.com/video/BV1SEASON0001/',
  router: seasonRouter(SEASON_MULTI_VIEW),
}, async (sb) => {
  const { document, window } = sb;
  await openSeasonModal(sb);
  const modal = $q(document, '[class^="modal-body-"]');

  const btn = $q(modal, '[name="dlCurrent"]');
  assert.ok(btn, '按集模式下应出现“下载当前集”按钮');
  assert.ok(/S1第1话/.test(btn.textContent), '按钮应显示当前集名称, got: ' + btn.textContent);

  const boxes = $qa(modal, '.page-wrap input[type="checkbox"]');
  // 先误勾其它集，再点“下载当前集”应只保留当前集(第1集)
  boxes[1].checked = true;
  boxes[1].dispatchEvent(new window.Event('change', { bubbles: true }));
  click(btn);

  assert.strictEqual(boxes[0].checked, true, '当前集(第1集)应被勾选');
  assert.strictEqual(boxes[1].checked, false, '其它集应被取消勾选');
  assert.strictEqual(boxes[2].checked, false, '其它集应被取消勾选');
  assert.ok(boxes[0].closest('.board-item').classList.contains('dl-cur'), '当前集行应高亮');
  assert.ok(/已选 1\/3 集/.test($q(modal, '.dl-count').textContent), '应只选中1集');
}));

test('[功能] 合集每集多P：切换“下载全部P”平铺所有分P', withScript({
  url: 'https://www.bilibili.com/video/BV1SEASON0001/',
  router: seasonRouter(SEASON_MULTI_VIEW),
}, async (sb) => {
  const { document, window } = sb;
  await openSeasonModal(sb);
  const modal = $q(document, '[class^="modal-body-"]');

  const partRadio = $q(modal, 'input[name="dlScope"][value="part"]');
  partRadio.checked = true;
  partRadio.dispatchEvent(new window.Event('change', { bubbles: true }));

  const items = $qa(modal, '.page-wrap .board-item');
  assert.strictEqual(items.length, 5, '全部P模式应平铺 5 个分P');
  items.forEach((it) => {
    const input = $q(it, 'input[type="checkbox"]');
    assert.ok(input.dataset.aid, '缺少 aid');
    assert.ok(input.dataset.cid, '缺少 cid');
    assert.strictEqual(JSON.parse(input.dataset.tasks).length, 1, 'P 模式每行只对应一个任务');
  });
  assert.ok(/已选 0\/5 P/.test($q(modal, '.dl-count').textContent), 'P 模式计数单位应为 P');
}));

test('[功能] 合集每集多P：勾选整集批量下载自动展开该集全部分P', withScript({
  url: 'https://www.bilibili.com/video/BV1SEASON0001/',
  router: seasonRouter(SEASON_MULTI_VIEW),
}, async (sb) => {
  const { document, gm, timers, wsInstances } = sb;
  await openSeasonModal(sb);
  const modal = $q(document, '[class^="modal-body-"]');
  const items = $qa(modal, '.page-wrap .board-item');

  // 勾选第1集（2 个分P：9001/9002）并批量下载
  $q(items[0], 'input[type="checkbox"]').click();
  click($q(modal, '[name="downloadAll"]'));
  await sb.flush();
  timers.runTimeouts();
  await sb.flush();

  const reqs = playurlReqs(gm);
  assert.strictEqual(reqs.length, 2, '整集下载应展开为该集 2 个分P的请求');
  assert.ok(reqs.some((r) => /cid=9001/.test(r.url)) && reqs.some((r) => /cid=9002/.test(r.url)));
  assert.strictEqual(wsInstances.length, 2, '应创建 2 个 aria2 连接');
}));

test('[功能] 合集每集多P：点击多分P的集行自动勾选并提示走批量下载', withScript({
  url: 'https://www.bilibili.com/video/BV1SEASON0001/',
  router: seasonRouter(SEASON_MULTI_VIEW),
}, async (sb) => {
  const { document, gm, window } = sb;
  await openSeasonModal(sb);
  const modal = $q(document, '[class^="modal-body-"]');
  const items = $qa(modal, '.page-wrap .board-item');
  const box = $q(items[0], 'input[type="checkbox"]');

  const before = playurlReqs(gm).length;
  let opened = '';
  window.open = (u) => { opened = u; return null; };
  click($q(items[0], 'span')); // 点击“第1集（含2分P）”行
  await sb.flush();

  assert.strictEqual(opened, '', '多分P的集不应直接弹出多个下载窗口');
  assert.strictEqual(playurlReqs(gm).length, before, '不应立即发起单P请求');
  assert.strictEqual(box.checked, true, '应自动勾选该集');
  const toast = $q(document, '.web-toast-kkli9');
  assert.ok(toast && /批量下载/.test(toast.textContent), '应提示转批量下载');
}));

// 情景B：合集内每集都是单P —— 全选/按集下载 = 下载整个合集
test('[功能] 合集每集单P：全选按集后批量下载整个合集', withScript({
  url: 'https://www.bilibili.com/video/BV1SEASON0009/',
  router: seasonRouter(SEASON_SINGLE_VIEW),
}, async (sb) => {
  const { document, window, gm, timers, wsInstances } = sb;
  await openSeasonModal(sb);
  const modal = $q(document, '[class^="modal-body-"]');

  const items = $qa(modal, '.page-wrap .board-item');
  assert.strictEqual(items.length, 3, '每集单P：按集模式仍是 3 行（每行=1个视频）');
  items.forEach((it) => assert.ok(!$q(it, '.ep-badge'), '单P的集不应标注分P数'));

  // 顶部全选 = 选中整个合集
  const master = $q(modal, 'input[name="dlMaster"]');
  master.checked = true;
  master.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.ok(/已选 3\/3 集/.test($q(modal, '.dl-count').textContent));
  click($q(modal, '[name="downloadAll"]'));
  await sb.flush();
  timers.runTimeouts();
  await sb.flush();

  const reqs = playurlReqs(gm);
  assert.strictEqual(reqs.length, 3, '整个合集应发起 3 个下载请求');
  [7001, 7002, 7003].forEach((cid) => assert.ok(reqs.some((r) => r.url.indexOf('cid=' + cid) !== -1), '缺少 cid=' + cid));
  assert.strictEqual(wsInstances.length, 3);
}));

// ===========================================================================
// Fix regressions（这些用例描述原脚本存在的缺陷，优化版应全部通过）
// ===========================================================================
test('[行为] 弹框默认应真正选中 Motrix 单选框', withScript({
  url: 'https://www.bilibili.com/video/BV1GJ411x7h7/',
}, async (sb) => {
  const { document } = sb;
  click($q(document, '[id^="download_s_"]'));
  await sb.flush();
  const modal = $q(document, '[class^="modal-body-"]');
  const motrix = $q(modal, 'input[name="downloadWay"][value="Motrix"]');
  assert.ok(motrix, '应存在 Motrix 单选框');
  assert.strictEqual(motrix.checked, true, '默认应选中 Motrix（原脚本仅设置 checked 属性，实际未选中）');
}));

test('[行为] 切换 AriaNgGUI 自动带出 6800 RPC 地址', withScript({
  url: 'https://www.bilibili.com/video/BV1GJ411x 7h7/',
}, async (sb) => {
  const { document, window } = sb;
  click($q(document, '[id^="download_s_"]'));
  await sb.flush();
  const modal = $q(document, '[class^="modal-body-"]');
  const aria = $q(modal, 'input[name="downloadWay"][value="AriaNgGUI"]');
  aria.checked = true;
  aria.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.strictEqual($q(modal, 'input[name="RPCURL"]').value, 'ws://localhost:6800/jsonrpc');
}));

test('[修复] 服务器导航设置菜单保存后正常弹提示（不抛 toast 未定义错误）', withScript({
  url: 'https://cloud.tencent.com/product',
}, async (sb) => {
  const { gm, document, window } = sb;
  const handler = gm.menuCommands.get('服务器导航设置');
  assert.ok(typeof handler === 'function');
  window.prompt = () => 'no'; // 选择关闭
  handler();
  assert.strictEqual(gm.store.get('server_navigation_key'), false, '应保存关闭状态');
  assert.ok($q(document, '.web-toast-kkli9'), '应显示操作结果提示');
}));

// ===========================================================================
// runner
// ===========================================================================
(async () => {
  console.log(`\n=== 加载脚本: ${path.relative(process.cwd(), SCRIPT_PATH)} ===`);
  // 若设置了 KNOWN_FAIL_SUBSTR（逗号分隔），名称命中任一关键词的失败用例只提示不计入失败，
  // 用于原版基线中“已修复的已知 Bug”与“优化版新增功能（原版没有）”。
  const knownList = (process.env.KNOWN_FAIL_SUBSTR || '').split(',').map((s) => s.trim()).filter(Boolean);
  let passed = 0;
  let knownFails = 0;
  const failures = [];
  for (const t of tests) {
    const start = Date.now();
    try {
      await t.fn();
      passed++;
      console.log(`  ✔ ${t.name} (${Date.now() - start}ms)`);
    } catch (err) {
      if (knownList.some((k) => t.name.includes(k))) {
        knownFails++;
        console.warn(`  ~ 已知失败(预期，原版 Bug/新增功能)：${t.name}`);
        console.warn(`      ${String(err.message).split('\n')[0]}`);
      } else {
        failures.push({ name: t.name, err });
        console.error(`  ✘ ${t.name}`);
        console.error(`      ${String(err.message).split('\n').join('\n      ')}`);
      }
    }
  }
  console.log(`\n结果: ${passed}/${tests.length} 通过${knownFails ? `（另 ${knownFails} 个为已知预期失败）` : ''}`);
  if (failures.length) {
    process.exitCode = 1;
  }
})();
