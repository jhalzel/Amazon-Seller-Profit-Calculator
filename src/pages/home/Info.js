import { useState, React } from "react";

import styles from "./Home.module.css"

export default function Info() {
    const [showModal, setShowModal] = useState(false)
    const [text, setText] = useState("Info")

    const handleClick = () => {
        // showModal ? setShowModal(false) : setShowModal(true)
        if (showModal) {
            setShowModal(false)
            setText("Info")
        }
        else {
            setShowModal(true)
            setText('x')
        }
    }

  return (
    <div>
        <button onClick={()=>handleClick()}>{text}</button>
        {showModal && (
            <section>
                <div>
                    <h1>About</h1>
                    <p>This webpage is to be used to calculate and keep track of changes of your profits and margin for Amazon Sellers
                    To add a transaction, input the name of the product,the ASIN, and cost of the item on Amazon
                When you submit that info a transaction card will pop up in the center of the screen
                If you hove over the transaction card and click, there will be more input options for you to add more details dynamically as you discover costs of the item</p>
                </div>
            </section> 
        )}
             
    </div>
  )
}