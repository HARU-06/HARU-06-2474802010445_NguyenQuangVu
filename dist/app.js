const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item');
const titles = {
  dashboard: ['Chào buổi sáng, thầy Hiếu!', 'TỔNG QUAN'],
  rooms: ['Tìm & đặt phòng', 'TÌM PHÒNG'],
  requests: ['Yêu cầu của tôi', 'YÊU CẦU'],
  equipment: ['Mượn thiết bị', 'THIẾT BỊ'],
  incidents: ['Báo cáo sự cố', 'SỰ CỐ'],
  handover: ['Xác nhận nhường lịch', 'NHƯỜNG KHUNG GIỜ']
};

function showView(id) {
  views.forEach(v => v.classList.toggle('active', v.id === id));
  navItems.forEach(n => n.classList.toggle('active', n.dataset.view === id));
  document.getElementById('pageTitle').textContent = titles[id][0];
  document.getElementById('breadcrumb').textContent = `VLU SPACE / ${titles[id][1]}`;
  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => item.addEventListener('click', () => showView(item.dataset.view)));
document.querySelectorAll('[data-go]').forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.go)));
document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  });
}
document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModals));
document.querySelectorAll('.modal-backdrop').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModals(); }));

document.querySelectorAll('.book-btn').forEach(btn => btn.addEventListener('click', () => {
  document.getElementById('modalRoom').textContent = btn.dataset.room;
  document.getElementById('roomInput').value = btn.dataset.room;
  openModal('bookingModal');
}));

function showToast(text) {
  const toast = document.getElementById('toast');
  document.getElementById('toastText').textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3300);
}

document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault(); closeModals(); showToast('Yêu cầu đặt phòng đã được gửi.');
});
document.getElementById('roomFilter').addEventListener('submit', e => {
  e.preventDefault(); document.getElementById('roomGrid').scrollIntoView({ behavior: 'smooth' }); showToast('Đã tìm thấy 6 phòng phù hợp.');
});
document.getElementById('incidentForm').addEventListener('submit', e => {
  e.preventDefault(); e.target.reset(); showToast('Báo cáo sự cố đã được gửi đến Phòng CSVC.');
});

document.querySelectorAll('.stepper').forEach(stepper => {
  const value = stepper.querySelector('b');
  const [minus, plus] = stepper.querySelectorAll('button');
  const stock = Number(stepper.dataset.stock);
  const equipmentName = stepper.dataset.name;

  const updateButtons = () => {
    const quantity = Number(value.textContent);
    minus.disabled = quantity === 0;
    plus.disabled = quantity >= stock;
  };

  minus.addEventListener('click', () => {
    value.textContent = Math.max(0, Number(value.textContent) - 1);
    updateButtons();
  });
  plus.addEventListener('click', () => {
    const current = Number(value.textContent);
    if (current >= stock) {
      showToast(`${equipmentName} chỉ còn ${stock} thiết bị.`);
      return;
    }
    value.textContent = current + 1;
    updateButtons();
  });
  updateButtons();
});
document.getElementById('createEquipment').addEventListener('click', () => {
  const steppers = [...document.querySelectorAll('.stepper')];
  const invalid = steppers.find(stepper => Number(stepper.querySelector('b').textContent) > Number(stepper.dataset.stock));
  if (invalid) {
    showToast(`${invalid.dataset.name} vượt quá số lượng còn lại.`);
    return;
  }
  const total = steppers.reduce((sum, stepper) => sum + Number(stepper.querySelector('b').textContent), 0);
  showToast(total ? `Đã tạo phiếu mượn với ${total} thiết bị.` : 'Vui lòng chọn ít nhất một thiết bị.');
});

let activeHandover = null;
document.querySelectorAll('.accept-btn').forEach(btn => btn.addEventListener('click', () => {
  activeHandover = btn.closest('.handover-card');
  const name = activeHandover.querySelector('h3').childNodes[0].textContent.trim();
  const details = [...activeHandover.querySelectorAll('.time-strip b')].map(el => el.textContent);
  document.getElementById('confirmSummary').innerHTML = `<b>${name}</b><br>${details[0]} · ${details[1]} · ${details[2]}`;
  openModal('confirmModal');
}));
document.getElementById('confirmHandover').addEventListener('click', () => {
  if (!activeHandover) return;
  activeHandover.querySelector('.status').className = 'status green';
  activeHandover.querySelector('.status').textContent = 'Đã nhường';
  activeHandover.querySelector('.handover-actions').innerHTML = '<span class="status green">Hoàn tất</span>';
  closeModals(); showToast('Khung giờ đã được chuyển thành công.'); activeHandover = null;
});
document.querySelectorAll('.reject-btn').forEach(btn => btn.addEventListener('click', () => {
  const card = btn.closest('.handover-card');
  card.querySelector('.status').className = 'status red';
  card.querySelector('.status').textContent = 'Đã từ chối';
  card.querySelector('.handover-actions').innerHTML = '<span class="status red">Đã xử lý</span>';
  showToast('Đã từ chối yêu cầu, lịch của thầy được giữ nguyên.');
}));

document.querySelectorAll('.tabs button').forEach(btn => btn.addEventListener('click', () => {
  btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}));
