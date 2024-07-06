import { experiments } from "webpack";
import Character from "../Character";
import Bowman from "../characters/Bowman";
import Daemon from "../characters/Daemon";
import Magician from "../characters/Magician";
import Swordsman from "../characters/Swordsman";
import { characterGenerator, generateTeam } from "../generators";

test("new Character try", ()=>{
    expect(() => new Character(1)).toThrow(new Error("Нельзя создать персонажа неопределенного типа!"));
})

test("new Daemon try", ()=>{
    let daemon = new Daemon(1);
    expect(daemon).toEqual(new Daemon(1));
})

test("new Daemon parameters", ()=>{
    let daemon = new Daemon(1);
    let correct = {
        level: 1,
        type: "daemon",
        attack: 10,
        defence: 10,
        health: 50,
    }
    expect(daemon).toEqual(correct);
})

test("random characters generation", ()=>{
    let characters = [];
    let allowedTypes = [Bowman, Swordsman, Magician];
    for( let i=0; i<10; i++){
        characters.push(new characterGenerator(allowedTypes, 2));
    }
    expect(characters.length).toBe(10);
})

test("team generator amount", ()=>{
    let allowedTypes = [Bowman, Swordsman, Magician];
    let team = generateTeam(allowedTypes, 2, 2);
    expect(team.characters.length).toBe(2);
})