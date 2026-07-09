const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function createEntityMock(name) {
  const getKey = () => `mock_db_${name}`;
  const getItems = () => JSON.parse(localStorage.getItem(getKey()) || "[]");
  const setItems = (items) => localStorage.setItem(getKey(), JSON.stringify(items));

  return {
    list: async (sort, limit) => {
      await delay(200); // Simulate network
      let items = getItems();
      return items;
    },
    create: async (data) => {
      await delay(200);
      const items = getItems();
      const newItem = { id: Math.random().toString(36).substring(2, 11), ...data, created_date: new Date().toISOString() };
      items.push(newItem);
      setItems(items);
      return newItem;
    },
    update: async (id, data) => {
      await delay(200);
      const items = getItems();
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...data };
        setItems(items);
        return items[index];
      }
      return null;
    },
    delete: async (id) => {
      await delay(200);
      const items = getItems();
      const newItems = items.filter(i => i.id !== id);
      setItems(newItems);
      return true;
    }
  };
}

export const base44 = {
  auth: {
    loginViaEmailPassword: async (email, password) => {
      await delay(500);
      if (email === "test@test.com" && password === "password") {
        return true;
      }
      return true; // Accept any credentials for now in offline mode
    },
    register: async (data) => {
      await delay(500);
      return true;
    },
    resetPasswordRequest: async (email) => {
      await delay(500);
      return true;
    },
    verifyOtp: async (data) => {
      await delay(500);
      return { access_token: "mock-token" };
    },
    resendOtp: async (email) => {
      await delay(500);
      return true;
    },
    loginWithProvider: (provider, path) => {
      console.log("Mock loginWithProvider", provider);
    },
    setToken: (token) => {
      localStorage.setItem("mock_auth_token", token);
    },
    resetPassword: async (data) => {
      await delay(500);
      return true;
    },
    me: async () => {
      await delay(200);
      const token = localStorage.getItem("mock_auth_token");
      if (token) return { id: "1", email: "test@test.com", name: "Mock User" };
      return null;
    },
    logout: () => {
      localStorage.removeItem("mock_auth_token");
    },
    redirectToLogin: (path) => {
      window.location.href = "/login";
    }
  },
  entities: {
    Company: createEntityMock("Company"),
    Client: createEntityMock("Client"),
    Lead: createEntityMock("Lead"),
    Deal: createEntityMock("Deal"),
    Payment: createEntityMock("Payment"),
    FollowUp: createEntityMock("FollowUp"),
    Expense: createEntityMock("Expense"),
    Service: createEntityMock("Service"),
    Activity: createEntityMock("Activity"),
  }
};
