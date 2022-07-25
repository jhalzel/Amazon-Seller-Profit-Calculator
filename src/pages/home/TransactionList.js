import SingleTransaction from "./SingleTransaction";

// styles
import styles from "./Home.module.css";

export default function TransactionList({ transactions }) {
  return (
    <>
      <h3 className={styles.header}>Transactions</h3>
      <ul className={styles.transactions}>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <SingleTransaction
              transaction={transaction} //prop
            />
          </li>
        ))}
      </ul>
    </>
  );
}
