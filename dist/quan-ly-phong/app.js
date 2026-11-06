const views = document.querySelectorAll('.view');
const navs = document.querySelectorAll('.nav');
const pageMeta = {
  overview: ['Tổng quan vận hành', 'TỔNG QUAN'], rooms: ['Danh sách phòng', 'QUẢN LÝ PHÒNG'],
  schedule: ['Lịch sử dụng phòng', 'LỊCH SỬ DỤNG'], requests: ['Yêu cầu đặt phòng', 'YÊU CẦU'],
  handover: ['Bàn giao & thu hồi', 'BÀN GIAO'], equipment: ['Kho thiết bị', 'THIẾT BỊ'],
  incidents: ['Quản lý sự cố', 'SỰ CỐ']
};

function showView(id) {
  views.forEach(view => view.classList.toggle('active', view.id === id));
  navs.forEach(nav => nav.classList.toggle('active', nav.dataset.view === id));
  document.getElementById('title').textContent = pageMeta[id][0];
  document.getElementById('crumb').textContent = `VLU SPACE / ${pageMeta[id][1]}`;
  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
navs.forEach(nav => nav.addEventListener('click', () => showView(nav.dataset.view)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));
document.getElementById('menu').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

const toast = document.getElementById('toast');
function showToast(message) {
  document.getElementById('toastText').textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3200);
}
document.querySelectorAll('[data-toast]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.toast)));

function filterRooms() {
  const query = document.getElementById('roomSearch').value.trim().toLowerCase();
  const building = document.getElementById('buildingFilter').value;
  const status = document.getElementById('statusFilter').value;
  let visible = 0;
  document.querySelectorAll('#roomRows tr').forEach(row => {
    const matches = row.textContent.toLowerCase().includes(query) && (building === 'all' || row.dataset.building === building) && (status === 'all' || row.dataset.status === status);
    row.hidden = !matches;
    if (matches) visible += 1;
  });
  document.getElementById('roomCount').textContent = `${visible} phòng`;
}
['roomSearch', 'buildingFilter', 'statusFilter'].forEach(id => document.getElementById(id).addEventListener(id === 'roomSearch' ? 'input' : 'change', filterRooms));

const roomModal = document.getElementById('roomModal');
function closeModal() { roomModal.classList.remove('open'); roomModal.setAttribute('aria-hidden', 'true'); }
document.getElementById('addRoom').addEventListener('click', () => { roomModal.classList.add('open'); roomModal.setAttribute('aria-hidden', 'false'); });
document.querySelectorAll('.close,.close-action').forEach(button => button.addEventListener('click', closeModal));
roomModal.addEventListener('click', event => { if (event.target === roomModal) closeModal(); });
document.getElementById('roomForm').addEventListener('submit', event => { event.preventDefault(); closeModal(); event.target.reset(); showToast('Phòng mới đã được thêm vào danh sách.'); });

document.querySelectorAll('.approve').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.request-card');
  card.querySelector('.tag').className = 'tag free';
  card.querySelector('.tag').textContent = 'Đã duyệt';
  card.querySelector('.actions').innerHTML = '<span class="tag free">Hoàn tất</span>';
  showToast('Yêu cầu đã được duyệt và lịch phòng đã được giữ.');
}));
document.querySelectorAll('.reject').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.request-card');
  card.querySelector('.tag').className = 'tag maintenance';
  card.querySelector('.tag').textContent = 'Từ chối';
  card.querySelector('.actions').innerHTML = '<span class="tag maintenance">Đã xử lý</span>';
  showToast('Đã từ chối yêu cầu và gửi thông báo cho người đặt.');
}));

document.querySelectorAll('.handover-btn,.return-btn').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('article');
  const required = [...card.querySelectorAll('input[type="checkbox"]')];
  if (required.some(input => !input.checked)) { showToast('Vui lòng hoàn thành các bước kiểm tra trước.'); return; }
  const isReturn = button.classList.contains('return-btn');
  card.querySelector('.tag').className = isReturn ? 'tag free' : 'tag using';
  card.querySelector('.tag').textContent = isReturn ? 'Đã thu hồi' : 'Đã bàn giao';
  button.disabled = true;
  button.textContent = 'Đã hoàn tất';
  showToast(isReturn ? 'Đã thu hồi phòng và cập nhật trạng thái trống.' : 'Đã bàn giao phòng cho người sử dụng.');
}));

document.querySelectorAll('.assign').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('article');
  const status = card.querySelector('.tag');
  status.className = 'tag using';
  status.textContent = 'Đang xử lý';
  button.textContent = 'Đã giao';
  button.disabled = true;
  showToast('Sự cố đã được giao cho đội kỹ thuật.');
}));
document.getElementById('adjustStock').addEventListener('click', () => showToast('Đã mở chức năng kiểm kê và điều chỉnh tồn kho.'));
document.querySelectorAll('.tabs button').forEach(button => button.addEventListener('click', () => {
  button.parentElement.querySelectorAll('button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
}));
