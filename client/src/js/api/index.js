const BASE_URL = "http://localhost:3000/api";

const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  },

  PUT(data) {
    return {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : null,
    };
  },

  DELETE() {
    return {
      method: "DELETE",
    };
  },
};

const request = async (url, options) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    console.error("에러가 발생했습니다.");
    alert("에러가 발생했습니다.");
  }

  return response.json();
};

const requestWithoutJson = async (url, options) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    console.error("에러가 발생했습니다.");
    alert("에러가 발생했습니다.");
  }

  return response;
};

const MenuApi = {
  async getAllMenuByCategory(category) {
    return await request(`${BASE_URL}/category/${category}/menu`);
  },

  async createMenu(category, name) {
    await request(
      `${BASE_URL}/category/${category}/menu`,
      HTTP_METHOD.POST({ name }),
    );
  },

  async updateMenuName(category, menuId, name) {
    return await request(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.PUT({ name }),
    );
  },

  async toggleSoldOutMenu(category, menuId) {
    return await request(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      HTTP_METHOD.PUT(),
    );
  },

  async deleteMenu(category, menuId) {
    return await requestWithoutJson(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.DELETE(),
    );
  },
};

export default MenuApi;
