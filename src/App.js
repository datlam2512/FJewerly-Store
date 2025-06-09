import { RouterProvider } from "react-router-dom";
import router from "./Router/router";
import { useTheme } from "./context/ThemeContext";
import './App.scss';
function App() {
  const { isDarkMode } = useTheme();
  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'bright-mode'}`}>
       <RouterProvider router={router} />
    </div>
  );
}

export default App;
