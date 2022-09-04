import MainPage from './pages/MainPage';
import AssistantPage from './pages/AssistantPage';
import {
  Route,
  Routes
} from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Routes>
    </div>
  );
}

export default App;
