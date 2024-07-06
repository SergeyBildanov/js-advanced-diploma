import GamePlay from "./GamePlay";

export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      if(!this.storage.getItem("state")){
        throw new Error('Invalid state');
      }
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      GamePlay.showMessage(e.message);
    }
  }
}
