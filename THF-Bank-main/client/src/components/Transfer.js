import React from "react";
import "../styles/Transfer.css";
import "../styles/style.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import NavBarLoggedIn from "./NavBarLoggedIn";
import Footer from "./Footer";

const Transfer = () => {
  const navigate = useNavigate();
  const [receiverEmail, setReceiverEmail] = useState();
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [options, setOptions] = useState([]);
  const [item, setItem] = useState("");
  const [beneficiaryOptions, setBeneficiaryOptions] = useState([]);
  const [beneficiaryItem, setBeneficiaryItem] = useState("");


  useEffect(() => {
    async function getSender() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      setOptions(data.map(({ name, key }) => ({ label: name, value: name })));
    }
    getSender();
  }, []);


  useEffect(() => {
    async function getBeneficiary() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      setBeneficiaryOptions(data.map(({ name, key }) => ({ label: name, value: name })));
    }
    getBeneficiary();
  }, []);
  const handleChange = (event) => {
    setItem(event);
    console.log(event);
  };

  const handleChangeBeneficiary = (event) => {
    setBeneficiaryItem(event);
    console.log(event);
  };

  async function transferMoney(event) {
    event.preventDefault();

    const req = await fetch("http://localhost:8080/api/v1/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        email: receiverEmail,
        balance: amount,
        desc: desc,
        sender: item.value,
        beneficiary: beneficiaryItem.value,
      }),
    });

    const data = await req.json();

    if (data.status === "ok") {
      navigate("/confirmation");
    }
  }

  return (
    <div>
      <NavBarLoggedIn />
      <div>
        <div className="bgh">
          <h1 className="transfer-heading">The Hassle Free Fund Transfer</h1>
          <div className="leftc">
            <h3 className="transfer-title">Beneficiary Transfer Form</h3>
            <>
            <div className="App">
              <Select
                className="mb-3"
                placeholder=  "Select From Account" 
                options={options}
                onChange={handleChange}
               
              />
              </div>
            <div className="App">
              <Select
                className="mb-3"
                placeholder="Select Beneficiary Account"
                options={beneficiaryOptions}
                onChange={handleChangeBeneficiary}
                aria-label="Recipient's Acc No"
                aria-describedby="basic-addon2"
              />
              </div>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Recipient's Email"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  aria-label="Recipient's Acc No"
                  aria-describedby="basic-addon2"
                />
                <InputGroup.Text id="basic-addon2">@Recipient</InputGroup.Text>
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text>₹ Amount</InputGroup.Text>
                <FormControl
                  aria-label="Amount (to the nearest Rupee)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <InputGroup.Text>.00</InputGroup.Text>
              </InputGroup>

              <InputGroup>
                <InputGroup.Text>
                  Description of the transaction
                </InputGroup.Text>
                <FormControl
                  as="textarea"
                  aria-label="With textarea"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </InputGroup>

              <Button
                className="mt-3"
                variant="primary"
                size="lg"
                onClick={transferMoney}
              >
                Transfer
              </Button>
            </>
          </div>
          <div className="rightc">
     
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Transfer;
