import { useFirestore } from "../../hooks/useFirestore";
import { useState, React } from "react";
import { useCollection } from "../../hooks/useCollection";

// styles
import styles from "./Home.module.css";

//components
import ProfitsModal from "./Profits";

export default function SingleTransaction({ transaction }) {
  const { deleteDocument } = useFirestore("transactions", "profits");
  const [showModal, setShowModal] = useState(false);
  const { documents, error } = useCollection("profits");

  const handleClick = () => {
    showModal ? setShowModal(false) : setShowModal(true);
  };

  return (
    <>
      <div className={styles.card} type="button">
        <section className={styles.section1} onClick={handleClick}>
          <h3 className={styles.amount}>${transaction.amount}</h3>
          <span className={styles.name}>{transaction.name}</span>
          <h2 className={styles.asin}>{transaction.asin}</h2>

          {/* If there is an error with firebase data*/}
          {error && <p>{error}</p>}
          {/* if profits documents exist */}
          {documents &&
            documents.map((docu) => {
              if (docu.asin === transaction.asin) {
                // console.log("the current asin is: ", docu.asin);
                // console.log(docu);
                return (
                  <>
                    <section className={styles.profitsCard}>
                      <section>
                        <span className={styles.netProfit}>
                          Net Costs:{" "}
                          <span className={styles.num1}>
                            ${docu.totalCosts.toFixed(2)}
                          </span>
                        </span>
                        <br />
                        <span className={styles.breakdown}>Breakdown: </span>
                        <br />
                        <span className={styles.breakDetails}>
                          <span className={styles.initCost}>
                            InitialCost: ${transaction.amount}
                          </span>
                          <br />
                          <span className={styles.FBAFees}>
                            FBA Fees: ${docu.totalFees.toFixed(2)}
                          </span>
                          <br />
                          <span className={styles.shippingCosts}>
                            Shipping Costs: ${docu.totalShipping}
                          </span>
                          <br />
                        </span>
                      </section>

                      <section>
                        <span className={styles.netProfit}>
                          Net Profit:{" "}
                          <span
                            style={
                              docu.netProfit > 0
                                ? { color: "#1f9751" }
                                : { color: "red" }
                            }
                          >
                            ${docu.netProfit.toFixed(2)}
                          </span>
                        </span>

                        <br />
                        <span className={styles.breakDetails}>
                          <span className={styles.breakqty}>
                            Quantity: {docu.qty}{" "}
                          </span>
                          <br />
                          <span>Sales Price: ${docu.salesPrice}</span>
                          <br />

                          <span>
                            Profit (%):{" "}
                            <span
                              style={
                                docu.netProfit > 0
                                  ? { color: "#1f9751" }
                                  : { color: "red" }
                              }
                            >
                              {docu.profitPercentage.toFixed(2)}%
                            </span>
                          </span>
                          <br />
                          <span>
                            Profit Per Item: $
                            {(docu.netProfit / docu.qty).toFixed(2)}
                          </span>
                        </span>
                      </section>
                    </section>
                  </>
                );
              }
            })}
        </section>

        <button onClick={() => deleteDocument(transaction.id)}>x</button>

        {showModal && (
          <section className={styles.section2}>
            <ProfitsModal
              documents={documents}
              key={transaction.id}
              cost={transaction.amount}
              asin={transaction.asin}
              showModal={setShowModal}
            />
          </section>
        )}
      </div>
    </>
  );
}
