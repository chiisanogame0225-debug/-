// ====== 設定 ======
const STORAGE_KEY = "karaokeSongs";

// ====== DOM取得 ======
const addSongButton = document.getElementById("addSongButton");
const sortAiueoButton = document.getElementById("sortAiueoButton");

const overlay = document.getElementById("overlay");
const addSongForm = document.getElementById("addSongForm");
const songForm = document.getElementById("songForm");
const closeButton = document.getElementById("closeButton");

const songList1 = document.getElementById("songList1");
const songList2 = document.getElementById("songList2");

// ====== データ ======
function loadSongs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSongs(songs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
}

// ====== UI（ポップアップ） ======
function openForm() {
  overlay.style.display = "block";
  addSongForm.style.display = "block";
}

function closeForm() {
  overlay.style.display = "none";
  addSongForm.style.display = "none";
  songForm.reset();
}

// ====== グループ化（同じアーティスト名はまとめる） ======
function groupByArtist(songs) {
  // key は artist で統一（同名なら必ず同じグループ）
  const map = new Map();

  for (const s of songs) {
    const artist = (s.artist || "").trim();
    const furigana = (s.furigana || "").trim();
    const title = (s.title || "").trim();
    const url = (s.url || "").trim();

    if (!artist || !title) continue;

    if (!map.has(artist)) {
      map.set(artist, { artist, furigana, songs: [] });
    }
    const g = map.get(artist);

    // furigana が空なら後から入ってきた値で補完（ある方を優先）
    if (!g.furigana && furigana) g.furigana = furigana;

    g.songs.push({ title, url });
  }

  return Array.from(map.values());
}

// ====== あいうえお順（ふりがな優先、無ければ artist） ======
function sortGroupsAiueo(groups) {
  groups.sort((a, b) => {
    const ak = (a.furigana || a.artist).toLowerCase();
    const bk = (b.furigana || b.artist).toLowerCase();
    return ak.localeCompare(bk, "ja");
  });
  // 曲名も一応並べたいならここでソート（不要なら消してOK）
  groups.forEach(g => {
    g.songs.sort((x, y) => x.title.localeCompare(y.title, "ja"));
  });
  return groups;
}

// ====== 2列に振り分け（グループ単位で、行数が均等になるように） ======
function splitIntoTwoColumns(groups) {
  const left = [];
  const right = [];
  let leftRows = 0;
  let rightRows = 0;

  for (const g of groups) {
    const rows = g.songs.length;
    if (leftRows <= rightRows) {
      left.push(g);
      leftRows += rows;
    } else {
      right.push(g);
      rightRows += rows;
    }
  }
  return { left, right };
}

// ====== テーブル描画（rowspanでアーティスト名を1回だけ表示） ======
function renderTable(tbody, groups) {
  tbody.innerHTML = "";

  for (const g of groups) {
    const rowSpan = g.songs.length;

    g.songs.forEach((song, index) => {
      const tr = document.createElement("tr");

      // 最初の1行だけ artist セルを作る（ここがポイント）
      if (index === 0) {
        const tdArtist = document.createElement("td");
        tdArtist.textContent = g.artist;
        tdArtist.rowSpan = rowSpan;
        tr.appendChild(tdArtist);
      }

      const tdTitle = document.createElement("td");
      if (song.url) {
        const a = document.createElement("a");
        a.href = song.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = song.title;
        tdTitle.appendChild(a);
      } else {
        tdTitle.textContent = song.title;
      }

      tr.appendChild(tdTitle);
      tbody.appendChild(tr);
    });
  }
}

// ====== 全体描画 ======
function renderAll() {
  const songs = loadSongs();
  const groups = sortGroupsAiueo(groupByArtist(songs));
  const { left, right } = splitIntoTwoColumns(groups);

  renderTable(songList1, left);
  renderTable(songList2, right);
}

// ====== イベント ======
addSongButton.addEventListener("click", openForm);
overlay.addEventListener("click", closeForm);
closeButton.addEventListener("click", closeForm);

songForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fd = new FormData(songForm);
  const newSong = {
    title: fd.get("title")?.toString() ?? "",
    artist: fd.get("artist")?.toString() ?? "",
    furigana: fd.get("furigana")?.toString() ?? "",
    url: fd.get("url")?.toString() ?? ""
  };

  const songs = loadSongs();
  songs.push(newSong);
  saveSongs(songs);

  closeForm();
  renderAll();
});

sortAiueoButton.addEventListener("click", () => {
  // ここは “並び替えボタンを押したら再描画” でOK（常にふりがな順に描画される）
  renderAll();
});

// 初期描画
document.addEventListener("DOMContentLoaded", renderAll);
