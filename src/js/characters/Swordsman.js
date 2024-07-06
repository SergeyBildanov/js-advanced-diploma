import Character from "../Character"

export default class Swordsman extends Character{
    constructor(level, type = "swordsman"){
        super(level, type);
        this.attack = 40 * 1.3**(this.level-1);
        this.defence = 10 * 1.3**(this.level-1);
    }
}