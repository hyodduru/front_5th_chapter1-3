import React, { useState, createContext, useContext } from "react";
import { generateItems, renderLog } from "./utils";
import { memo, useCallback, useMemo } from "./@lib";

type NotificationType = "info" | "success" | "warning" | "error";
interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
}
interface User {
  id: number;
  name: string;
  email: string;
}
interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}
interface NotificationContextType {
  addNotification: (msg: string, type: NotificationType) => void;
  removeNotification: (id: number) => void;
  notifications: Notification[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext 밖에서 사용 불가");
  return context;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext 밖에서 사용 불가");
  return context;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);
const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("NotificationContext 밖에서 사용 불가");
  return context;
};

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((msg: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message: msg, type }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(
    () => ({ notifications, addNotification, removeNotification }),
    [notifications, addNotification, removeNotification],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { addNotification } = useNotificationContext();
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(
    (email: string) => {
      setUser({ id: 1, name: "홍길동", email });
      addNotification("성공적으로 로그인되었습니다", "success");
    },
    [addNotification],
  );

  const logout = useCallback(() => {
    setUser(null);
    addNotification("로그아웃되었습니다", "info");
  }, [addNotification]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const Header = memo(() => {
  renderLog("Header rendered");
  const { user, login, logout } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">샘플 애플리케이션</h1>
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            {theme === "light" ? "다크 모드" : "라이트 모드"}
          </button>
          {user ? (
            <div className="flex items-center">
              <span className="mr-2">{user.name}님 환영합니다!</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => login("user@example.com", "password")}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

export const ComplexForm = memo(() => {
  renderLog("ComplexForm rendered");
  const { addNotification } = useNotificationContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: 0,
    preferences: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification("폼이 성공적으로 제출되었습니다", "success");
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">복잡한 폼</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          placeholder="이름"
          className="w-full p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((p) => ({ ...p, email: e.target.value }))
          }
          placeholder="이메일"
          className="w-full p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={(e) =>
            setFormData((p) => ({ ...p, age: parseInt(e.target.value) || 0 }))
          }
          placeholder="나이"
          className="w-full p-2 border border-gray-300 rounded text-black"
        />
        <div className="space-x-4">
          {["독서", "운동", "음악", "여행"].map((pref) => (
            <label key={pref} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.includes(pref)}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    preferences: prev.preferences.includes(pref)
                      ? prev.preferences.filter((p) => p !== pref)
                      : [...prev.preferences, pref],
                  }))
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">{pref}</span>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          제출
        </button>
      </form>
    </div>
  );
});

export const NotificationSystem = memo(() => {
  renderLog("NotificationSystem rendered");
  const { notifications, removeNotification } = useNotificationContext();
  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-4 rounded shadow-lg ${n.type === "success" ? "bg-green-500" : n.type === "error" ? "bg-red-500" : n.type === "warning" ? "bg-yellow-500" : "bg-blue-500"} text-white`}
        >
          {n.message}
          <button
            onClick={() => removeNotification(n.id)}
            className="ml-4 text-white hover:text-gray-200"
          >
            닫기
          </button>
        </div>
      ))}
    </div>
  );
});

export const ItemList: React.FC<{
  items: Item[];
  onAddItemsClick: () => void;
}> = memo(({ items, onAddItemsClick }) => {
  renderLog("ItemList rendered");
  const [filter, setFilter] = useState("");
  const { theme } = useThemeContext();

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase()),
  );

  const totalPrice = filteredItems.reduce((sum, item) => sum + item.price, 0);
  const averagePrice = Math.round(totalPrice / filteredItems.length) || 0;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">상품 목록</h2>
        <button
          onClick={onAddItemsClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
        >
          대량추가
        </button>
      </div>
      <input
        type="text"
        placeholder="상품 검색..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
      />
      <ul className="mb-4 mx-4 flex gap-3 text-sm justify-end">
        <li>검색결과: {filteredItems.length.toLocaleString()}개</li>
        <li>전체가격: {totalPrice.toLocaleString()}원</li>
        <li>평균가격: {averagePrice.toLocaleString()}원</li>
      </ul>
      <ul className="space-y-2">
        {filteredItems.map((item) => (
          <li
            key={item.id}
            className={`p-2 rounded shadow ${theme === "light" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
          >
            {item.name} - {item.category} - {item.price.toLocaleString()}원
          </li>
        ))}
      </ul>
    </div>
  );
});

const App = () => {
  const [theme, setTheme] = useState("light");
  const baseItems = useMemo(() => generateItems(1000), []);
  const [extraItems, setExtraItems] = useState<Item[]>([]);
  const allItems = useMemo(
    () => [...baseItems, ...extraItems],
    [baseItems, extraItems],
  );

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
    [],
  );
  const addItems = useCallback(
    () =>
      setExtraItems((prev) => [
        ...prev,
        ...generateItems(1000, baseItems.length + prev.length),
      ]),
    [baseItems.length],
  );
  const themeValue = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  );

  return (
    <NotificationProvider>
      <ThemeContext.Provider value={themeValue}>
        <AuthProvider>
          <Header />
          <div className="container mx-auto px-4 py-8">
            <ItemList items={allItems} onAddItemsClick={addItems} />
            <ComplexForm />
          </div>
          <NotificationSystem />
        </AuthProvider>
      </ThemeContext.Provider>
    </NotificationProvider>
  );
};

export default App;
