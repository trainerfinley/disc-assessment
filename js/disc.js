// ---------------------------
// Adjective sets
// ---------------------------
const questions = [
  ["Enthusiastic","Bold","Conscientious","Friendly"],
  ["Logical","Attractive","Good-natured","Outspoken"],
  ["Agreeable","Outgoing","Daring","Careful"],
  ["Strong-willed","Tactful","Sympathetic","Charming"],
  ["Gentle","Well-disciplined","Talkative","Pioneering"],
  ["Competitive","Even-tempered","Good Mixer","Thorough"],
  ["Sociable","Dominant","Controlled","Easygoing"],
  ["Reserved","Appealing","Kind","Direct"],
  ["High-spirited","Amiable","Vigorous","Accurate"],
  ["Restless","Expressive","Diplomatic","Considerate"]
];

const form = document.getElementById("discForm");

// Track selected ranks: selectedRanks[q][r] = 1–4
const selectedRanks = Array.from({length: 10}, () => [null, null, null, null]);

// ---------------------------
// Build question blocks
// ---------------------------
questions.forEach((set, i) => {
  const block = document.createElement("div");
  block.className = "question-block";
  block.dataset.index = i;

  block.innerHTML = `
    <div class="question-title">Question ${i+1} of 10</div>

    ${set.map((word, r) => `
      <div class="rank-row">
        <div class="rank-label">${word}</div>
        <div class="rank-buttons" data-q="${i}" data-r="${r}">
          <button type="button" onclick="selectRank(${i},${r},1)">1</button>
          <button type="button" onclick="selectRank(${i},${r},2)">2</button>
          <button type="button" onclick="selectRank(${i},${r},3)">3</button>
          <button type="button" onclick="selectRank(${i},${r},4)">4</button>
        </div>
      </div>
    `).join("")}

    <div class="nav-buttons">
      ${i > 0 ? `<button type="button" onclick="prevQuestion()">Back</button>` : `<span></span>`}
      ${i < 9 ? `<button type="button" onclick="nextQuestion()">Next</button>` : `<button type="button" onclick="scoreDISC()">Submit</button>`}
    </div>
  `;

  form.appendChild(block);
});

// ---------------------------
// Rank selection logic
// ---------------------------
function selectRank(q, r, value) {
  selectedRanks[q][r] = value;

  const row = document.querySelector(`.rank-buttons[data-q="${q}"][data-r="${r}"]`);
  const buttons = row.querySelectorAll("button");

  buttons.forEach(btn => {
    const v = Number(btn.textContent);
    if (v === value) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
    btn.disabled = false; // allow changing selection
  });
}

// ---------------------------
// Navigation logic
// ---------------------------
let currentIndex = 0;
showQuestion(0);

function showQuestion(i) {
  document.querySelectorAll(".question-block").forEach(block => {
    block.classList.remove("active");
  });
  document.querySelector(`.question-block[data-index="${i}"]`).classList.add("active");
}

function nextQuestion() {
  if (!validateQuestion(currentIndex)) return;
  currentIndex++;
  showQuestion(currentIndex);
}

function prevQuestion() {
  currentIndex--;
  showQuestion(currentIndex);
}

function validateQuestion(q) {
  const used = [];
  for (let r = 0; r < 4; r++) {
    const val = selectedRanks[q][r];
    if (!val) {
      alert(`Please complete all rankings in Question ${q+1}.`);
      return false;
    }
    if (used.includes(val)) {
      alert(`Each rank (1–4) must be used once in Question ${q+1}.`);
      return false;
    }
    used.push(val);
  }
  return true;
}

// ---------------------------
// DISC mapping
// ---------------------------
const mapping = {
  "Bold":"D","Outspoken":"D","Daring":"D","Strong-willed":"D","Pioneering":"D",
  "Competitive":"D","Dominant":"D","Direct":"D","Vigorous":"D","Restless":"D",

  "Enthusiastic":"I","Attractive":"I","Outgoing":"I","Charming":"I","Talkative":"I",
  "Good Mixer":"I","Sociable":"I","Appealing":"I","High-spirited":"I","Expressive":"I",

  "Good-natured":"S","Agreeable":"S","Sympathetic":"S","Gentle":"S","Even-tempered":"S",
  "Controlled":"S","Kind":"S","Amiable":"S","Diplomatic":"S","Considerate":"S",

  "Conscientious":"C","Logical":"C","Careful":"C","Tactful":"C","Well-disciplined":"C",
  "Thorough":"C","Easygoing":"C","Reserved":"C","Accurate":"C"
};

// ---------------------------
// Scoring function
// ---------------------------
function scoreDISC() {
  const results = document.getElementById("results");

  let D=0, I=0, S=0, C=0;

  for (let q = 0; q < 10; q++) {
    for (let r = 0; r < 4; r++) {
      const rank = selectedRanks[q][r];
      const adjective = questions[q][r];
      const category = mapping[adjective];

      if (category === "D") D += rank;
      if (category === "I") I += rank;
      if (category === "S") S += rank;
      if (category === "C") C += rank;
    }
  }

  const totals = {D,I,S,C};
  const primary = Object.entries(totals).sort((a,b)=>b[1]-a[1])[0][0];

  results.style.display = "block";
  results.innerHTML = `
    <h2>Your DISC Results</h2>
    <p><strong>D:</strong> ${D}</p>
    <p><strong>I:</strong> ${I}</p>
    <p><strong>S:</strong> ${S}</p>
    <p><strong>C:</strong> ${C}</p>
    <h3>Primary Type: ${primary}</h3>
    <button onclick="retake()" style="margin-top:20px;">Retake Assessment</button>
  `;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------------------------
// Retake function
// ---------------------------
function retake() {
  const results = document.getElementById("results");

  // Reset selections
  selectedRanks.forEach((row, q) => {
    row.forEach((_, r) => selectedRanks[q][r] = null);
  });

  // Reset buttons
  document.querySelectorAll(".rank-buttons button").forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("selected");
  });

  results.style.display = "none";
  results.innerHTML = "";

  currentIndex = 0;
  showQuestion(0);

  window.scrollTo({ top: 0, behavior: "smooth" });
}
