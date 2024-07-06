import themes from "./themes.js"
import cursors from "./cursors.js";
import Bowman from "./characters/Bowman.js";
import Daemon from "./characters/Daemon.js";
import Swordsman from "./characters/Swordsman.js";
import Magician from "./characters/Magician.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js"
import PositionedCharacter from "./PositionedCharacter.js";
import GamePlay from "./GamePlay.js";
import { generateTeam } from "./generators.js";
import GameState from "./GameState.js";
export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positions = [];
    this.theme = themes.prairie;
    this.points = 0;
    this.turn;
  }

  init() {
    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Daemon, Undead, Vampire];
    this.theme = themes.prairie;
    this.turn = "user";
    this.gamePlay.drawUi(this.theme);
    let teamGood = generateTeam(playerTypes, 2, 2);
    let teamEvil = generateTeam(enemyTypes, 2, 2);
    let positionNumbers = [];
    this.positions = [];
    for (let i = 0; i < teamGood.characters.length; i++) {
      let position;
      do {
        position = Math.floor(Math.random() * 64);
      } while (position % 8 !== 0 && position % 8 !== 1 || positionNumbers.indexOf(position) !== -1);
      positionNumbers.push(position);
    }
    for (let i = 0; i < positionNumbers.length; i++) {
      this.positions.push(new PositionedCharacter(teamGood.characters[i], positionNumbers[i]))
    }
    positionNumbers = [];
    for (let i = 0; i < teamEvil.characters.length; i++) {
      let position;
      do {
        position = Math.floor(Math.random() * 64);
      } while (position % 8 !== 6 && position % 8 !== 7 || positionNumbers.indexOf(position) !== -1);
      positionNumbers.push(position)
    }
    for (let i = 0; i < positionNumbers.length; i++) {
      this.positions.push(new PositionedCharacter(teamEvil.characters[i], positionNumbers[i]))
    }
    this.gamePlay.redrawPositions(this.positions);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
  }
  onCellClick(index) {
    const enemyTypes = [Daemon, Undead, Vampire];
    if(this.turn === "user"){
      if (this.gamePlay.cells[index].firstChild && (this.gamePlay.cells[index].firstChild.classList.contains("bowman") || this.gamePlay.cells[index].firstChild.classList.contains("swordsman") || this.gamePlay.cells[index].firstChild.classList.contains("magician"))) {
        this.clearSelected();
        this.gamePlay.selectCell(index);
      }
      if (this.returnSelectedCharacter()) {
        if (this.gamePlay.cells[index].classList.contains("selected-green") && !this.gamePlay.cells[index].firstChild) {
          let oldPosition = this.gamePlay.cells.indexOf(this.returnSelectedCharacter());
          for (let position of this.positions) {
            if (position.position === oldPosition) {
              position.position = index;
            }
          }
          this.gamePlay.redrawPositions(this.positions);
          this.gamePlay.selectCell(index);
          this.gamePlay.deselectCell(oldPosition);
          this.turn = "enemy";
        }
        if (this.gamePlay.cells[index].classList.contains("selected-red")) {
          (async ()=>{
            
            let charPosition = this.gamePlay.cells.indexOf(this.returnSelectedCharacter());
            let ally;
            let enemy;
            for (let pos of this.positions) {
              if (pos.position === charPosition) {
                ally = pos;
              }
              if (pos.position === index) {
                enemy = pos;
              }
            }
            
            let damage = Math.max(ally.character.attack - enemy.character.defence, ally.character.attack * 0.1);
            enemy.character.health -= damage;
            await this.gamePlay.showDamage(index, Math.max(ally.character.attack - enemy.character.defence, ally.character.attack * 0.1));
            if(enemy.character.health <= 0){
              this.positions = this.positions.filter((pos)=>pos !== enemy);
              if(!this.isEnemyTeamAlive()){
                for(let pos of this.positions){
                  pos.character.attack = Math.max(pos.character.attack, pos.character.attack * (80 + pos.character.health) / 100)
                  pos.character.defence = Math.max(pos.character.defence, pos.character.defence * (80 + pos.character.health) / 100)
                  pos.character.health += 80;
                  if(pos.character.health > 100){
                    pos.character.health = 100;
                  }
                  pos.character.level += 1;
                }
                this.points += 1;
                let keys = Object.keys(themes);
                let i = keys.indexOf(this.theme);
                this.theme = themes[keys[(i+1)%4]];
                this.gamePlay.drawUi(this.theme);
                let teamEvil = generateTeam(enemyTypes, 2, 2);
                let positionNumbers = [];
                for (let i = 0; i < teamEvil.characters.length; i++) {
                  let position;
                  do {
                    position = Math.floor(Math.random() * 64);
                  } while (position % 8 !== 6 && position % 8 !== 7 || positionNumbers.indexOf(position) !== -1 || this.gamePlay.cells[position].firstChild);
                  positionNumbers.push(position)
                }
                let positionedEvil = [];
                for (let i = 0; i < positionNumbers.length; i++) {
                  positionedEvil.push(new PositionedCharacter(teamEvil.characters[i], positionNumbers[i]))
                }
                this.positions = [...this.positions, ...positionedEvil];
                this.gamePlay.redrawPositions(this.positions);
              }
            }
            else {
              for (let pos of this.positions) {
                if (pos.position === enemy.position) {
                  pos = enemy;
                }
              }
            }
            
            this.gamePlay.redrawPositions(this.positions);
            this.turn = "enemy";


            
          })();
          
            
        }
        

        else if (!this.gamePlay.cells[index].firstChild) {
          GamePlay.showError("Вы пытаетесь выбрать пустую клетку");
        }
        else if (!this.returnSelectedCharacter() && this.gamePlay.cells[index].firstChild && ["daemon", "undead", "vampire"].some(className => this.gamePlay.cells[index].firstChild && this.gamePlay.cells[index].firstChild.classList.contains(className))) {
          GamePlay.showError("Вы пытаетесь выбрать вражеского персонажа");
        }
    }
  }
  if(this.turn === "enemy"){
      let teamGood = [];
      let teamEvil = [];
      for(let pos of this.positions){
        if(["bowman", "swordsman", "magician"].includes(pos.character.type)){
          teamGood.push(pos);
        }
        else{
          teamEvil.push(pos);
        }
      }
      let maxAttack = 0;
      let minDefense = Infinity;
      let enemyCharacter, goodCharacter;
      for(let enemy of teamEvil){
        if(enemy.character.attack > maxAttack){
          maxAttack = enemy.character.attack;
          enemyCharacter = enemy;
        }
      }
      for(let friend of teamGood){
        if(friend.character.defence < minDefense){
          minDefense = friend.character.defence;
          goodCharacter = friend;
        }
      }
      
      if (enemyCharacter.character.type === "daemon") {
        if (this.canMagicianAttack(enemyCharacter.position, goodCharacter.position)) {
          (async () => {
            let damage = Math.max(enemyCharacter.character.attack - goodCharacter.character.defence, enemyCharacter.character.attack * 0.1);
            await this.gamePlay.showDamage(goodCharacter.position, damage);
            
            goodCharacter.character.health -= damage;
            if(goodCharacter.character.health < 0){
              this.positions = this.positions.filter((pos)=>pos !== goodCharacter);
            }
            else{
              for (let pos of this.positions) {
              if (pos.position === goodCharacter.position) {
                pos = goodCharacter;
              }
            }
          }
           
            this.gamePlay.redrawPositions(this.positions);
            this.turn = "user";
          })();
        }
        else {
          let available = []
          for (let i = 0; i < 63; i++) {
            if (this.canMagicianMove(enemyCharacter.position, i) && !this.gamePlay.cells[i].firstChild) {
              available.push(i);
            }
          }
          let to = available[0];
          let x0 = Math.abs(to % 8 - enemyCharacter.position % 8);
          let y0 = Math.abs(Math.floor(to / 8) - Math.floor(enemyCharacter.position / 8));
          let min = Math.sqrt(x0 * x0 + y0 * y0);;

          for (let pos of available) {
            let x = Math.abs(pos % 8 - enemyCharacter.position % 8);
            let y = Math.abs(Math.floor(pos / 8) - Math.floor(enemyCharacter.position / 8));
            let newMin = Math.sqrt(x * x + y * y);
            if (newMin < min) {
              min = newMin;
              to = pos;
            }
          }
          for (let position of this.positions) {
            if (position.position === enemyCharacter.position) {
              position.position = to;
            }
          }
          this.gamePlay.redrawPositions(this.positions);
          this.turn = "user";
        }
      }
      if (enemyCharacter.character.type === "vampire") {
        if (this.canBowmanAttack(enemyCharacter.position, goodCharacter.position)) {
          (async () => {
            let damage = Math.max(enemyCharacter.character.attack - goodCharacter.character.defence, enemyCharacter.character.attack * 0.1);
            await this.gamePlay.showDamage(goodCharacter.position, damage);
            goodCharacter.character.health -= damage;
            if(goodCharacter.character.health < 0){
              this.positions = this.positions.filter((pos)=>pos !== goodCharacter);
            }
            else{
              for (let pos of this.positions) {
              if (pos.position === goodCharacter.position) {
                pos = goodCharacter;
              }
            }
          }
            this.gamePlay.redrawPositions(this.positions);
            this.turn = "user";
          })();
        }
        else {
          let available = []
          for (let i = 0; i < 63; i++) {
            if (this.canMagicianMove(enemyCharacter.position, i) && !this.gamePlay.cells[i].firstChild) {
              available.push(i);
            }
          }
          let to = available[0];
          let x0 = Math.abs(to % 8 - enemyCharacter.position % 8);
          let y0 = Math.abs(Math.floor(to / 8) - Math.floor(enemyCharacter.position / 8));
          let min = Math.sqrt(x0 * x0 + y0 * y0);;
          for (let pos of available) {
            let x = Math.abs(pos % 8 - enemyCharacter.position % 8);
            let y = Math.abs(Math.floor(pos / 8) - Math.floor(enemyCharacter.position / 8));
            let newMin = Math.sqrt(x * x + y * y);
            if (newMin < min) {
              min = newMin;
              to = pos;
            }
          }
          for (let position of this.positions) {
            if (position.position === enemyCharacter.position) {
              position.position = to;
            }
          }
          this.gamePlay.redrawPositions(this.positions);
          this.turn = "user";
        }
      }
      if (enemyCharacter.character.type === "undead") {
        if (this.canSwordsmanAttack(enemyCharacter.position, goodCharacter.position)) {
          (async () => {
            let damage = Math.max(enemyCharacter.character.attack - goodCharacter.character.defence, enemyCharacter.character.attack * 0.1);
            await this.gamePlay.showDamage(goodCharacter.position, damage);
            goodCharacter.character.health -= damage;
            if(goodCharacter.character.health < 0){
              this.positions = this.positions.filter((pos)=>pos !== goodCharacter);
            }
            else{
              for (let pos of this.positions) {
              if (pos.position === goodCharacter.position) {
                pos = goodCharacter;
              }
            }
          }
            this.gamePlay.redrawPositions(this.positions);
            this.turn = "user";
          })();
        }
        else {
          let available = []
          for (let i = 0; i < 63; i++) {
            if (this.canMagicianMove(enemyCharacter.position, i) && !this.gamePlay.cells[i].firstChild) {
              available.push(i);
            }
          }
          let to = available[0];
          let x0 = Math.abs(to % 8 - enemyCharacter.position % 8);
          let y0 = Math.abs(Math.floor(to / 8) - Math.floor(enemyCharacter.position / 8));
          let min = Math.sqrt(x0 * x0 + y0 * y0);;
          for (let pos of available) {
            let x = Math.abs(pos % 8 - enemyCharacter.position % 8);
            let y = Math.abs(Math.floor(pos / 8) - Math.floor(enemyCharacter.position / 8));
            let newMin = Math.sqrt(x * x + y * y);
            if (newMin < min) {
              min = newMin;
              to = pos;
            }
          }
          for (let position of this.positions) {
            if (position.position === enemyCharacter.position) {
              position.position = to;
            }
          }
          this.gamePlay.redrawPositions(this.positions);
          this.turn = "user";
        }
      }
    
      
    }
    if(!this.isFriendTeamAlive() || (!this.isEnemyTeamAlive() && this.theme === themes.mountain)){
      return false;
    }
  }

  onCellEnter(index) {
    let character;
    for (let pos of this.positions) {
      if (pos.position === index) {
        character = pos.character;
      }
    }
    if (character) {
      this.gamePlay.showCellTooltip(charToTitle(character), index);
    }
    if (this.returnSelectedCharacter()) {
      this.gamePlay.setCursor(cursors.notallowed);
      if (this.gamePlay.cells[index].firstChild && (this.gamePlay.cells[index].firstChild.classList.contains("bowman") || this.gamePlay.cells[index].firstChild.classList.contains("swordsman") || this.gamePlay.cells[index].firstChild.classList.contains("magician"))) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      else if (this.returnSelectedCharacter().firstChild && this.returnSelectedCharacter().firstChild.classList.contains("bowman")) {
        if (this.canBowmanMove(this.gamePlay.cells.indexOf(this.returnSelectedCharacter()), index)) {
          this.gamePlay.selectCell(index, "green");
        }
        if (this.canBowmanAttack(this.gamePlay.cells.indexOf(this.returnSelectedCharacter()), index) && this.gamePlay.cells[index].firstChild && (this.gamePlay.cells[index].firstChild.classList.contains("daemon") || this.gamePlay.cells[index].firstChild.classList.contains("undead") || this.gamePlay.cells[index].firstChild.classList.contains("vampire"))) {
          this.gamePlay.selectCell(index, "red");

        }
      }
      else if (this.returnSelectedCharacter().firstChild && this.returnSelectedCharacter().firstChild.classList.contains("swordsman")) {
        if (this.canSwordsmanMove(this.gamePlay.cells.indexOf(this.returnSelectedCharacter()), index)) {
          this.gamePlay.selectCell(index, "green");
        }
        if (this.canSwordsmanAttack(this.gamePlay.cells.indexOf(this.returnSelectedCharacter()), index) && this.gamePlay.cells[index].firstChild && (this.gamePlay.cells[index].firstChild && this.gamePlay.cells[index].firstChild.classList.contains("daemon") || this.gamePlay.cells[index].firstChild.classList.contains("undead") || this.gamePlay.cells[index].firstChild.classList.contains("vampire"))) {
          this.gamePlay.selectCell(index, "red");

        }
      }
      else if (this.returnSelectedCharacter().firstChild && this.returnSelectedCharacter().firstChild.classList.contains("magician")) {
        if (this.canMagicianMove(this.gamePlay.cells.indexOf(this.returnSelectedCharacter()), index)) {
          this.gamePlay.selectCell(index, "green");
        }
        if (this.canMagicianAttack(this.gamePlay.cells.indexOf(this.returnSelectedCharacter()), index) && this.gamePlay.cells[index].firstChild && (this.gamePlay.cells[index].firstChild.classList.contains("daemon") || this.gamePlay.cells[index].firstChild.classList.contains("undead") || this.gamePlay.cells[index].firstChild.classList.contains("vampire"))) {
          this.gamePlay.selectCell(index, "red");
        }
      }
    }
    if (this.gamePlay.cells[index].classList.contains("selected-green")) {
      this.gamePlay.setCursor(cursors.pointer);
    }
    if (this.gamePlay.cells[index].classList.contains("selected-red")) {
      this.gamePlay.setCursor(cursors.crosshair);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    const classNames = ['bowman', 'swordsman', "magician"]
    if (this.gamePlay.cells[index].classList.contains("selected") && !classNames.some(className => this.gamePlay.cells[index].firstChild && this.gamePlay.cells[index].firstChild.classList.contains(className))) {
      this.gamePlay.deselectCell(index);
      this.gamePlay.setCursor(cursors.auto);
    }
  }
  clearSelected() {
    let players = this.gamePlay.cells.filter((cell) => cell.classList.contains("selected"));
    for (let player of players) {
      this.gamePlay.deselectCell(this.gamePlay.cells.indexOf(player));
    }
  }
  returnSelectedCharacter() {
    let players = this.gamePlay.cells.filter((cell) => cell.classList.contains("selected-yellow") && cell.firstChild && cell.firstChild.classList.contains("character"));
    if (players) {
      return players[0];
    }
  }
  canSwordsmanMove(from, to) {
    if (to < 0 || from > 63) {
      return false;
    }

    if (this.canBowmanMove(from, to)) {
      return true;
    }
    else if (Math.abs(from % 8 - to % 8) <= 4 && Math.abs(Math.floor(from / 8) - Math.floor(to / 8)) === 0) {
      return true;
    }

    else if (Math.abs(from % 8 - to % 8) === 0 && Math.abs(Math.floor(from / 8) - Math.floor(to / 8)) <= 4) {
      return true;
    }

    else if (Math.abs(from % 8 - to % 8) === Math.abs(Math.floor(from / 8) - Math.floor(to / 8)) && Math.abs(from % 8 - to % 8) <= 4) {
      return true;
    }

    return false;
  }
  canBowmanMove(from, to) {
    // Проверка на выход за границы доски
    if (to < 0 || from > 63) {
      return false;
    }

    if (this.canMagicianMove(from, to)) {
      return true;
    }
    else if (Math.abs(from % 8 - to % 8) === 2 && Math.abs(Math.floor(from / 8) - Math.floor(to / 8)) === 0) {
      return true;
    }

    else if (Math.abs(from % 8 - to % 8) === 0 && Math.abs(Math.floor(from / 8) - Math.floor(to / 8)) === 2) {
      return true;
    }

    else if (Math.abs(from % 8 - to % 8) === Math.abs(Math.floor(from / 8) - Math.floor(to / 8)) && Math.abs(from % 8 - to % 8) === 2) {
      return true;
    }

    return false;
  }
  canMagicianMove(from, to) {
    // Проверка на выход за границы доски
    if (to < 0 || from > 63) {
      return false;
    }

    // Проверка на возможность хода на одну клетку вправо или влево
    if (Math.abs(from % 8 - to % 8) < 2 && Math.abs(Math.floor(from / 8) - Math.floor(to / 8)) < 2) {
      return true;
    }

    // Проверка на возможность хода по диагонали
    if (Math.abs(from % 8 - to % 8) === Math.abs(Math.floor(from / 8) - Math.floor(to / 8)) && Math.abs(from % 8 - to % 8) === 1 && Math.abs(Math.floor(from / 8) - Math.floor(to / 8))) {
      return true;
    }

    return false;
  }
  canSwordsmanAttack(from, to) {
    return this.canMagicianMove(from, to);
  }
  canBowmanAttack(from, to) {
    return this.canBowmanMove(from, to);
  }
  canMagicianAttack(from, to) {
    return this.canSwordsmanMove(from, to);
  }
  isEnemyTeamAlive(){
    for(let pos of this.positions){
      if(["vampire", "undead", "daemon"].includes(pos.character.type)){
        return true;
      }
    }
    return false;
  }
  isFriendTeamAlive(){
    for(let pos of this.positions){
      if(["bowman", "swordsman", "magician"].includes(pos.character.type)){
        return true;
      }
    }
    return false;
  }
  onNewGame(){
    this.init();
  }
  onSaveGame(){
    let state = GameState.from({
      turn: this.turn,
      positions: this.positions,
      theme: this.theme
    });
    this.stateService.save(state);
  }
  onLoadGame(){
    if(this.stateService.load()){
      this.gamePlay.drawUi(state.theme);
      this.gamePlay.redrawPositions(state.positions);
      this.turn = state.turn;
    }
    
  }
}
export function charToTitle(char) {
  return `\u{1F396} ${char.level} \u{2694} ${char.attack} \u{1F6E1} ${char.defence} \u{2764} ${char.health}`;
}
