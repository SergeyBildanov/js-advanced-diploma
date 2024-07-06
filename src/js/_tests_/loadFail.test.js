
import GameStateService from "../GameStateService";
import GameState from "../GameState";
import GamePlay from "../GamePlay";


jest.mock("../GamePlay");
class LocalStorageMock {
    constructor() {
      this.store = {};
    }
  
    clear() {
      this.store = {};
    }
  
    getItem(key) {
      return this.store[key] || null;
    }
  
    setItem(key, value) {
      this.store[key] = String(value);
    }
  
    removeItem(key) {
      delete this.store[key];
    }
  }
  
let localStorage = new LocalStorageMock();
test("game state loading failure", ()=>{
    
    let storage = localStorage;
    let stateService = new GameStateService(storage);
    stateService.load();
    expect(GamePlay.showMessage).toHaveBeenCalledWith(new Error("Invalid state").message);
})