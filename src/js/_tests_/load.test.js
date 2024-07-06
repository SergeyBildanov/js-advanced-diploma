
import GameStateService from "../GameStateService";
import GameState from "../GameState";
import GamePlay from "../GamePlay";

jest.mock("../GameStateService");
jest.mock("../GameState");

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
test("game state loading success", ()=>{
    let storage = localStorage
    let stateService = new GameStateService(storage);
    stateService.save(GameState.from("user", [], "arctic"));
    stateService.load();
    expect(stateService.load.mock.results[0].value).toBe(GameState.from("user", [], "arctic"));
})