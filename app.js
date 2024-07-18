const apiUrl = 'http://localhost:3000/students';
const studentList = document.getElementById('student-list');
const studentForm = document.getElementById('student-form');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const courseInput = document.getElementById('course');

const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const updateForm = document.getElementById('update-form');
const updateNameInput = document.getElementById('update-name');
const updateAgeInput = document.getElementById('update-age');
const updateCourseInput = document.getElementById('update-course');

let currentStudentId = null;

function fetchStudents() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(students => displayStudents(students));
}

function displayStudents(students) {
  studentList.innerHTML = '';
  students.forEach(student => {
    const li = document.createElement('li');
    li.textContent = `${student.name} - ${student.age} - ${student.course}`;
    li.dataset.id = student.id;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit';
    editButton.onclick = () => openUpdateModal(student);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.onclick = () => deleteStudent(student.id);

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    studentList.appendChild(li);
  });
}

function addStudent(name, age, course) {
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, age, course })
  })
    .then(response => response.json())
    .then(() => fetchStudents());
}

function deleteStudent(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
    .then(() => fetchStudents());
}

function updateStudent(id, name, age, course) {
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, age, course })
  })
    .then(() => fetchStudents());
}

function openUpdateModal(student) {
  modal.style.display = 'block';
  updateNameInput.value = student.name;
  updateAgeInput.value = student.age;
  updateCourseInput.value = student.course;
  currentStudentId = student.id;
}

closeModal.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

studentForm.onsubmit = (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const age = ageInput.value.trim();
  const course = courseInput.value.trim();

  if (name && age && course) {
    addStudent(name, age, course);
    nameInput.value = '';
    ageInput.value = '';
    courseInput.value = '';
  }
};

updateForm.onsubmit = (e) => {
  e.preventDefault();
  const name = updateNameInput.value.trim();
  const age = updateAgeInput.value.trim();
  const course = updateCourseInput.value.trim();

  if (name && age && course) {
    updateStudent(currentStudentId, name, age, course);
    modal.style.display = 'none';
  }
};

fetchStudents();
