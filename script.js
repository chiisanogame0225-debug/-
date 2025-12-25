const songs = [];

const addSongButton = document.getElementById("addSongButton");
const sortAiueoButton = document.getElementById("sortAiueoButton");
const addSongForm = document.getElementById("addSongForm");
const overlay = document.getElementById("overlay");
const songForm = document.getElementById("songForm");
const closeButton = document.getElementById("closeButton");

let lastArtist = ''; // 最後に追加したアーティスト名

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

  songs.forEach((song, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${song.artist}</td>
      <td><a href="${song.url}" target="_blank">${song.title}</a></td>
    `;

    // 同じアーティスト名の場合は同じテーブルに追加
    if (song.artist === lastArtist) {
      if (index % 2 === 0) {
        list1.appendChild(tr);
      } else {
        list2.appendChild(tr);
      }
    } else {
      // 新しいアーティスト名の場合はテーブルをリセット
      lastArtist = song.artist;
      if (index % 2 === 0) {
        list1.appendChild(tr);
      } else {
        list2.appendChild(tr);
      }
    }
  });
}
