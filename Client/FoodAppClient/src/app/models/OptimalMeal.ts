import { Dish } from './dish';

export class OptimalMeal{
    status:string;
    calories:number;
    consumable:Dish[];
    /**
     *
     */
    constructor() {
       this.status = "";
       this.calories = 0;
       this.consumable = [];
    }
}