const $ = (selector) => document.querySelector(selector);

const menuItemTemplate = (espressoMenuName) => {
  return `
    <li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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

function App() {
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      const $menuName = e.target.closest("li").querySelector(".menu-name");

      const updatedMenuName = prompt(
        "수정할 이름을 입력해주세요.",
        $menuName.textContent,
      );

      $menuName.textContent = updatedMenuName ?? $menuName.textContent;
    }

    if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("정말 삭제하시겠습니까?")) {
        e.target.closest("li").remove();

        updateMenuCount();
      }
    }
  });

  const addMenuName = () => {
    const $espressoMenuName = $("#espresso-menu-name").value;

    if ($espressoMenuName === "") {
      alert("값을 입력해주세요.");
      return;
    }

    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate($espressoMenuName),
    );

    updateMenuCount();

    $("#espresso-menu-name").value = "";
  };

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }

    addMenuName();
  });
}

App();
