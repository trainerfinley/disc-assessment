// ---------------------------
// Adjective sets (from PDF)
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

// ---------------------------
// Build the radio-button grids
// ---------------------------
const form = document.getElementById("discForm");

questions.forEach((set, i) => {
  const block = document.createElement("div");
  block.innerHTML = `
    <div class="question-title">Question ${i+1}</div>
    <table>
      <tr>
        <th>Adjective</th>
        <th>1</th><th>2</th><th>3</th><th>4</th>
      </tr>
      ${set.map((word, r) => `
        <tr>
          <td>${word}</td>
          ${[1,2,3,4].map(rank => `
            <td><input type="radio" name="q${i}_r${r}" value="${rank}"></td>
          `).join("")}
        </tr>
      `).join("")}
    </table>
  `;
  form.appendChild(block);
});

// Add submit button
const submitBtn = document.createElement("button");
submitBtn.type = "button";
submitBtn.textContent = "Submit";
submitBtn.onclick = scoreDISC;
form.appendChild(submitBtn);

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

  for (let q=0; q<10; q++) {
    let ranksUsed = [];

    for (let r=0; r<4; r++) {
      const radios = document.querySelectorAll(`input[name="q${q}_r${r}"]`);
      const checked = [...radios].find(x => x.checked);

      if (!checked) {
        alert(`Please complete all rankings in Question ${q+1}.`);
        return;
      }

      const rank = checked.value;
      if (ranksUsed.includes(rank)) {
        alert(`Each rank (1–4) must be used once in Question ${q+1}.`);
        return;
      }
      ranksUsed.push(rank);

      const adjective = questions[q][r];
      const category = mapping[adjective];

      if (category === "D") D += Number(rank);
      if (category === "I") I += Number(rank);
      if (category === "S") S += Number(rank);
      if (category === "C") C += Number(rank);
    }
  }

  const totals = {D,I,S,C};
  const primary = Object.entries(totals).sort((a,b)=>a[1]-b[1])[0][0];

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
}

// ---------------------------
// Retake function
// ---------------------------
function retake() {
  const results = document.getElementById("results");

  // Clear all radio buttons
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(r => r.checked = false);

  // Hide results
  results.style.display = "none";
  results.innerHTML = "";

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}
