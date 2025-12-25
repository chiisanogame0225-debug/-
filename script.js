const songs = [];

const songList = document.getElementById("songList");
const addSongButton = document.getElementById("addSongButton");
const sortAiueoButton = document.getElementById("sortAiueoButton");
const addSongForm = document.getElementById("addSongForm");
const overlay = document.getElementById("overlay");
const songForm = document.getElementById("songForm");
const closeButton = document.getElementById("closeButton");

/* ポップアップ表示 */
addSongButton.addEventListener("click", () => {
  addSongForm.style.display = "block";
  overlay.style.display = "block";
});

/* ポップアップ閉じる */
function closePopup() {
  addSongForm.style.display = "none";
  overlay.style.display = "none";
}

closeButton.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);

/* 曲追加 */
songForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const song = {
    title: songForm.title.value,
    artist: songForm.artist.value,
    furigana: songForm.furigana.value,
    url: songForm.url.value
  };

  songs.push(song);
  render();

  songForm.reset();
  closePopup();
});

/* あいうえお順ソート（振り仮名使用・非表示） */
sortAiueoButton.addEventListener("click", () => {
  songs.sort((a, b) => a.furigana.localeCompare(b.furigana, "ja"));
  render();
});

/* 描画 */
function render() {
  songList.innerHTML = "";

  songs.forEach(song => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${song.artist}</td>
      <td>${song.title}</td>
      <td>${song.url ? `<a href="${song.url}" target="_blank">リンク</a>` : ""}</td>
    `;
    songList.appendChild(tr);
  });
}
