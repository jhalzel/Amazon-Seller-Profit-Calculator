import { useFirestore } from "../../hooks/useFirestore";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

//styles
import styles from "./Home.module.css";

export default function ProfitsModal({ cost, asin, showModal, documents }) {
  const { addDocument, response } = useFirestore("profits");
  const { deleteDocument } = useFirestore("profits");
  const { user } = useAuthContext();
  const [qty, setQty] = useState(1);
  const [amazonFees, setAmazonFees] = useState(0);
  const [fulfillCost, setFulfillCost] = useState(0);
  const [shipFromFBA, setShipFromFBA] = useState(0);
  const [shipToFBA, setShipToFBA] = useState(0);
  const [shipFromFBM, setShipFromFBM] = useState(0);
  const [shipToFBM, setShipToFBM] = useState(0);
  const [storageCost, setStorageCost] = useState(0);
  const [salesPrice, setSalesPrice] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [margin, setMargin] = useState(0);
  const [fba, setFba] = useState(false);
  const [fbm, setFbm] = useState(false);
  const [totalShipping, setTotalShipping] = useState(0);
  const [totalFees, setTotalFees] = useState(0);

  useEffect(() => {
    setNetProfit(salesPrice * qty - totalCosts);

    setTotalCosts(
      (Number(cost) +
        Number(amazonFees) +
        Number(fulfillCost) +
        Number(storageCost) +
        Number(shipToFBM)) *
        qty +
        //  Shipping from suppliers &
        // shipping to FBA is a one time cost
        Number(shipFromFBM) +
        Number(shipFromFBA) +
        Number(shipToFBA)
    );

    setTotalShipping(
      Number(shipFromFBA) +
        Number(shipFromFBM) +
        Number(shipToFBA) +
        Number(shipToFBM)
    );

    setTotalFees(
      Number(amazonFees) + Number(fulfillCost) + Number(storageCost)
    );

    setMargin((netProfit / totalCosts) * 100);
  }, [
    cost,
    shipFromFBA,
    shipToFBA,
    shipFromFBM,
    shipToFBM,
    storageCost,
    fulfillCost,
    amazonFees,
    salesPrice,
    totalCosts,
    qty,
    totalFees,
    totalShipping,
    netProfit,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //delete existing calculations in current ASIN
    if (documents) {
      documents.forEach((d) => {
        if (d.asin === asin) {
          deleteDocument(d.id);
        }
      });
    }
    // add/replace profit calculation
    addDocument({
      uid: user.uid,
      asin,
      totalCosts,
      profitPercentage: margin,
      netProfit,
      salesPrice,
      totalFees,
      totalShipping,
      qty,
    });
    showModal();
  };

  return (
    <section className={styles.profits}>
      <form onSubmit={handleSubmit}>
        <section>
          <label>
            <h3>Cost of Item ($): {cost}</h3>
          </label>

          <br />
          <h4>Fees: </h4>

          <label for="amazonFees">
            <span>
              Amazon Fees:
              <input
                id="amazonFees"
                type="number"
                step={0.01}
                onChange={(e) => {
                  setAmazonFees(e.target.value);
                }}
              />
            </span>
          </label>
          <br />

          <label for="fulfill-cost">
            <span>
              Fulfillment Cost:
              <input
                type="number"
                step={0.01}
                name="fulfill-cost"
                id="fulfill-cost"
                onChange={(e) => {
                  setFulfillCost(e.target.value);
                }}
              />
            </span>
          </label>
          <br />
          <label for="storageCost">
            <span>
              Storage Cost:
              <input
                type="number"
                step={0.01}
                name="fulfill-cost"
                id="storageCost"
                onChange={(e) => {
                  setStorageCost(e.target.value);
                }}
              />
            </span>
          </label>
        </section>
        <br />
        <section>
          <h4>Shipping Costs ($):</h4>
          <label for="shipping">
            <span className={styles.shipping}>
              Shipping:
              <select
                onChange={(e) => {
                  let val = e.target.value;
                  if (val === "fba") {
                    setFba(true);
                    setFbm(false);
                  } else if (val === "fbm") {
                    setFbm(true);
                    setFba(false);
                  } else {
                    setFba(false);
                    setFbm(false);
                  }
                }}
              >
                <option value="" key=""></option>
                <option value="fba" key="fba">
                  FBA
                </option>
                <option value="fbm" key="fbm">
                  FBM
                </option>
              </select>
            </span>
          </label>
          {(fba && (
            <label for="fbaLabel">
              <span>
                From Supplier:
                <input
                  type="number"
                  step={0.01}
                  id="fbaLabel"
                  name="fbaLabel"
                  onChange={(e) => setShipFromFBA(e.target.value)}
                />
              </span>
              <br />
              <span>
                To Amazon:
                <input
                  type="number"
                  step={0.01}
                  id="fbaLabel"
                  name="fulfillment"
                  onChange={(e) => {
                    setShipToFBA(e.target.value);
                    console.log(shipToFBA);
                  }}
                />
              </span>
            </label>
          )) ||
            (fbm && (
              <label for="fbmLabel">
                <span>
                  From Supplier:
                  <input
                    type="number"
                    step={0.01}
                    id="fbmLabel"
                    name="fbaLabel"
                    onChange={(e) => {
                      setShipFromFBM(e.target.value);
                    }}
                  />
                </span>
                <br />
                <span>
                  To Customer:
                  <input
                    type="number"
                    step={0.01}
                    id="fbmLabel"
                    name="fulfillment"
                    onChange={(e) => {
                      setShipToFBM(e.target.value);
                    }}
                  />
                </span>
              </label>
            ))}
        </section>
        <br />
        <section>
          <label>
            <span>
              Sales Price:
              <input
                type="number"
                step={0.01}
                required
                onChange={(e) => setSalesPrice(e.target.value)}
              />
            </span>
            <br />
            <span>
              {" "}
              Quantity:
              <input
                type="number"
                step={1}
                required
                onChange={(e) => setQty(e.target.value)}
              />
            </span>
          </label>
        </section>
        <br />
        <section className={styles.display}>
          <span>Net Cost: ${totalCosts.toFixed(2)}</span>{" "}
          <span>Net Profit: ${netProfit.toFixed(2)} </span>
          <span className={styles.profDisplay}>
            Profit (%):&nbsp;&nbsp;
            <h1 className={netProfit >= 0 ? styles.green : styles.red}>
              {margin.toFixed(1)}%
            </h1>
          </span>
        </section>
        {/* button  */}
        <span className={styles.addT}>
          <button>Submit Details</button>
        </span>
      </form>
    </section>
  );
}
