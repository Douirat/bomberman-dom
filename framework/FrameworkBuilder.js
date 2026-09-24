import { Framework } from "./Framework.js";

export class FrameworkBuilder{
#framework
constructor(){
    this.#framework = new Framework("root");
}

route(path, component){
    this.#framework.addRoute(path, component);
    return this;
}

build(){
    return this.#framework;
}

}