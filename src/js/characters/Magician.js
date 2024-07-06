import Character from "../Character"

export default class Magician extends Character{
    constructor(level, type = "magician"){
        super(level, type);
        this.attack = 10 * 1.3**(this.level-1);
        this.defence = 40 * 1.3**(this.level-1);
    }
}