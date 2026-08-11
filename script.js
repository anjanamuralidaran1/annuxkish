const activities = [
  { title: "crime-solving escape room", category: ["go out","brain","kishu"], tags: ["$$","few hours","competitive"] },
  { title: "trampoline park", category: ["go out","kishu"], tags: ["$$","few hours","competitive"] },
  { title: "face pack night", category: ["stay in","annu"], tags: ["$","home","30 min","chill"] },
  { title: "froyo run", category: ["go out","cheap"], tags: ["$","30 min","chill"] },
  { title: "build a blanket fort", category: ["stay in","annu","make"], tags: ["free","home","few hours","chill"] },
  { title: "fake interview each other", category: ["stay in","brain"], tags: ["free","home","30 min","competitive"] },
  { title: "aerospace museum", category: ["go out","kishu"], tags: ["$$","few hours","chill"] },
  { title: "paper airplane competition", category: ["stay in","kishu","make"], tags: ["free","home","30 min","competitive"] },
  { title: "road trip", category: ["go out","kishu"], tags: ["$$","few hours","chill"] },
  { title: "mini golf", category: ["go out"], tags: ["$$","few hours","competitive"] },
  { title: "bowling", category: ["go out"], tags: ["$$","few hours","competitive"] },
  { title: "make a bucket list", category: ["stay in","brain"], tags: ["free","home","few hours","chill"] },
  { title: "board game night", category: ["stay in","brain"], tags: ["$","home","few hours","competitive"] },
  { title: "500-piece puzzle", category: ["stay in","brain"], tags: ["$","home","few hours","chill"] },
  { title: "bake cookies", category: ["stay in","make","annu"], tags: ["$","home","few hours","chill"] },
  { title: "paint each other", category: ["stay in","make","annu"], tags: ["$","home","few hours","chill"] },
  { title: "waterpark", category: ["go out","kishu"], tags: ["$$","few hours"] },
  { title: "museum day", category: ["go out","brain"], tags: ["$$","few hours","chill"] },
  { title: "sightseeing day", category: ["go out"], tags: ["$","few hours","chill"] },
  { title: "work out together", category: ["go out","kishu"], tags: ["$","few hours","competitive"] },
  { title: "spongebob + ben 10 night", category: ["stay in","annu","kishu"], tags: ["free","home","few hours","chill"] },
  { title: "kitkat vs toblerone taste test", category: ["stay in","annu","kishu"], tags: ["$","home","30 min","chill"] },
  { title: "skittles blind taste test", category: ["stay in","kishu"], tags: ["$","home","30 min","competitive"] },
  { title: "stargazing", category: ["go out","cheap","kishu"], tags: ["free","few hours","chill"] },
  { title: "planetarium", category: ["go out","kishu"], tags: ["$$","few hours","chill"] },
  { title: "make terrible powerpoints", category: ["stay in","brain"], tags: ["free","home","few hours","competitive"] },
  { title: "online game night", category: ["stay in","cheap"], tags: ["free","home","few hours","competitive"] },
  { title: "geo guessing game", category: ["stay in","brain"], tags: ["free","home","few hours","competitive"] },
  { title: "late-night drive", category: ["go out","cheap"], tags: ["$","few hours","chill"] },
  { title: "taco bell run", category: ["go out","annu","cheap"], tags: ["$","30 min","chill"] },
  { title: "make bracelets or keychains", category: ["stay in","make","annu"], tags: ["$","home","few hours","chill"] },
  { title: "lego set", category: ["stay in","make","brain"], tags: ["$$","home","few hours","chill"] },
  { title: "go-karts", category: ["go out","kishu"], tags: ["$$","few hours","competitive"] },
  { title: "$10 date challenge", category: ["cheap","go out"], tags: ["$","few hours","competitive"] },
  { title: "no-phone date", category: ["go out","stay in"], tags: ["free","few hours","chill"] },
  { title: "make a time capsule", category: ["stay in","make","annu"], tags: ["$","home","few hours","chill"] },
  { title: "guess the quote", category: ["stay in","brain","annu"], tags: ["free","home","30 min","competitive"] },
  { title: "air show", category: ["go out","kishu"], tags: ["$$","few hours","chill"] },
  { title: "watch planes take off", category: ["go out","cheap","kishu"], tags: ["free","few hours","chill"] },
  { title: "make each other froyo", category: ["go out","annu","kishu"], tags: ["$","30 min","chill"] }
];

let activeCategory = "all";
let activeTags = new Set();
let favorites = new Set(JSON.parse(localStorage.getItem("favorites") || "[]"));
let currentRandom = null;

const grid = document.getElementById("activityGrid");
const resultCount = document.getElementById("resultCount");
const modal = document.getElementById("randomModal");
const randomTitle = document.getElementById("randomTitle");
const randomTags = document.getElementById("randomTags");

function matches(activity) {
  const catMatch = activeCategory === "all" || activity.category.includes(activeCategory);
  const tagMatch = [...activeTags].every(tag => activity.tags.includes(tag));
  return catMatch && tagMatch;
}

function render() {
  const filtered = activities.filter(matches);
  resultCount.textContent = `${filtered.length} ideas`;
  grid.innerHTML = filtered.map((a, index) => {
    const realIndex = activities.indexOf(a);
    const fav = favorites.has(realIndex);
    return `
      <article class="card">
        <div>
          <div class="card-topline">${a.category[0]}</div>
          <h3>${a.title}</h3>
        </div>
        <div>
          <div class="tags">${a.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
          <div class="card-actions">
            <button class="icon-btn ${fav ? "active" : ""}" onclick="toggleFavorite(${realIndex})">${fav ? "♥ saved" : "♡ save"}</button>
            <button class="icon-btn" onclick="showActivity(${realIndex})">pick this</button>
          </div>
        </div>
      </article>`;
  }).join("");
}

window.toggleFavorite = function(index) {
  favorites.has(index) ? favorites.delete(index) : favorites.add(index);
  localStorage.setItem("favorites", JSON.stringify([...favorites]));
  render();
}

window.showActivity = function(index) {
  currentRandom = activities[index];
  randomTitle.textContent = currentRandom.title;
  randomTags.innerHTML = currentRandom.tags.map(t => `<span class="tag">${t}</span>`).join("");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function randomPick() {
  const pool = activities.filter(matches);
  const source = pool.length ? pool : activities;
  const item = source[Math.floor(Math.random() * source.length)];
  showActivity(activities.indexOf(item));
}

document.querySelectorAll("#categoryFilters .chip").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#categoryFilters .chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    render();
  });
});

document.querySelectorAll("#tagFilters .mini-chip").forEach(btn => {
  btn.addEventListener("click", () => {
    const tag = btn.dataset.tag;
    activeTags.has(tag) ? activeTags.delete(tag) : activeTags.add(tag);
    btn.classList.toggle("active");
    render();
  });
});

document.getElementById("clearFilters").addEventListener("click", () => {
  activeCategory = "all";
  activeTags.clear();
  document.querySelectorAll(".chip, .mini-chip").forEach(b => b.classList.remove("active"));
  document.querySelector('[data-category="all"]').classList.add("active");
  render();
});

document.getElementById("surpriseBtn").addEventListener("click", randomPick);
document.getElementById("boredBtn").addEventListener("click", randomPick);
document.getElementById("reroll").addEventListener("click", randomPick);
document.getElementById("closeModal").addEventListener("click", () => modal.classList.remove("show"));
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("show"); });

document.getElementById("acceptMission").addEventListener("click", () => {
  if (!currentRandom) return;
  const idx = activities.indexOf(currentRandom);
  favorites.add(idx);
  localStorage.setItem("favorites", JSON.stringify([...favorites]));
  document.getElementById("acceptMission").textContent = "fine. saved.";
  setTimeout(() => document.getElementById("acceptMission").textContent = "okay fine", 1200);
  render();
});

document.getElementById("favoritesBtn").addEventListener("click", () => {
  const favActivities = activities.filter((_, i) => favorites.has(i));
  grid.innerHTML = favActivities.length ? favActivities.map(a => {
    const i = activities.indexOf(a);
    return `<article class="card"><div><div class="card-topline">saved</div><h3>${a.title}</h3></div><div><div class="tags">${a.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div><div class="card-actions"><button class="icon-btn active" onclick="toggleFavorite(${i})">♥ saved</button><button class="icon-btn" onclick="showActivity(${i})">pick this</button></div></div></article>`;
  }).join("") : `<div class="done-empty">you have saved literally nothing yet.</div>`;
  resultCount.textContent = `${favActivities.length} saved`;
  document.getElementById("resultsTitle").textContent = "our list";
  document.querySelector("main").scrollIntoView({behavior:"smooth"});
});

document.getElementById("hateBtn").addEventListener("click", (e) => {
  e.currentTarget.textContent = "i don't. next question.";
});

render();
