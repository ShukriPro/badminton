import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const PlayerBoard = () => {
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playersRef = collection(db, "badminton", id, "players");
        const snapshot = await getDocs(playersRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Players data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div>
      <h1>Player Board</h1>
    </div>
  );
};

export default PlayerBoard;
