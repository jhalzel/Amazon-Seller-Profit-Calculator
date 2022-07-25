// This hook is used to add, delete, or update documents in our firestoredatabase

import { useReducer, useEffect, useState } from "react";
import { database } from "../firebase/config";

//firestore imports
import {
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFirestore = (collec) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [cancelled, setCancelled] = useState(false);

  //collection reference
  const ref = collection(database, collec); //collection of transactions

  //only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  //add a document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const createdAt = serverTimestamp();

      const addedDoc = await addDoc(ref, { ...doc, createdAt });

      dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDoc });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  //delete a document
  const deleteDocument = async (id) => {
    const docRef = doc(database, collec, id);

    dispatch({ type: "IS_PENDING" });

    try {
      await deleteDoc(docRef);
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { addDocument, deleteDocument, response };
};
