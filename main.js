// Muay Thai Trainer Main JS
// --- 多語資料 ---
const LANGS = {
  zh: {
    reaction: '🥊 反應訓練', combo: '🧠 組合拳訓練', full: '💥 綜合技術訓練', stop: '⛔ 停止訓練',
    comboList: '組合拳清單', fullComboList: '綜合技術清單', add: '新增', delete: '刪除',
    interval: '組合間隔秒數', seconds: '秒', lang: '語言', voice: '語音', voiceInit: '初始化語音',
    voiceStatus: '語音狀態', notReady: '尚未初始化', notSupport: '本裝置不支援語音', notFound: '找不到語音',
    pleaseInit: '請先初始化語音', playFail: '語音播放失敗，請重新初始化', exists: '這組組合已存在',
    validCombo: '請輸入有效數字組合', existsFull: '這組綜合組合已存在', validFull: '請輸入有效組合',
    inputCombo: '輸入組合，例如：1 2 3', inputFullCombo: '輸入組合，例如：1 右中掃 左肘',
    fists: ['前手拳','後手拳','左擺拳','右擺拳','左鉤拳','右鉤拳'],
    legs: ['左低掃','右低掃','左中掃','右中掃','左高掃','右高掃'],
    elbows: ['左上肘','右上肘','左平砍肘','右平砍肘','左砸肘','右砸肘','左轉身肘','右轉身肘'],
    knees: ['左側膝','右側膝'], others: ['格檔','左正蹬','右正蹬','假動作']
  },
  en: {
    reaction: '🥊 Reaction Training', combo: '🧠 Combo Training', full: '💥 Mixed Technique', stop: '⛔ Stop',
    comboList: 'Combo List', fullComboList: 'Mixed List', add: 'Add', delete: 'Delete',
    interval: 'Interval', seconds: 'sec', lang: 'Language', voice: 'Voice', voiceInit: 'Init Voice',
    voiceStatus: 'Voice Status', notReady: 'Not initialized', notSupport: 'Speech not supported', notFound: 'No voice found',
    pleaseInit: 'Please init voice', playFail: 'Speech failed, re-init', exists: 'Combo already exists',
    validCombo: 'Enter valid combo', existsFull: 'Combo already exists', validFull: 'Enter valid combo',
    inputCombo: 'Input combo, e.g. 1 2 3', inputFullCombo: 'Input combo, e.g. 1 right middle kick left elbow',
    fists: ['Jab','Cross','Left Hook','Right Hook','Left Uppercut','Right Uppercut'],
    legs: ['Left Low Kick','Right Low Kick','Left Middle Kick','Right Middle Kick','Left High Kick','Right High Kick'],
    elbows: ['Left Up Elbow','Right Up Elbow','Left Horizontal Elbow','Right Horizontal Elbow','Left Down Elbow','Right Down Elbow','Left Spinning Elbow','Right Spinning Elbow'],
    knees: ['Left Knee','Right Knee'], others: ['Block','Left Teep','Right Teep','Feint']
  }
};
let currentLang = 'zh';
let voices = [];
let currentVoice = null;

function switchLang() {
  currentLang = document.getElementById('langSelect').value;
  renderLang();
}
function renderLang() {
  const t = LANGS[currentLang];
  document.querySelector('header > div:last-child').innerText = t.reaction;
  document.getElementById('reaction-btn').innerText = t.reaction;
  document.getElementById('combo-btn').innerText = t.combo;
  document.getElementById('fullcombo-btn').innerText = t.full;
  document.getElementById('stop-btn').innerText = t.stop;
  document.getElementById('langLabel').innerText = t.lang + '：';
  document.getElementById('voiceLabel').innerText = t.voice + '：';
  document.getElementById('intervalLabel').innerText = (intervalMs/1000);
  document.getElementById('comboModal').querySelector('h2').innerText = t.comboList;
  document.getElementById('comboModal').querySelector('.add-btn').innerText = t.add;
  document.getElementById('comboModal').querySelector('input').placeholder = t.inputCombo;
  document.getElementById('fullComboModal').querySelector('h2').innerText = t.fullComboList;
  document.getElementById('fullComboModal').querySelector('.add-btn').innerText = t.add;
  document.getElementById('fullComboModal').querySelector('input').placeholder = t.inputFullCombo;
}
document.addEventListener('DOMContentLoaded', renderLang);

// --- 基本狀態 ---
let trainingInterval = null;
let stopFlag = false;
let comboList = [ [1,2], [1,2,3], [2,3,2], [1,2,5,6], [3,4], [1,6,3,2], [2,5,6], [1,4,3] ];

// --- 語音播報 ---
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  const voiceSel = document.getElementById('voiceSelect');
  voiceSel.innerHTML = '';
  voices.forEach((v, i) => {
    if ((currentLang==='zh' && v.lang.indexOf('zh')===0) || (currentLang==='en' && v.lang.indexOf('en')===0)) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.text = v.name + ' (' + v.lang + ')';
      voiceSel.appendChild(opt);
    }
  });
  if (voiceSel.options.length>0) {
    voiceSel.selectedIndex = 0;
    currentVoice = voices[voiceSel.value];
  }
}
document.getElementById('voiceSelect').onchange = function() {
  currentVoice = voices[this.value];
};
window.speechSynthesis.onvoiceschanged = loadVoices;
function speak(text) {
  const synth = window.speechSynthesis;
  if (!synth || !currentVoice) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = currentVoice;
  utter.lang = currentVoice.lang;
  synth.speak(utter);
  document.getElementById('log').innerHTML = `<span style="font-size:2em;font-weight:bold;">${text}</span>`;
}

// --- 反應訓練 ---
function startReactionTraining() {
  stopFlag = false;
  function next() {
    if (stopFlag) return;
    const num = Math.floor(Math.random()*6)+1;
    speak(num.toString());
    const delay = 800 + Math.random()*2200;
    trainingInterval = setTimeout(next, delay);
  }
  next();
}

// --- 組合拳訓練 ---
function startComboTraining() {
  stopFlag = false;
  let idx = 0;
  function next() {
    if (stopFlag) return;
    if (comboList.length === 0) return;
    const combo = comboList[idx % comboList.length];
    speak(combo.join(' '));
    idx++;
    trainingInterval = setTimeout(next, 5000);
  }
  next();
}

// --- 拳腿肘膝組合 ---
const fistNames = ['前手拳','後手拳','左擺拳','右擺拳','左鉤拳','右鉤拳'];
const legNames = ['左低掃','右低掃','左中掃','右中掃','左高掃','右高掃'];
const elbowNames = ['左上肘','右上肘','左平砍肘','右平砍肘','左砸肘','右砸肘','左轉身肘','右轉身肘'];
const kneeNames = ['左側膝','右側膝'];
const others = ['格檔','左正蹬','右正蹬','假動作'];
const allMoves = [...fistNames, ...legNames, ...elbowNames, ...kneeNames, ...others];

function randomComboMove() {
  // 隨機選 2~5 個動作
  const n = Math.floor(Math.random()*4)+2;
  let moves = [];
  let pool = [...allMoves];
  for (let i=0;i<n;i++) {
    const idx = Math.floor(Math.random()*pool.length);
    moves.push(pool[idx]);
    pool.splice(idx,1);
  }
  return moves;
}

function startFullComboTraining() {
  stopFlag = false;
  function next() {
    if (stopFlag) return;
    const moves = randomComboMove();
    speak(moves.join('、'));
    trainingInterval = setTimeout(next, 5000);
  }
  next();
}

// --- 停止 ---
function stopTraining() {
  stopFlag = true;
  if (trainingInterval) clearTimeout(trainingInterval);
  window.speechSynthesis.cancel();
}

// --- 組合清單管理 ---
function renderComboList() {
  const list = document.getElementById('combo-list');
  list.innerHTML = '';
  comboList.forEach((combo, idx) => {
    const li = document.createElement('li');
    li.textContent = combo.join(' ');
    const delBtn = document.createElement('button');
    delBtn.textContent = '刪除';
    delBtn.onclick = () => {
      comboList.splice(idx,1);
      renderComboList();
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function addComboFromInput() {
  const input = document.getElementById('combo-input');
  const val = input.value.trim();
  if (!val) return;
  const arr = val.split(/\s+/).map(Number).filter(n=>n>=1&&n<=6);
  if (arr.length>0) {
    comboList.push(arr);
    renderComboList();
    input.value = '';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  renderComboList();
  document.getElementById('reaction-btn').onclick = startReactionTraining;
  document.getElementById('combo-btn').onclick = startComboTraining;
  document.getElementById('fullcombo-btn').onclick = startFullComboTraining;
  document.getElementById('stop-btn').onclick = stopTraining;
  document.getElementById('combo-add-btn').onclick = addComboFromInput;
});
