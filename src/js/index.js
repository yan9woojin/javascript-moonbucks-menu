import MenuApi from "./api/index.js";
import { $ } from "./utils/dom.js";

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory,
    );
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item) => menuItemTemplate(item.id, item.name, item.isSoldOut))
      .join("");
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const menuItemTemplate = (menuId, menuName, isSoldOut) => {
    return `
    <li data-menu-id="${menuId}" class="menu-list-item d-flex items-center py-2">
      <span class="${
        isSoldOut ? "sold-out" : ""
      } w-100 pl-2 menu-name">${menuName}</span>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
        품절
      </button>
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
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").textContent = `총 ${menuCount}개`;
  };

  const addMenuName = async () => {
    const menuName = $("#menu-name").value;

    if (menuName === "") {
      alert("값을 입력해주세요.");
      return;
    }

    await MenuApi.createMenu(this.currentCategory, menuName);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory,
    );
    $("#menu-name").value = "";
    render();
  };

  const updateMenuName = async (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const menuId = e.target.closest("li").dataset.menuId;

    const updatedMenuName =
      prompt("수정할 이름을 입력해주세요.", $menuName.textContent) ??
      $menuName.textContent;

    await MenuApi.updateMenuName(this.currentCategory, menuId, updatedMenuName);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory,
    );
    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
        this.currentCategory,
      );
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory,
    );
    render();
  };

  const initEventListeners = () => {
    $("nav").addEventListener("click", async (e) => {
      if (e.target.classList.contains("cafe-category-name")) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").textContent = `${e.target.textContent} 메뉴 관리`;
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
          this.currentCategory,
        );
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
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }

      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
    });
  };
}

const app = new App();
app.init();
