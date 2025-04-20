import { AbstractView } from "./AbstractView.js";
import { currentUser } from "../controller/firebase_auth.js";
import { getItemsList } from "../controller/firestore_controller.js";
import { startSpinner, stopSpinner } from "./util.js";

export class HomeView extends AbstractView {
    // instance variables
    controller = null;
    constructor(controller) {
        super();
        this.controller = controller;
    }

    async onMount() {


        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied</h1>';
            return;
        }
        console.log('HomeView.onMount called ');

        startSpinner();
        try {
            this.controller.model.itemList = await getItemsList();
            stopSpinner();

        } catch (error) {
            stopSpinner();
            this.controller.model.messageList = null;
            console.error('Error getting item list: ', error);
            alert('Error getting item list: ' + error);

        }
        console.log('Item List ', this.controller.model.itemList);

        // Call updateView and attachEvents after mounting
        const viewContent = await this.updateView();
        this.parentElement.appendChild(viewContent);
        this.attachEvents();
    }

    async updateView() {
        console.log('HomeView.updateView() called');
        const viewWrapper = document.createElement('div');
        try {
            const response = await fetch('/view/templates/home.html', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            viewWrapper.innerHTML = await response.text();

            // const tbody = viewWrapper.querySelector('tbody');
            const noMessage = viewWrapper.querySelector('#message');
            if (noMessage) noMessage.classList.add('d-none');
    
            // Show the message again when all items are removed
            // if (displayArea.children.length === 0 && noMessage) {
            //     noMessage.classList.remove('d-none');
            //   }


            const displayArea = viewWrapper.querySelector('#inventoryDisplayArea');
            displayArea.innerHTML = '';
            const messageList = this.controller.model.itemList;
            if (messageList === null) {
                // const div = document.createElement('div');
                // displayArea.innerHTML = '<h1> Error loading items list from Firestore </h1>';
                noMessage.classList.remove('d-none');
                // tbody.appendChild(div);
            } else if (messageList.length === 0) {
                // const div = document.createElement('div');
                // displayArea.innerHTML = '<h1> No inventory items added </h1>';
                noMessage.classList.remove('d-none');
                // tbody.appendChild(div);

            } else {
                messageList.forEach(message => {
                    const tr = this.#buildMessageRow(message);
                    displayArea.appendChild(tr);

                });
            }
        } catch (e) {
            console.error('Error loading home.html: ', e);
            alert('Error loading home.html: ' + e);
            viewWrapper.innerHTML = '<h2>Error loading the home page content.</h2>';
        }




        return viewWrapper;
    }

    #buildMessageRow(message) {

        const container = document.createElement('div');
      container.className = "p-3 mb-3 bg-white shadow-sm rounded";

      container.innerHTML = `
        <div class="fw-bold mb-2" >${message.name}</div>
        <div class="d-flex align-items-center gap-2" id = "${message.docId}">
          <button class="btn btn-outline-danger" id ="subQty${message.docId}">-</button>
          <span id ="quantity${message.docId}">${message.quantity}</span>
          <button class="btn btn-outline-primary" id ="addQty${message.docId}">+</button>
          <button class="btn btn-outline-primary" id ="update${message.docId}" >Update</button>
          <button class="btn btn-outline-secondary" id = "cancel${message.docId}">Cancel</button>
        </div>
      `;

      const subBtn = container.querySelector(`#subQty${message.docId}`);
      const addBtn = container.querySelector(`#addQty${message.docId}`);
      const updateBtn = container.querySelector(`#update${message.docId}`);
      const cancelBtn = container.querySelector(`#cancel${message.docId}`);
      const quantitySpan = container.querySelector(`#quantity${message.docId}`);

      subBtn.onclick = this.controller.onClickCardAny;
      addBtn.onclick = this.controller.onClickCardAny;
      updateBtn.onclick = this.controller.onClickCardAny;
      cancelBtn.onclick = this.controller.onClickCardAny;
      quantitySpan.onclick = this.controller.onClickCardAny;



      

      return container;


    }

    attachEvents() {
        console.log('HomeView.attachEvents() called');
        const CreateButton = document.getElementById('createinventoryitem');
        if (createForm) {
            createForm.onsubmit = (event) => {
                event.preventDefault(); // prevent page reload
                this.controller.onClickCreateButton(event); // call your controller logic
            };}
       // CreateButton.onclick = this.controller.onClickCreateButton;
    }

    async onLeave() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied</h1>';
            return;
        }
        console.log('HomeView.onLeave() called');
    }


}