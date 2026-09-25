console.log('=== MATERI 5 - CONSUME API ===');
const API_URL = 'https://dummyjson.com/products';

const productGrid = document.getElementById('product-grid');
const loadingState = document.getElementById('loading-state');
const resultSummary = document.getElementById('result-summary');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const resetBtn = document.getElementById('reset-btn');
const reloadBtn = document.getElementById('reload-btn')

let currentProducts = [];


reloadBtn.addEventListener('click', () => {
  window.location.reload();// reload ulang halaman
});

resetBtn.addEventListener('click', () => {
  //mengembalikan semua state dari filter yg ada
  searchInput.value = '';// pencariaan teks dikosongkan 
  categorySelect.value = 'all';// kategori di set ke all
  sortSelect.value = 'default';//sort di set ke default
  getProducts();
});


function renderProduct(dataProducts) {
    productGrid.innerHTML = ''; // reset isi product grid
    dataProducts.map(dataProduct => {
      // ubah key dari object dataProduct menjadi variabel -> destructuring assignment
      // untuk memudahkan penggunaan variabel di dalam string template
      const { id, title, price, category, thumbnail, rating } = dataProduct;
      // gunakan += untuk menambahkan string ke dalam productGrid.innerHTML 
      // secara iteratif untuk menghindari overwriting atau tertimpa
      productGrid.innerHTML += `
        <article class="product-card">
          <div class="product-image-wrap">
            <img class="product-image" src="${thumbnail}" alt="${title}" loading="lazy">
          </div>
          <div class="product-body">
            <span class="product-category">
              ${category}
            </span>
            <h3 class="product-title">
              ${title}
            </h3>

            <div class="product-meta">
              <span class="product-price">
                $${price}
              </span>

              <span class="product-rating">
                ⭐ ${rating}
              </span>
            </div>

            <button type="button" class="detail-btn" data-id="${id}">
              Lihat Detail
            </button>
          </div>
        </article>
      `;
    });
}

// function di variable disebut juga arrow function atau anonymous function
const getProducts = async (category = 'all') => {
    try {
        const apiUrl =
            category === 'all'
                ? API_URL
                : `${API_URL}/category/${category}`;

        const response = await fetch(apiUrl);

        const data = await response.json();

        const { limit, products, skip, total } = data;

        currentProducts = products;

        renderProduct(products);

        productGrid.hidden = false;
        resultSummary.hidden = true;
        loadingState.hidden = true;

    } catch (error) {
        alert('Something went wrong! Please try again later.');
        console.error("Error on getProducts:", error);
    }
};

const searchProducts = () => {

    const keyword = searchInput.value.toLowerCase().trim();

    const filteredProducts = currentProducts.filter(product => {

        return (
            product.title.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword) ||
            (product.brand || '').toLowerCase().includes(keyword)
        );

    });

    renderProduct(filteredProducts);
};

const getProductCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        categorySelect.innerHTML = '<option value="all">Semua kategori</option>';
        data.map(category => {
            categorySelect.innerHTML += `<option value="${category.slug}">${category.name}</option>`;
        });
    } catch (error) {
        console.error("Error on getProductCategories:", error);
    }
};

const sortProducts = () => {

    const sortValue = sortSelect.value;

    const sortedProducts = [...currentProducts];

    if (sortValue === 'price-asc') {

        sortedProducts.sort((a, b) => a.price - b.price);

    } else if (sortValue === 'price-desc') {

        sortedProducts.sort((a, b) => b.price - a.price);

    } else if (sortValue === 'title-asc') {

        sortedProducts.sort((a, b) =>
            a.title.localeCompare(b.title)
        );

    } else if (sortValue === 'title-desc') {

        sortedProducts.sort((a, b) =>
            b.title.localeCompare(a.title)
        );

    } else if (sortValue === 'rating-desc') {

        sortedProducts.sort((a, b) =>
            b.rating - a.rating
        );
    }

    renderProduct(sortedProducts);
};


// saat kategori select berubah atau di klik render ulang produk berdasarkan kategori yg dipilih
categorySelect.addEventListener('change', () => {
    getProducts(categorySelect.value);
});

searchInput.addEventListener('input', () => {
    searchProducts();
});

sortSelect.addEventListener('change', () => {
    sortProducts();
});

// panggil fungsi untuk mengambil data dari API
getProductCategories();
getProducts();


    