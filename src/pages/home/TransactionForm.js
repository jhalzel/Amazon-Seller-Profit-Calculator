import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";

//styles
import styles from "./Home.module.css";

export default function TransactionForm({ uid }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [asin, setAsin] = useState("");
  const { addDocument, response } = useFirestore("transactions");

  const handleSubmit = (e) => {
    e.preventDefault();
    addDocument({
      uid,
      name,
      asin,
      amount,
    });
  };

  // reset the form fields
  useEffect(() => {
    if (response.success) {
      setName("");
      setAmount("");
    }
  }, [response.success]);

  return (
    <>
      <span>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Product name:</span>
            <input
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </label>
          <label>
            <span>ASIN</span>
            <input
              type="text"
              required
              onChange={(e) => setAsin(e.target.value)}
              value={asin}
            />
          </label>
          <label>
            <span>Amount ($):</span>
            <input
              type="number"
              required
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </label>
          <button>Add Transaction</button>
        </form>
      </span>
    </>
  );
}
