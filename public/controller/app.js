import { HomeView } from "../view/HomeView.js";
import { ProfileView } from "../view/ProfileView.js";
import { HomeController } from "./HomeController.js";
import { ProfileController } from "./ProfileController.js";
import { Router } from "./Router.js";
import {createAccount, loginFirebase, logoutFirebase} from './firebase_auth.js';
import { startSpinner, stopSpinner } from "../view/util.js";


document.getElementById('appHeader').textContent = 'My Inventory Manager'
document.title = 'App Template' ;

const routes =  [
    {path: '/', view: HomeView, controller: HomeController},
    {path: '/profile', view: ProfileView, controller: ProfileController}
];

// create an instance of Router
export const router = new Router(routes);
router.navigate(window.location.pathname);

const menuItems = document.querySelectorAll('a[data-path]');
menuItems.forEach(item => {
    item.onclick = function(e) {
        const path = item.getAttribute('data-path');
        router.navigate(path);
    }
});

// login form event listener
document.forms.loginForm.onsubmit = async function(e){
    e.preventDefault();  // prevent from page reload
    const email = e.target.email.value;
    const password = e.target.password.value;
    startSpinner();
    try {
        await loginFirebase(email, password);
        stopSpinner();
        console.log('User logged in', email);
    } catch(e){
        stopSpinner();
        console.error('Error logging in:',e);
        const errorCode = e.code;
        const errorMessage = e.message;
        alert('Sign in failed: '+ e.code + ',' + e.message);

    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginInfo = document.getElementById('loginInfo');
    const navMenu = document.getElementById('navMenuContainer');
    const spaRoot = document.getElementById('spaRoot');
    const loginDiv = document.getElementById('loginDiv');

    // Show "No User" by default
    if (loginInfo) loginInfo.innerHTML = 'No User';

    // Show only the login page initially
// Always show navbar with "No User"
if (navMenu) navMenu.classList.remove('d-none');

// Hide nav buttons (but not loginInfo)
const navButtons = document.querySelectorAll('#navMenuContainer .nav-item');
navButtons.forEach(btn => btn.classList.add('d-none'));
    if (spaRoot) spaRoot.classList.replace('d-block', 'd-none');
    if (loginDiv) loginDiv.classList.replace('d-none', 'd-block');
});


//logout button
document.getElementById('logoutButton').onclick= async function(e){
    startSpinner();
    try{
        await logoutFirebase();
        stopSpinner();
        console.log('User logged out');
    } catch(e){
        stopSpinner();
        console.error('Error looging out:', e);
        const errorCode = e.code;
        const errorMessage = e.message;
        alert('Sign out failed: '+ e.code + ',' + e.message);

    }
}

//create account event
document.forms.createAccountForm.onsubmit = async function(e){
    e.preventDefault(); //prevent from page reload
    const email = e.target.email.value;
    const emailConfirm = e.target.emailConfirm.value;
    if(email !== emailConfirm){
        alert('Emails do not match');
        return;
    }
    const password = e.target.password.value;
    startSpinner();
    try{
        await createAccount(email, password);
        stopSpinner();
        console.log('user account created', email);
        document.getElementById('createAccountDiv').classList.replace('d-block', 'd-none');

    }catch(e){
        stopSpinner();
        console.error('Error creating account:', e);
        const errorCode = e.code;
        const errorMessage = e.message;
        alert('create account failed:', +e.code + ','+e.message);
    }
}

//show create account form / hide login form
document.getElementById('goToCreateAccount').onclick = function(e){
    document.getElementById('loginDiv').classList.replace('d-block', 'd-none');
    document.getElementById('createAccountDiv').classList.replace('d-none', 'd-block');
    document.forms.createAccountForm.reset();
}

//hide create account form / show login form

document.getElementById('goToLogin').onclick = function(e){
    document.getElementById('loginDiv').classList.replace('d-none', 'd-block');
    document.getElementById('createAccountDiv').classList.replace('d-block', 'd-none');
}