import { db } from "../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

const dummyPlayers = [
  { firstName: "John", lastName: "Doe", gender: "male", level: "beginner" },
  { firstName: "Alice", lastName: "Smith", gender: "female", level: "intermediate" },
  { firstName: "Bob", lastName: "Lee", gender: "male", level: "advanced" },
  { firstName: "Sara", lastName: "Khan", gender: "female", level: "beginner" }
];

export async function createDummyPlayers() {
  const userId = localStorage.getItem("userId");
  if (!userId) return console.error("userId not found");

  for (const player of dummyPlayers) {
    const id = crypto.randomUUID();
    const playerRef = doc(collection(db, "badminton", userId, "players"), id);
    await setDoc(playerRef, { id, ...player });
  }

  console.log("✅ Dummy players created");
}
