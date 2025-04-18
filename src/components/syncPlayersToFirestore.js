import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

export async function syncPlayersToFirestore() {
  const players = JSON.parse(localStorage.getItem("players")) || [];
  const userId = localStorage.getItem("userId");
  if (!userId) return console.error("❌ userId not found");

  let syncedCount = 0;

  for (const player of players) {
    if (!player.id) continue;

    const ref = doc(collection(db, "badminton", userId, "players"), player.id);
    const existing = await getDoc(ref);

    if (existing.exists()) continue; // skip if already exists

    try {
      await setDoc(ref, player);
      syncedCount++;
    } catch (err) {
      console.error("❌ Failed to sync player:", player, err);
    }
  }

  console.log(`✅ ${syncedCount} new players synced to Firestore`);
}
