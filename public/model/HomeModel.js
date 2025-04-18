export class HomeModel {
    itemList = [];

    getItemList() {
        return this.itemList;
    }

    addItem(item) {
        // Insert item in ascending order by name
        let index = this.itemList.findIndex(i => i.name > item.name);
        if (index === -1) {
          this.itemList.push(item); // insert at end
        } else {
          this.itemList.splice(index, 0, item); // insert at the right position
        }
      }
    getItemByName(name) {
        return this.itemList.find(item => item.name.toLowerCase() === name.toLowerCase());
    }
    getItemByID(docId) {
        return this.itemList.find(item => item.docId === docId);
    }
    removeItemByID(docId) {
      let newitemList = [];
      for(let item of this.itemList ){
        if(item.docId != docId){
          newitemList.push(item);
        }
      }
      this.reset();
      this.itemList = newitemList;
        // this.itemList.filter(item => item.id != docId);

      }

      updateItem(update){
        const index = this.itemList.findIndex(item => item.docId === update.docId);
        if (index !== -1) {
          this.itemList[index] = {
            ...this.itemList[index], // keep any existing fields
            quantity: update.quantity,
            timestamp: update.timestamp
          };
        }
    }

    reset() {
        this.itemList = [];
    }


}