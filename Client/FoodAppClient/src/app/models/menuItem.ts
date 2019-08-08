import { Data } from './data';

export class MenuItem{
    name:string;
    data:Data;
    /**
     *
     */
    constructor() {
       this.name = "";
       this.data = new Data();
    }
}