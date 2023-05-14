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
  this.menu = [];

  this.init = () => {
    if (store.getLocalStorage().length > 1) {
      this.menu = store.getLocalStorage();
      render();
    }
  };

  const render = () => {
    const template = this.menu
      .map((item, index) => menuItemTemplate(item.name, index))
      .join("");

    $("#espresso-menu-list").innerHTML = template;

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
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").textContent = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    const menuName = $("#espresso-menu-name").value;

    if (menuName === "") {
      alert("값을 입력해주세요.");
      return;
    }

    this.menu.push({ name: menuName });
    store.setLocalStorage(this.menu);

    render();

    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const menuId = e.target.closest("li").dataset.menuId;

    const updatedMenuName = prompt(
      "수정할 이름을 입력해주세요.",
      $menuName.textContent,
    );

    this.menu[menuId].name = updatedMenuName ?? $menuName.textContent;
    store.setLocalStorage(this.menu);

    $menuName.textContent = updatedMenuName ?? $menuName.textContent;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu.splice(menuId, 1);
      store.setLocalStorage(this.menu);

      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addMenuName();
    }
  });

  $("#espresso-menu-list").addEventListener("click", (e) => {
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
