function showPage(page) {
  document.getElementById('loginPage').style.display   = 'none';
  document.getElementById('facultyPage').style.display = 'none';
  document.getElementById('studentPage').style.display = 'none';
  document.getElementById(page).style.display = 'block';
}

window.onload = function () {
  const role = localStorage.getItem('role');
  if (role === 'faculty')  { showPage('facultyPage'); loadSubmissions(); }
  else if (role === 'student') { showPage('studentPage'); loadMySubmissions(); }
  else showPage('loginPage');
};

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role     = document.getElementById('role').value;

  const res  = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role })
  });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem('role', data.role);
    localStorage.setItem('username', data.username);
    if (data.role === 'faculty') { showPage('facultyPage'); loadSubmissions(); }
    else { showPage('studentPage'); loadMySubmissions(); }
  } else {
    document.getElementById('loginMsg').innerText = 'Invalid credentials!';
  }
}

async function createAssignment() {
  const body = {
    title:       document.getElementById('title').value,
    course:      document.getElementById('course').value,
    due_date:    document.getElementById('due_date').value,
    description: document.getElementById('description').value
  };
  const res  = await fetch('http://localhost:3000/assignment/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  document.getElementById('createMsg').innerText = data.message;
}

async function loadSubmissions() {
  const res  = await fetch('http://localhost:3000/submissions');
  const data = await res.json();
  const tbody = document.getElementById('submissionsTable');
  tbody.innerHTML = '';
  data.forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td>${s.student_name}</td>
        <td>${s.assignment_title}</td>
        <td>${s.answer}</td>
        <td>${s.submission_date}</td>
        <td>${s.status}</td>
        <td>${s.marks !== null ? s.marks : '-'}</td>
        <td><input type="number" id="marks_${s._id}" placeholder="Marks" style="width:60px" />
        <button onclick="assignMarks('${s._id}')">Assign</button></td>
      </tr>`;
  });
}

async function loadAssignments() {
  const res  = await fetch('http://localhost:3000/assignments');
  const data = await res.json();
  const tbody  = document.getElementById('assignmentsTable');
  const select = document.getElementById('assignment_title');
  tbody.innerHTML  = '';
  select.innerHTML = '<option value="">-- Select Assignment --</option>';
  data.forEach(a => {
    tbody.innerHTML  += `<tr><td>${a.title}</td><td>${a.course}</td><td>${a.due_date}</td><td>${a.description}</td></tr>`;
    select.innerHTML += `<option value="${a.title}">${a.title}</option>`;
  });
}

async function submitAssignment() {
  const body = {
    student_name:     localStorage.getItem('username'),
    assignment_title: document.getElementById('assignment_title').value,
    answer:           document.getElementById('answer').value
  };
  const res  = await fetch('http://localhost:3000/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  document.getElementById('submitMsg').innerText = data.message;
  loadMySubmissions();
}

function logout() {
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  showPage('loginPage');
}

async function assignMarks(id) {
  const marks = document.getElementById('marks_' + id).value;
  if (!marks) return;
  const res = await fetch('http://localhost:3000/submission/marks', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, marks: Number(marks) })
  });
  const data = await res.json();
  if (data.success) loadSubmissions();
}

async function loadMySubmissions() {
  const res  = await fetch('http://localhost:3000/submissions');
  const all  = await res.json();
  const name = localStorage.getItem('username');
  const data = all.filter(s => s.student_name === name);
  const tbody = document.getElementById('myTable');
  tbody.innerHTML = '';
  data.forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td>${s.assignment_title}</td>
        <td>${s.submission_date}</td>
        <td>${s.status}</td>
        <td>${s.marks !== null ? s.marks : 'Pending'}</td>
      </tr>`;
  });
}
