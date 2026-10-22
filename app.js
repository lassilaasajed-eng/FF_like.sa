const STORAGE_KEY = "ff-likes-exchange-demo-v1";
const form = document.getElementById("requestForm");
const body = document.getElementById("requestsBody");
const message = document.getElementById("formMessage");

function loadRequests() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveRequests(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
function render() {
  const items = loadRequests();
  document.getElementById("countRequests").textContent = items.length;
  document.getElementById("profileRequests").textContent = items.length;
  if (!items.length) {
    body.innerHTML = '<tr class="empty"><td colspan="5">ما عندك حتى طلب توّا. جرّب أنشئ طلب من الفورم.</td></tr>';
    return;
  }
  body.innerHTML = "";
  items.slice().reverse().forEach(item => {
    const tr = document.createElement("tr");
    [item.playerId, item.likes, item.offer].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    const status = document.createElement("td");
    status.innerHTML = '<span class="status">محفوظ محلياً</span>';
    tr.appendChild(status);
    const date = document.createElement("td");
    date.textContent = new Date(item.createdAt).toLocaleString("ar-TN");
    tr.appendChild(date);
    body.appendChild(tr);
  });
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const playerId = document.getElementById("playerId").value.trim();
  if (!/^[0-9]{5,20}$/.test(playerId)) {
    message.textContent = "تثبت من Player ID: لازم يكون من 5 إلى 20 رقم.";
    return;
  }
  const items = loadRequests();
  items.push({
    playerId,
    likes: Number(document.getElementById("likes").value),
    offer: Number(document.getElementById("offer").value),
    createdAt: new Date().toISOString()
  });
  saveRequests(items);
  form.reset();
  message.textContent = "تم حفظ الطلب التجريبي في هذا المتصفح فقط.";
  render();
});
document.getElementById("clearRequests").addEventListener("click", () => {
  if (!loadRequests().length) return;
  if (confirm("متأكد تحب تمسح الطلبات المحفوظة على هذا الجهاز؟")) {
    saveRequests([]);
    message.textContent = "تم مسح الطلبات المحلية.";
    render();
  }
});
render();
