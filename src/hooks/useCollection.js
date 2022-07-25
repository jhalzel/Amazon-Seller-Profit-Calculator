import { useEffect, useState, useRef } from "react";
import { database } from "../firebase/config";

//firestore imports
import {
  collection,
  where,
  orderBy,
  onSnapshot,
  query,
} from "firebase/firestore";

export const useCollection = (collec, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  const q = useRef(_query).current;
  const orderby = useRef(_orderBy).current;

  useEffect(() => {
    let ref = collection(database, collec);

    //queries

    if (q) {
      ref = query(ref, where(...q));
    }
    if (orderby) {
      ref = query(ref, orderBy(...orderby));
    }

    //Real-time_Listener
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          // console.log("doc:", doc);
          results.push({ ...doc.data(), id: doc.id });
        });

        // console.log(results)

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [collec, q, orderby]);

  return { documents, error };
};
