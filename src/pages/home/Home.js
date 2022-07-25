// import { useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";

//styles
import styles from "./Home.module.css";

//components
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

export default function Home() {
  //authorized user from firestore
  const { user } = useAuthContext();
  //displaying the data from firebase
  const { documents, error } = useCollection(
    "transactions",
    ["uid", "==", user.uid],
    ["createdAt", "desc"]
  );

  // const { profits} = useCollection(
  //   "profits",
  //   ['uid', '==', user.uid],
  //   ["createdAt", 'desc']
  // )

  // useEffect(() => console.log("documents:", documents));

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {error && <p>{error}</p>}
        {documents && <TransactionList transactions={documents} />}
      </div>
      <section>
        <h3 className={styles.header1}>Add a Transaction</h3>
        <div className={styles.sidebar}>
          <TransactionForm uid={user.uid} />
        </div>
      </section>
    </div>
  );
}