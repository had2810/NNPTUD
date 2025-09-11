async function loadData() {
  let data = await fetch("http://localhost:3000/posts");
  let posts = await data.json();
  for (const post of posts) {
    body.innerHTML += convertDataToHTML(post);
  }
}

function convertDataToHTML(post) {
  return `
    <tr>
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td>${post.views}</td>
      <td>
        <button onclick="deleteData(${post.id})">Delete</button>
      </td>
    </tr>
  `;
}
 
async function saveData() {
  let id = document.getElementById("id").value;
  let title = document.getElementById("title").value;
  let views = document.getElementById("view").value;

  let dataobj = { id: id, title: title, views: views };

  // kiểm tra id có tồn tại trong db không
  fetch(`http://localhost:3000/posts/${id}`)
    .then((res) => {
      if (res.ok) {
        // Nếu tồn tại -> update (PUT)
        return fetch(`http://localhost:3000/posts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataobj),
        });
      } else {
        // Nếu chưa tồn tại -> tạo mới (POST)
        return fetch("http://localhost:3000/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataobj),
        });
      }
    })
    .then((res) => res.json())
    .then(() => {
      loadData(); // refresh bảng
      clearForm(); // clear input sau khi save
    });
}

function deleteData(id) {
  fetch(`http://localhost:3000/posts/${id}`, {
    method: "DELETE",
  }).then(() => {
    loadData();
  });
}

function clearForm() {
  document.getElementById("id").value = "";
  document.getElementById("title").value = "";
  document.getElementById("view").value = "";
}
