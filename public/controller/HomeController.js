import { HomeModel } from "../model/HomeModel.js";
import { InventoryItem } from "../model/InventoryItem.js";
import { startSpinner, stopSpinner } from "../view/util.js";
import { currentUser } from "./firebase_auth.js";
import { addItem, deleteItemById, updateItemById } from "./firestore_controller.js";

export const glHomeModel = new HomeModel();

export class HomeController {
  // instance members
  model = null;
  view = null;

  constructor() {
    this.model = glHomeModel;
    this.onClickCreateButton = this.onClickCreateButton.bind(this);
    this.onClickCardAny = this.onClickCardAny.bind(this);
  }

  setView(view) {
    this.view = view;
  }
  async onClickCardAny(e) {
    const id = e.target.id;
    let docId = "";

    if (id.startsWith("subQty")) {
      let red = parseInt(e.target.nextElementSibling.innerHTML);
      if (red == 0) { alert("Cannot reduce item count below zero"); return; }
      e.target.nextElementSibling.innerHTML = red - 1;


    } else if (id.startsWith("addQty")) {
      e.target.previousElementSibling.innerHTML = parseInt(e.target.previousElementSibling.innerHTML) + 1;

    } else if (id.startsWith("update")) {
      docId = id.replace("update", "");
      const update = new InventoryItem(this.model.getItemByID(docId));
      update.set_docId(docId);
      update.quantity = parseInt(e.target.previousElementSibling.previousElementSibling.innerHTML);

      // startSpinner();
      try {
        if (update.quantity == 0) {
          if (!confirm('Are you sure to delete permanently?')) return;
          await deleteItemById(docId);
          // e.target.parentElement.parentElement.remove(e.target.parentElement.id)
          this.model.removeItemByID(docId);



        }
        else {
          await updateItemById(docId, update.toFirestore());
          this.model.updateItem(update);
          alert("Item quantity updated")
        }


        // this.model.updateMessage(message,update.toFirestore())
        // bootstrap.Modal.getInstance('#modalEditMessage').hide();

        // stopSpinner();
        this.view.render();


      } catch (error) {
        // stopSpinner();
        console.error('Error updating/deleting item: ', error);
        alert('Error updating/deleting item: ' + error);

      }


    } else if (id.startsWith("cancel")) {
      this.view.render();

    } else {
      console.warn("Unrecognized button ID:", id);
    }


  }
  async onClickCreateButton(e) {
    e.preventDefault();
    console.log('create item button pressed');

    // const name = this.model.name;




    console.log('HomeController.onSubmitCreateMessage() called');
    const name = e.target.previousElementSibling.value.toLowerCase();



    if (!e.target.parentElement.parentElement.checkValidity()) {

      return;
    }

    if (this.model.getItemByName(name)) {
      alert(name + " already exists. Update quantity instead");
      return;

    }

    e.target.innerHTML = "wait...";
    e.target.disabled = true;
    e.target.previousElementSibling.value = '';
    const email = currentUser.email;
    const timestamp = Date.now();  // # of ms since 1970, jan 1
    const quantity = 1;
    const data = { name, quantity, timestamp, email };
    const item = new InventoryItem(data);


    startSpinner();
    try {
      const docId = await addItem(item.toFirestore());
      stopSpinner();
      item.set_docId(docId);




    } catch (error) {
      // e.target.innerHTML = "Create";
      stopSpinner();
      console.error('Error adding item: ', error);
      alert('Error adding item ' + error);

    }
    e.target.disabled = false;
    e.target.innerHTML = "Create";
    this.model.addItem(item);
    this.view.render();


  }
}