import Character from "../Character"

export default class Bowman extends Character{
    constructor(level, type = "bowman"){
        super(level, type);
        this.attack = 25 * 1.3**(this.level-1);
        this.defence = 25 * 1.3**(this.level-1);
    }
}