const songs = [];

const addSongButton = document.getElementById("addSongButton");
const sortAiueoButton = document.getElementById("sortAiueoButton");
const addSongForm = document.getElementById("addSongForm");
const overlay = document.getElementById("overlay");
const songForm = document.getElementById("songForm");
const closeButton = document.getElementById("closeButton");

let lastArtist = ''; // 最後に追加したアーティスト名
let currentList = 1; // 現在のテーブル番号 (1 または 2)

// ポップアップを開く
addSongButton.addEventListener("click", () => {
  addSongForm.style.display = "block";
  overlay.style.display = "block";
});

// ポップアップを閉じる
function closePopup() {
  addSongForm.style.display = "none";
  overlay.style.display = "none";
}

closeButton.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);

// 曲を追加する
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

// あいうえお順に並び替える
sortAiueoButton.addEventListener("click", () => {
  songs.sort((a, b) => a.furigana.localeCompare(b.furigana, "ja"));
  render();
});

// 2つのテーブルに分けて表示する
function render() {
  const list1 = document.getElementById("songList1");
  const list2 = document.getElementById("songList2");
  list1.innerHTML = "";
  list2.innerHTML = "";

  lastArtist = ''; // レンダリングのたびにリセット
  currentList = 1; // 初期テーブルは list1

  songs.forEach((song, index) => {
    const tr = document.createElement("tr");
    const artistName = (song.artist === lastArtist) ? '' : song.artist;

    tr.innerHTML = `
      <td>${artistName}</td>
      <td><a href="${song.url}" target="_blank">${song.title}</a></td>
    `;

    // アーティスト名が同じ場合は同じテーブルに追加
    if (song.artist === lastArtist || lastArtist === '') {
      if (currentList === 1) {
        list1.appendChild(tr);
      } else {
        list2.appendChild(tr);
      }
    } else {
      // アーティスト名が異なる場合はテーブルを切り替える
      lastArtist = song.artist;
      currentList = (currentList === 1) ? 2 : 1;
      if (currentList === 1) {
        list1.appendChild(tr);
      } else {
        list2.appendChild(tr);
      }
    }
  });
}
