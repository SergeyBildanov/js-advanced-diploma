import GameController from "../GameController"
test.each([
    [0,1,true],
    [8,0, true],
    [0,9, true],
    [0,10, false]
])("Movement from %n to %n for magician", (from,to,expected)=>{
    let gameCtrl = new GameController();
    expect(gameCtrl.canMagicianMove(from, to)).toBe(expected);
})

test.each([
    [0,1,true],
    [16,0, true],
    [0,18, true],
    [0,19, false]
])("Movement from %n to %n for bowman", (from,to,expected)=>{
    let gameCtrl = new GameController();
    expect(gameCtrl.canBowmanMove(from, to)).toBe(expected);
})
test.each([
    [0,1,true],
    [16,0, true],
    [0,27, true],
    [0,36, true],
    [0,28, false]
])("Movement from %n to %n for swordsman", (from,to,expected)=>{
    let gameCtrl = new GameController();
    expect(gameCtrl.canSwordsmanMove(from, to)).toBe(expected);
})
test.each([
    [0,1,true],
    [8,0, true],
    [0,9, true],
    [0,10, false]
])("Attack from %n to %n for Swordsman", (from,to,expected)=>{
    let gameCtrl = new GameController();
    expect(gameCtrl.canSwordsmanAttack(from, to)).toBe(expected);
})

test.each([
    [0,1,true],
    [16,0, true],
    [0,18, true],
    [0,19, false]
])("Attack from %n to %n for bowman", (from,to,expected)=>{
    let gameCtrl = new GameController();
    expect(gameCtrl.canBowmanAttack(from, to)).toBe(expected);
})
test.each([
    [0,1,true],
    [16,0, true],
    [0,27, true],
    [0,36, true],
    [0,28, false]
])("Attack from %n to %n for magician", (from,to,expected)=>{
    let gameCtrl = new GameController();
    expect(gameCtrl.canMagicianAttack(from, to)).toBe(expected);
})