const STORAGE_KEY = "pairSummaryTemplateV2";

const defaults = {
  theme: "#6b6280",
  work: "작품명",
  pair: "페어명",
  names: "캐릭터 A × 캐릭터 B",
  relation: "둘이 어떤 사이인지 한눈에 이해할 수 있는 핵심 요약이 들어갑니다.",
  keywords: "관계 키워드",
  world: "관계 이해에 필요한 세계관과 상황만 간단히 적습니다.",
  aName: "캐릭터 A",
  aInfo: "나이 · 소속 · 역할",
  aKeywords: "성격 키워드",
  aVoice: "말투와 관계에서 중요한 특징",
  bName: "캐릭터 B",
  bInfo: "나이 · 소속 · 역할",
  bKeywords: "성격 키워드",
  bVoice: "말투와 관계에서 중요한 특징",
  dynamic: "과거와 현재 관계, 둘이 함께 있을 때의 분위기와 거리감을 적습니다.",
  aToB: "A가 B를 바라보는 감정과 태도.",
  bToA: "B가 A를 바라보는 감정과 태도.",
  story: "첫 만남부터 현재까지의 핵심 사건만 짧게 정리합니다.",
  points: "꼭 살려야 하는 분위기와 감정선을 적습니다.",
  mustNever: "필수 요소와 피하고 싶은 해석을 적습니다.",
  reference: "외관 이미지 · 기존 연성 · 플레이리스트 등"
};

const previewMap = {
  work: "pWork",
  pair: "pPair",
  names: "pNames",
  relation: "pRelation",
  keywords: "pKeywords",
  world: "pWorld",
  aName: "pAName",
  aInfo: "pAInfo",
  aKeywords: "pAKeywords",
  aVoice: "pAVoice",
  bName: "pBName",
  bInfo: "pBInfo",
  bKeywords: "pBKeywords",
  bVoice: "pBVoice",
  dynamic: "pDynamic",
  aToB: "pAToB",
  bToA: "pBToA",
  story: "pStory",
  points: "pPoints",
  mustNever: "pMustNever",
  reference: "pReference"
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function mixWithWhite(hex, amount = 0.82) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#ece9f0";
  const mix = c => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(rgb.r)}, ${mix(rgb.g)}, ${mix(rgb.b)})`;
}

function applyTheme(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  document.documentElement.style.setProperty("--accent", hex);
  document.documentElement.style.setProperty("--accent-soft", mixWithWhite(hex));
  document.getElementById("themeColor").value = hex;
  document.getElementById("themeHex").value = hex.toUpperCase();
}

function fillEditor() {
  document.querySelectorAll("[data-key]").forEach(el => {
    el.value = state[el.dataset.key] ?? "";
  });
  applyTheme(state.theme || defaults.theme);
}

function render() {
  Object.entries(previewMap).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = state[key] || " ";
  });

  document.getElementById("aArrowTitle").textContent =
    `${state.aName || "A"} → ${state.bName || "B"}`;
  document.getElementById("bArrowTitle").textContent =
    `${state.bName || "B"} → ${state.aName || "A"}`;

  applyTheme(state.theme || defaults.theme);
}

document.querySelectorAll("[data-key]").forEach(el => {
  el.addEventListener("input", () => {
    state[el.dataset.key] = el.value;
    saveState();
    render();
  });
});

document.getElementById("themeColor").addEventListener("input", e => {
  state.theme = e.target.value;
  saveState();
  applyTheme(state.theme);
});

document.getElementById("themeHex").addEventListener("input", e => {
  let value = e.target.value.trim();
  if (!value.startsWith("#")) value = "#" + value;
  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    state.theme = value;
    saveState();
    applyTheme(value);
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("입력한 내용을 모두 초기화할까요?")) return;
  state = { ...defaults };
  saveState();
  fillEditor();
  render();
});

document.getElementById("saveJsonBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  downloadBlob(blob, safeFileName(`${state.pair || "페어"}_자료.json`));
});

document.getElementById("loadJsonInput").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    state = { ...defaults, ...parsed };
    saveState();
    fillEditor();
    render();
  } catch {
    alert("JSON 파일을 읽지 못했습니다.");
  }
  event.target.value = "";
});

document.getElementById("downloadPngBtn").addEventListener("click", async () => {
  const target = document.getElementById("captureArea");
  const button = document.getElementById("downloadPngBtn");
  const original = button.textContent;
  button.textContent = "이미지 만드는 중";
  button.disabled = true;

  try {
    const canvas = await html2canvas(target, {
      scale: 2,
      backgroundColor: "#fbfbfa",
      useCORS: true
    });
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, safeFileName(`${state.pair || "페어"}_핵심요약.png`));
    }, "image/png");
  } finally {
    button.textContent = original;
    button.disabled = false;
  }
});

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function safeFileName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_");
}

fillEditor();
render();
