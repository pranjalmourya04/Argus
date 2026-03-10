import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Analyze from "./components/Analyze";
import Dashboard from "./components/Dashboard";
import Architecture from "./components/Architecture";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Analyze />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/architecture" element={<Architecture />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
