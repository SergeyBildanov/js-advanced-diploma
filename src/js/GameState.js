export default class GameState {
  constructor(turn,positions,theme){
    this.turn = turn;
    this.positions = positions;
    this.theme = theme;
  }
  static from(object) {
    if(object){
      return new GameState(object.turn, object.positions, object.theme);
    }
    return null;
  }
}
