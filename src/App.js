import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import Dappzada from "./abis/Dappzada.json";

// Config
import config from "./config.json";

function App() {
  return (
    <div>
      <h2>Welcome to Dappzada</h2>
    </div>
  );
}

export default App;
