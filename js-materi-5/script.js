console.log('==========================');
console.log('HSI STUDENT MANAGEMENT');
console.log('==========================');

let students = []; // nampung data siswa
// localStorage adalah atribut yang digunakan untuk menyimpan data di browser
// method setItem() digunakan untuk menyimpan data ke localStorage
let editIndex = null;
localStorage.setItem('kelas', 'XI RPL 1');
localStorage.setItem('total_siswa', 9); // akan selalu jadi string

// method getItem() digunakan untuk mengambil data dari localStorage
const kelas = localStorage.getItem('kelas'); // get by key
const totalSiswa = localStorage.getItem('total_siswa'); // akan muncul string
console.log({ kelas, totalSiswa });

const newStudent = {
  name: 'Budi Siregar',
  score: 90
};
const jawaStudent = {
  name: 'Budiono Giatno',
  score: 84
};
students.push(newStudent); // di tambahkan di akhir array
students.push(jawaStudent); // di tambahkan di akhir array

// JSON.stringify() adalah method yang digunakan untuk mengubah string menjadi object
localStorage.setItem('students', JSON.stringify(students));
// JSON.parse() adalah method yang digunakan untuk mengubah string menjadi array/object
// const studentsFromStorage = JSON.parse(localStorage.getItem('students'));
const studentList = document.getElementById("studentList");
const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentScore = document.getElementById("studentScore");
// aksi saat form di submit
studentForm.addEventListener("submit", (e) => {
  e.preventDefault(); // cegah agar form tidak submit
  const studentData = { // jadikan object baru
    name: studentName.value,
    score: studentScore.value
  };
  students.push(studentData); // di tambahkan di akhir array
  // update localStorage
  localStorage.setItem('students', JSON.stringify(students)); 
  // render ulang saat selesai di add
  
  renderStudentList();
});

function renderStudentList() {
  studentList.innerHTML = "";
  if (students.length === 0) {
    studentList.innerHTML = "<div class='empty'>Belum ada data siswa</div>";
  } else {
    for (let i = 0; i < students.length; i++) {
      const student = students[i]; // item siswa per index-nya
      studentList.innerHTML += `
        <div class="student-item">
          <div class="student-name">
            <span class="student-number">${i + 1}.</span>
            ${student.name}
          </div>
          <div class="score">${student.score}</div>
          <div class="action-buttons">
            <button class="edit-btn" type="button" data-index="${i}">✏️ Ubah</button>
            <button class="delete-btn" type="button" data-index="${i}">🗑️ Hapus</button>
          </div>
        </div>
      `; 
    }
  }
}

studentList.addEventListener("click", (e) => {

  // EDIT
  if (e.target.classList.contains("edit-btn")) {

    const index = Number(e.target.dataset.index);

    const student = students[index];

    const newName = prompt("Nama siswa:", student.name);
    const newScore = prompt("Nilai siswa:", student.score);

    if (newName === null || newScore === null) {
      return;
    }

    student.name = newName;
    student.score = newScore;

    localStorage.setItem("students", JSON.stringify(students));

    renderStudentList();
  }


  // DELETE
  if (e.target.classList.contains("delete-btn")) {

    const index = Number(e.target.dataset.index);

    const confirmDelete = confirm(
      "Yakin ingin menghapus siswa ini?"
    );

    if (confirmDelete) {

      students.splice(index, 1);

      localStorage.setItem(
        "students",
        JSON.stringify(students)
      );

      renderStudentList();

      alert("Siswa berhasil dihapus!");
    }
  }

});
// render awal saat page di load...
renderStudentList();


