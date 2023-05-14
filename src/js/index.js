const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => menuItemTemplate(item.name, index))
      .join("");

    $("#menu-list").innerHTML = template;

    updateMenuCount();
  };

  const menuItemTemplate = (menuName, index) => {
    return `
    <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${menuName}</span>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
      >
        수정
      </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
      >
        삭제
      </button>
    </li>
  `;
  };

  const updateMenuCount = () => {
    const menuCount = $("#menu-list").querySelectorAll("li").length;
    $(".menu-count").textContent = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    const menuName = $("#menu-name").value;

    if (menuName === "") {
      alert("값을 입력해주세요.");
      return;
    }

    this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);

    render();

    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const menuId = e.target.closest("li").dataset.menuId;

    const updatedMenuName = prompt(
      "수정할 이름을 입력해주세요.",
      $menuName.textContent,
    );

    this.menu[this.currentCategory][menuId].name =
      updatedMenuName ?? $menuName.textContent;
    store.setLocalStorage(this.menu);

    $menuName.textContent = updatedMenuName ?? $menuName.textContent;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);

      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  $("nav").addEventListener("click", (e) => {
    if (e.target.classList.contains("cafe-category-name")) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").textContent = `${e.target.textContent} 메뉴 관리`;
      render();
    }
  });

  $("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#menu-submit-button").addEventListener("click", addMenuName);

  $("#menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addMenuName();
    }
  });

  $("#menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });
}

const app = new App();
app.init();
