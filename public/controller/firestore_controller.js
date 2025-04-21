import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    doc,
    where,
    deleteDoc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { app } from "./firebase_core.js";
import { InventoryItem } from "../model/InventoryItem.js";
import { currentUser } from "./firebase_auth.js";

const db = getFirestore(app);

const COLLECTION_MESSAGE_FROM = 'inventory';

export async function addItem(item) {
    const collRef = collection(db, COLLECTION_MESSAGE_FROM);
    const docRef = await addDoc(collRef, item);
    return docRef.id;
}

export async function getItemsList() {
    let itemList = [];
    const q = query(collection(db, COLLECTION_MESSAGE_FROM),
        where('email', '==', currentUser.email),
        orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const m = doc.data();
        const message = new InventoryItem(m);
        message.set_docId(doc.id);
        itemList.push(message);
    });
    return itemList;


}

export async function deleteItemById(docId) {
    const docRef = doc(db, COLLECTION_MESSAGE_FROM, docId);
    await deleteDoc(docRef);

}

export async function updateItemById(docId, update) {
    // update = {title: 'new title', contents: 'new contents'}
    const docRef = doc(db, COLLECTION_MESSAGE_FROM, docId);
    await updateDoc(docRef, update);


}