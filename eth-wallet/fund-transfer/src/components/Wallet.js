import React, { useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "../utils/load-contract";
import "../App.css";
import { BsArrowClockwise } from "react-icons/bs";

export default function Wallet() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reload, setReload] = useState(false);
  const [totalBal, setTotalbal] = useState(null);

  useEffect(() => {
    loadProvider();
  }, []);

  const loadProvider = async () => {
    const provider = await detectEthereumProvider();
    const contract = await loadContract("Funder", provider);
    if (provider) {
      provider.request({ method: "eth_requestAccounts" });
      setWeb3Api({
        web3: new Web3(provider),
        provider,
        contract,
      });
    } else {
      console.error("Please install Metamask");
      alert("Please install Metamask");
    }
    //   let provider = null;
    //     if (window.ethereum) {
    //       provider = window.ethereum;
    //       try {
    //         await provider.enable();
    //       } catch {
    //         console.log("User is not allowed");
    //       }
    //     } else if (window.web3) {
    //       provider = window.web3.currentProvider;
    //     } else if (!process.env.production) {
    //       provider = new Web3.provider.HttpProvider("http://localhost:7545");
    //     }
    //   setWeb3Api({
    //     web3: new Web3(provider),
    //     provider,
    //   });
  };

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };

    web3Api.contract && loadBalance();
  }, [web3Api, reload]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  //   const connectToMetamask = async () => {
  //     const accounts = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     console.log(accounts);
  //   };

  const transferFund = async () => {
    console.log("working");
    const { web3, contract } = web3Api;
    await contract.transfer({
      from: account,
      value: web3.utils.toWei("2", "ether"),
    });
    reloadEffect();
  };

  const reloadEffect = () => setReload(!reload);

  const withdrawFund = async () => {
    const { web3, contract } = web3Api;
    const withdrawAmount = web3.utils.toWei("2", "ether");

    await contract.withdraw(withdrawAmount, {
      from: account,
    });
    reloadEffect();
  };
  //Test task
  useEffect(() => {
    web3Api.web3 && getAccountBalance();
    // eslint-disable-next-line
  }, [web3Api.web3, reload, account]);

  const getAccountBalance = async () => {
    const { web3 } = web3Api;
    await web3.eth.getBalance(account).then((result) => {
      setTotalbal(web3Api.web3.utils.fromWei(result, "ether"));
    });
  };
  //
  return (
    <div className="card wallet-card text-center">
      <div className="card-heading h4"> Wallet </div>
      <div className="card-body">
        <h5 className="card-title">Wallet Balance : {balance} ETH</h5>
        <p className="card-text">
          Account : {account ? account : "Not connected"}
        </p>
        <p className="card-text">
          Account Balance: {totalBal ? `${totalBal} ETH ` : "Not connected "}
          {!totalBal && (
            <span onClick={getAccountBalance}>
              <BsArrowClockwise />
            </span>
          )}
        </p>
        {/* <button
            type="button"
            className="btn btn-success"
            onClick={connectToMetamask}
          >
            Connect to metamask
          </button>
          <span> </span> */}
        <button
          type="button"
          className="btn btn-success"
          onClick={transferFund}
        >
          Transfer
        </button>
        <span> </span>
        <button
          type="button"
          className="btn btn-primary"
          onClick={withdrawFund}
        >
          Withdraw
        </button>
        <div>
          <button
            style={{ marginTop: "5px" }}
            type="button"
            className="btn btn-warning"
            onClick={getAccountBalance}
          >
            get Account Balance
          </button>
        </div>
      </div>
    </div>
  );
}
