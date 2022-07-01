import "./App.css";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

function App() {
  const [greeting, setGreeting] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadProvider();
  }, []);

  const loadProvider = async () => {
    const url = "http://localhost:8545";
    let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const provider = new ethers.providers.JsonRpcProvider(url);
    const contract = new ethers.Contract(
      contractAddress,
      Greeter.abi,
      provider
    );
    setContract(contract);
    setProvider(provider);
    console.log(contract);
  };

  useEffect(() => {
    const getGreetings = async () => {
      const greeting = await contract.greet();
      setGreeting(greeting);
    };
    contract && getGreetings();
  }, [contract]);

  const changeGreetings = async () => {
    if (title.length > 0) {
      const signer = contract.connect(provider.getSigner());
      signer.setGreeting(title);
      setTitle("");
      setTimeout(() => {
        loadProvider();
      }, 100);
      setTimeout();
    }
  };

  return (
    <div className="main-div">
      <div className="center">
        <h3>{greeting}</h3>
        <input
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="button" onClick={changeGreetings}>
          Change
        </button>
        <h5 style={{ fontStyle: "italic" }}>
          "Write anything that you want to change on Smart contract"
        </h5>
      </div>
    </div>
  );
}

export default App;
