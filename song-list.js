const songs = [
  {
    title: "チェリー",
    artist: "スピッツ",
    furigana: "スピッツ",
    url: "https://example.com/cherry"
  },
  {
    title: "残酷な天使のテーゼ",
    artist: "高橋洋子",
    furigana: "たかはしようこ",
    url: "https://example.com/evangelion"
  }
];

const list = document.getElementById("songList");
// 追加ボタンを押したときにフォームを表示
document.getElementById('addSongButton').addEventListener('click', function() {
  var form = document.getElementById('addSongForm');
  form.style.display = 'block';
});

// フォーム送信時に曲を追加
document.getElementById('songForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const newSong = {
    title: this.title.value,
    artist: this.artist.value,
    furigana: this.furigana.value,
    url: this.url.value
  };

  songs.push(newSong);
  render();
  
  // フォームをリセットして非表示にする
  this.reset();
  document.getElementById('addSongForm').style.display = 'none';
});


const sortBy = document.getElementById("sortBy");

function render() {
  list.innerHTML = "";

  const sorted = [...songs].sort((a, b) => {
    const key = sortBy.value;
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });

  sorted.forEach(song => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${song.title}</td>
      <td>${song.artist}</td>
      <td>${song.furigana}</td>
      <td><a href="${song.url}" target="_blank">リンク</a></td>
    `;
    list.appendChild(tr);
  });
}

sortBy.addEventListener("change", render);

render();
