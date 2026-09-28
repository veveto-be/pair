const STORAGE_KEY = "pairSummaryTemplateV1";

const defaults = {
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

function fillEditor() {
  document.querySelectorAll("[data-key]").forEach(el => {
    el.value = state[el.dataset.key] ?? "";
  });
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
}

document.querySelectorAll("[data-key]").forEach(el => {
  el.addEventListener("input", () => {
    state[el.dataset.key] = el.value;
    saveState();
    render();
  });
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
      backgroundColor: "#fbfaf8",
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
