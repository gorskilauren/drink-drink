import { App } from "cdktf";

require("dotenv").config();
import { DrinkDrink } from "./DrinkDrink";

const app = new App();
new DrinkDrink(app, "DrinkDrink");

app.synth();
