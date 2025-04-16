import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js"

import { app } from './firebase_core.js';
import { router } from "./app.js";
import { glHomeModel } from "./HomeController.js";


const auth = getAuth(app);

export let currentUser = null;

export async function loginFirebase(email, password) {

    await signInWithEmailAndPassword(auth, email, password);

}

export async function logoutFirebase() {
    await signOut(auth);
}

onAuthStateChanged(auth, user => {
    const loginDiv = document.getElementById('loginDiv');
    const navMenu = document.getElementById('navMenuContainer');
    const spaRoot = document.getElementById('spaRoot');
    const loginInfo = document.getElementById('loginInfo');

    currentUser = user;

    if (user) {
        console.log('AuthStateChanged: User logged in', user.email);
        const loginDiv = document.getElementById('loginDiv');
        loginDiv.classList.replace('d-block', 'd-none');
        // Show nav buttons when logged in
        const navButtons = document.querySelectorAll('#navMenuContainer .nav-item');
        navButtons.forEach(btn => btn.classList.remove('d-none'));
        const spaRoot = document.getElementById('spaRoot');
        spaRoot.classList.replace('d-none', 'd-block');
        if (loginInfo) loginInfo.innerHTML = user.email;
        localStorage.setItem('loggedInUser', user.email);
        router.navigate(window.location.pathname);
    } else {
        console.log('AuthStateChanged: User logged out');
        const loginDiv = document.getElementById('loginDiv');
        loginDiv.classList.replace('d-none', 'd-block');
        // Hide nav buttons when logged out
        const navButtons = document.querySelectorAll('#navMenuContainer .nav-item');
        navButtons.forEach(btn => btn.classList.add('d-none'));
        const spaRoot = document.getElementById('spaRoot');
        spaRoot.classList.replace('d-block', 'd-none');
        router.currentView = null;
        spaRoot.innerHTML = '';  // claer the view
        if (loginInfo) loginInfo.innerHTML = 'No User';
        localStorage.removeItem('loggedInUser');
        glHomeModel.reset();
    }

});

export async function createAccount(email, password) {
    await createUserWithEmailAndPassword(auth, email, password);
}