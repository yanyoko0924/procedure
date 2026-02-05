const MAX_TRAINEES = 10;

// 制度定義（←ここを書き換えれば制度改正に対応）
const procedures = {
  first: [
    { name: "入国準備", calc: (en, as) => addDays(en, -30) },
    { name: "賃貸契約", calc: (en, as) => addDays(en, -10) },
    { name: "配属", calc: (en, as) => addDays(as, 7) },
    { name: "初回面談", calc: (en, as) => addDays(en, -90) },
    { name: "在留カード更新", calc: (en, as) => addYears(en, 1, -1) },
  ],
  second: [
    { name: "VISA取得", calc: (en, as) => addDays(en, -30) },
    { name: "賃貸契約", calc: (en, as) => addDays(en, -10) },
    { name: "配属", calc: (en, as) => addDays(as, 7) },
    { name: "初回面談", calc: (en, as) => addDays(en, -90) },
    { name: "在留カード更新", calc: (en, as) => addYears(en, 1, -1) },
  ]
};

// 入力欄生成
const inputsDiv = document.getElementById("inputs");
for (let i = 0; i < MAX_TRAINEES; i++) {
  inputsDiv.innerHTML += `
    <div class="trainee-block">
      <h3>${i + 1}人目</h3>
      <label>技能実習生名 <input type="text" class="name"></label>
      <label>入国グループ <input type="text" class="group"></label>
      <label>入国日 <input type="date" class="en-date"></label>
      <label>配属日 <input type="date" class="as-date"></label>
      <label>
        <input type="radio" name="type${i}" value="first">1・2号
        <input type="radio" name="type${i}" value="second">3号
      </label>
    </div>
  `;
}

// 日付計算用関数
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addYears(date, years, minusDays = 0) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  d.setDate(d.getDate() + minusDays);
  return d;
}

// 処理開始
document.getElementById("processBtn").addEventListener("click", () => {
  const blocks = document.querySelectorAll(".trainee-block");
  let allResults = [];
  let hasAnyInput = false;

  for (let block of blocks) {
    const name = block.querySelector(".name").value.trim();
    const group = block.querySelector(".group").value.trim();
    const enDate = block.querySelector(".en-date").value;
    const asDate = block.querySelector(".as-date").value;
    const type = block.querySelector("input[type=radio]:checked")?.value;

    const filledCount = [name, group, enDate, asDate, type].filter(v => v).length;

    if (filledCount > 0) hasAnyInput = true;
    if (filledCount > 0 && filledCount < 5) {
      alert("入力が途中の実習生があります。すべて入力してください。");
      return;
    }

    if (filledCount === 5) {
      const en = new Date(enDate);
      const as = new Date(asDate);
      procedures[type].forEach(p => {
        allResults.push({
          date: p.calc(en, as),
          text: `${p.name}（${name}）`
        });
      });
    }
  }

  if (!hasAnyInput) {
    alert("入力内容がすべて空欄です。");
    return;
  }

  allResults.sort((a, b) => a.date - b.date);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = allResults
    .map(r => `${formatDate(r.date)}：${r.text}`)
    .join("\n");

  document.getElementById("outputDate").textContent =
    "出力日：" + formatDate(new Date());
});

// 表示用日付
function formatDate(date) {
  const y = date.getFullYear();
  const m = ("0" + (date.getMonth() + 1)).slice(-2);
  const d = ("0" + date.getDate()).slice(-2);
  return `${y}/${m}/${d}`;
}
