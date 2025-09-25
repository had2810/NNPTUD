const API_URL = "http://localhost:3000/posts";

const searchBox = document.getElementById("searchBox");
const suggestions = document.getElementById("suggestions");
const minSlider = document.getElementById("minSlider");
const maxSlider = document.getElementById("maxSlider");
const minVal = document.getElementById("minVal");
const maxVal = document.getElementById("maxVal");
const postList = document.getElementById("postList");
const filterBtn = document.getElementById("filterBtn");

// Render danh sách posts
function renderPosts(posts) {
  postList.innerHTML = "";
  if (posts.length === 0) {
    postList.innerHTML = "<li>Không có dữ liệu</li>";
    return;
  }
  posts.forEach((p) => {
    let li = document.createElement("li");
    li.textContent = `${p.id}. ${p.title} - Views: ${p.views}`;
    postList.appendChild(li);
  });
}

// Load tất cả posts khi mở trang
async function loadPosts() {
  let res = await fetch(API_URL);
  let data = await res.json();

  // Tính min/max views từ data
  let viewsArr = data.map((p) => p.views);
  let minViews = Math.min(...viewsArr);
  let maxViews = Math.max(...viewsArr);

  // Gán lại cho slider
  minSlider.min = minViews;
  minSlider.max = maxViews;
  minSlider.value = minViews;

  maxSlider.min = minViews;
  maxSlider.max = maxViews;
  maxSlider.value = maxViews;

  // Hiển thị text
  minVal.textContent = minViews;
  maxVal.textContent = maxViews;

  // Render list
  renderPosts(data);
}

// Search khi onchange
searchBox.addEventListener("change", async () => {
  let keyword = searchBox.value.trim();
  if (keyword.length === 0) {
    suggestions.innerHTML = "";
    loadPosts(); // nếu để trống thì load lại toàn bộ
    return;
  }

  let res = await fetch(`${API_URL}?title_like=${keyword}`);
  let data = await res.json();
  renderPosts(data);

  // clear gợi ý
  suggestions.innerHTML = "";
});

// Slider hiển thị giá trị
minSlider.addEventListener("input", () => {
  minVal.textContent = minSlider.value;
});
maxSlider.addEventListener("input", () => {
  maxVal.textContent = maxSlider.value;
});

// Lọc theo views
filterBtn.addEventListener("click", async () => {
  let min = minSlider.value;
  let max = maxSlider.value;
  let res = await fetch(`${API_URL}?views_gte=${min}&views_lte=${max}`);
  let data = await res.json();
  renderPosts(data);
});

loadPosts();
