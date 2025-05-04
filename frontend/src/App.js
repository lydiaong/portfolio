import React, { useState } from "react";
import { Layout } from "antd";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import AppContent from "./layout/AppContent";

const App = () => {
  const [dropdownText, setDropdownText] = useState("SGD");
  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AppHeader
        dropdownText={dropdownText}
        setDropdownText={setDropdownText}
      />
      <AppContent dropdownText={dropdownText} />
      <AppFooter />
    </Layout>
  );
};

export default App;
