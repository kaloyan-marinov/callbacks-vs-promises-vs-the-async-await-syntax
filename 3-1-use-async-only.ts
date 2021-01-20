import { getFruit, getFruitWithoutAsync } from "./3-0-utilities";

getFruit("peach").then((v) => console.log(`3-1-*.js - ${v}`));

getFruitWithoutAsync("pineapple").then((v) => console.log(`3-1-*.js - ${v}`));
