import NotificationSystem from "./features/notification/NotificationSystem";
import NotificationProvider from "./features/notification/NotificationProvider";
import { AuthProvider } from "./features/auth/AuthProvider";
import ThemeProvider from "./features/theme/ThemeProvider";
import Header from "./components/Header";
import ItemList from "./features/items/ItemList";
import ComplexForm from "./features/form/ComplexForm";

const App = () => {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>
          <Header />
          <div className="container mx-auto px-4 py-8">
            <ItemList />
            <ComplexForm />
          </div>
          <NotificationSystem />
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
};

export default App;
