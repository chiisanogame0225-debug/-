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
