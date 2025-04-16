import { HomeModel } from "../model/HomeModel.js";

export const glHomeModel= new HomeModel();

export class HomeController{
    // instance members
    model = null;
    view = null;

    constructor(){
        this.model = glHomeModel;
        this.onClickCreateButton = this.onClickCreateButton.bind(this);
    }

    setView(view){
        this.view = view;
    }

    onClickCreateButton(){
        console.log('create item button pressed');
    }
}