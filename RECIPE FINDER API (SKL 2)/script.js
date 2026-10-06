const API_URL = 'https://dummyjson.com/recipes?limit=0';

const grid = document.getElementById('recipe-grid');
const resultCount = document.getElementById('result-count');
const statusBox = document.getElementById('status');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const cuisineFilter = document.getElementById('cuisine-filter');
const difficultyFilter = document.getElementById('difficulty-filter');
const detailDialog = document.getElementById('detail');
const detailBody = document.getElementById('detail-body');
const closeDetail = document.getElementById('close-detail');
const homeNav = document.getElementById('home-nav');
const favoriteNav = document.getElementById('favorite-nav');

let semuaResep = [];
let halamanAktif = 'home';

async function ambilResep() {
  statusBox.hidden = false;
  statusBox.textContent = 'Sedang memuat resep...';
  grid.innerHTML = '';

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Server mengembalikan status ' + response.status);
    }

    const hasil = await response.json();
    semuaResep = hasil.recipes;

    terapkanFilter();
    statusBox.hidden = true;
  } catch (error) {
    statusBox.hidden = false;
    statusBox.textContent = 'Gagal memuat resep. Periksa koneksi internet, lalu muat ulang halaman.';
    resultCount.textContent = '0 resep';
    console.error(error);
  }
}

function terapkanFilter() {
  const kata = searchInput.value.trim().toLowerCase();
  const cuisine = cuisineFilter.value;
  const difficulty = difficultyFilter.value;

  const hasil = semuaResep.filter((resep) => {
    const cocokNama = resep.name.toLowerCase().includes(kata);
    const cocokAsal = cuisine === 'all' || resep.cuisine === cuisine;
    const cocokLevel = difficulty === 'all' || resep.difficulty === difficulty;
    return cocokNama && cocokAsal && cocokLevel;
  });

  tampilkanResep(hasil, kata);
}

function tampilkanResep(recipes, kata) {
  grid.innerHTML = '';

  if (recipes.length === 0) {
    resultCount.textContent = '0 resep';
    statusBox.hidden = false;

    statusBox.textContent = kata
      ? 'Tidak ada resep yang cocok dengan "' + kata + '".'
      : 'Tidak ada resep untuk filter ini.';

    return;
  }

  statusBox.hidden = true;
  resultCount.textContent = recipes.length + ' resep';

  recipes.forEach((resep) => {

    const kartu = document.createElement('article');
    kartu.className = 'card';

    const gambar = document.createElement('img');
    gambar.src = resep.image;
    gambar.alt = resep.name;
    gambar.loading = 'lazy';

    const isi = document.createElement('div');
    isi.className = 'card-body';

    const cuisine = document.createElement('span');
    cuisine.className = 'card-cuisine';
    cuisine.textContent = resep.cuisine;

    const judul = document.createElement('h3');
    judul.textContent = resep.name;

    const meta = document.createElement('div');
    meta.className = 'meta';

    const rating = document.createElement('span');
    rating.className = 'rating';
    rating.textContent = '★ ' + resep.rating;

    const waktu = document.createElement('span');
    waktu.textContent =
      '⏱ ' + (resep.prepTimeMinutes + resep.cookTimeMinutes) + ' mnt';

    meta.append(rating, waktu);


    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = resep.difficulty;


    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const detailButton = document.createElement('button');

    detailButton.type = 'button';
    detailButton.className = 'detail-btn';
    detailButton.textContent = 'Lihat Detail';

    detailButton.dataset.id = resep.id;

    const favoriteButton = document.createElement('button');

    favoriteButton.type = 'button';
    favoriteButton.className = 'favorite-btn';

    favoriteButton.dataset.id = resep.id;

    favoriteButton.textContent =
      cekFavorite(resep.id) ? '♥' : '♡';

    if (cekFavorite(resep.id)) {
      favoriteButton.classList.add('active');
    }


    // Masukkan tombol ke actions

    actions.append(detailButton, favoriteButton);
    isi.append(
      cuisine,
      judul,
      meta,
      badge,
      actions
    );

    kartu.append(gambar, isi);

    grid.appendChild(kartu);
  });
}

function getFavorites() {
  return JSON.parse(
    localStorage.getItem('favoriteRecipes')
  ) || [];
}

function simpanFavorites(favorites) {
  localStorage.setItem(
    'favoriteRecipes',
    JSON.stringify(favorites)
  );
}

function cekFavorite(id) {
  const favorites = getFavorites();

  return favorites.includes(id);
}

function toggleFavorite(id) {

  let favorites = getFavorites();

  if (favorites.includes(id)) {

    // Kalau sudah ada → hapus
    favorites = favorites.filter(
      (favoriteId) => favoriteId !== id
    );

  } else {

    // Kalau belum ada → tambahkan
    favorites.push(id);

  }

  simpanFavorites(favorites);

  if (halamanAktif === 'favorite') {
  tampilkanFavorit();
  } else {
  terapkanFilter();
  }
}

function bukaDetail(id) {

  const resep = semuaResep.find(
    (item) => item.id === id
  );

  if (!resep) return;

  const totalWaktu =
    resep.prepTimeMinutes + resep.cookTimeMinutes;


  detailBody.innerHTML = `
    <img
      class="detail-hero"
      src="${resep.image}"
      alt="${resep.name}"
    >

    <div class="detail-content">

      <span class="card-cuisine">
        ${resep.cuisine}
      </span>

      <h2>${resep.name}</h2>

      <div class="detail-stats">

        <span class="pill">
          ⭐ ${resep.rating}
        </span>

        <span class="pill">
          ⏱ ${totalWaktu} menit
        </span>

        <span class="pill">
          ${resep.difficulty}
        </span>

        <span class="pill">
          👨‍🍳 ${resep.servings} porsi
        </span>

      </div>


      <h3>Bahan-bahan</h3>

      <ul>
        ${resep.ingredients
          .map((bahan) => `<li>${bahan}</li>`)
          .join('')}
      </ul>


      <h3>Cara Membuat</h3>

      <ol>
        ${resep.instructions
          .map((langkah) => `<li>${langkah}</li>`)
          .join('')}
      </ol>

    </div>
  `;

  detailDialog.showModal();
}

function tampilkanFavorit() {

  const favorites = getFavorites();

  const resepFavorit = semuaResep.filter((resep) => {
    return favorites.includes(resep.id);
  });

  tampilkanResep(resepFavorit, '');

  if (resepFavorit.length === 0) {
    statusBox.hidden = false;

    statusBox.textContent =
      'Kamu belum memiliki resep favorit ❤️';
  }
}

function ubahHalaman(halaman) {

  halamanAktif = halaman;

  if (halaman === 'home') {

    homeNav.classList.add('active');
    favoriteNav.classList.remove('active');

    terapkanFilter();

  } else {

    homeNav.classList.remove('active');
    favoriteNav.classList.add('active');

    tampilkanFavorit();

  }

}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  terapkanFilter();
});

grid.addEventListener('click', (event) => {

  const detailButton =
    event.target.closest('.detail-btn');

  const favoriteButton =
    event.target.closest('.favorite-btn');

  if (detailButton) {

    const id =
      Number(detailButton.dataset.id);

    bukaDetail(id);

    return;
  }
  if (favoriteButton) {

    const id =
      Number(favoriteButton.dataset.id);

    toggleFavorite(id);

  }

});

closeDetail.addEventListener('click', () => {
  detailDialog.close();
});

homeNav.addEventListener('click', () => {
  ubahHalaman('home');
});

favoriteNav.addEventListener('click', () => {
  ubahHalaman('favorite');
});

searchInput.addEventListener('input', terapkanFilter);

cuisineFilter.addEventListener('change', terapkanFilter);

difficultyFilter.addEventListener('change', terapkanFilter);


ambilResep();