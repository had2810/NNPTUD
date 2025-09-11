async function loadData() {
  let data = await fetch("http://localhost:3000/posts");
  let posts = await data.json();

  // Lọc bỏ những post có isDelete = true
  body.innerHTML = "";
  for (const post of posts) {
    if (!post.isDelete) {
      body.innerHTML += convertDataToHTML(post);
    }
  }
}

function convertDataToHTML(post) {
  return `
    <tr>
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td>${post.views}</td>
      <td>
        <button onclick="deleteData('${post.id}')">Delete</button>
      </td>
    </tr>
  `;
}

async function saveData() {
  let id = document.getElementById("id").value.trim();
  let title = document.getElementById("title").value.trim();
  let views = document.getElementById("view").value.trim();

  if (id) {
    // Nếu nhập id -> kiểm tra trong DB
    let res = await fetch(`http://localhost:3000/posts/${id}`);
    if (res.ok) {
      // Lấy dữ liệu cũ để giữ lại isDelete
      let oldPost = await res.json();
      await fetch(`http://localhost:3000/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...oldPost, // giữ lại isDelete
          title,
          views,
        }),
      });
    } else {
      alert("ID chưa tồn tại, không thể update!");
      return;
    }
  } else {
    // Nếu không nhập id -> tự động tạo mới với maxId + 1
    await createNewPost(title, views);
  }

  await loadData();
  clearForm();
}

// Hàm tạo mới với id = max + 1
async function createNewPost(title, views) {
  let res = await fetch("http://localhost:3000/posts");
  let posts = await res.json();

  // tìm id lớn nhất (convert sang số để tính toán)
  let maxId =
    posts.length > 0 ? Math.max(...posts.map((p) => parseInt(p.id))) : 0;

  let newPost = {
    id: String(maxId + 1), // ép kiểu sang chuỗi
    title: title,
    views: views,
    isDelete: false, // mặc định chưa xoá
  };

  await fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  });
}

// Đổi Delete thành PUT isDelete = true
async function deleteData(id) {
  let res = await fetch(`http://localhost:3000/posts/${id}`);
  if (!res.ok) return;

  let post = await res.json();

  await fetch(`http://localhost:3000/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...post, isDelete: true }),
  });

  await loadData();
}

function clearForm() {
  document.getElementById("id").value = "";
  document.getElementById("title").value = "";
  document.getElementById("view").value = "";
}
