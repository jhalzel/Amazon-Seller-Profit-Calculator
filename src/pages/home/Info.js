import { useState, React } from "react";

import styles from "./Home.module.css"

export default function Info() {
    const [showModal, setShowModal] = useState(false)
    const [button, setButton] = useState(true)

    const handleClick = () => {
        showModal ? setShowModal(false) : setShowModal(true)
    }


  return (
    <div>
        <button onClick={()=> setShowModal(!showModal)}>Info</button>
        {showModal && (
            <section className={styles.infosection}>
                <button className={styles.innerButton} onClick={()=> setShowModal(false)}>x</button>
                <div className={styles.infocontent}>
                    <h2>About</h2>
                    <p>This webpage is to be used to calculate and keep track of changes of your profits and margin for Amazon Sellers</p>
                </div>
            </section> 
        )}
             
    </div>
  )
}