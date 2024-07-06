import Character from "../Character"

export default class Daemon extends Character{
    constructor(level, type = "daemon"){
        super(level, type);
        this.attack = 10 * 1.3**(this.level-1);
        this.defence = 10 * 1.3**(this.level-1);
    }
}