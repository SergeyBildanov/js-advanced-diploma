import { charToTitle } from "../GameController.js";
import Daemon from "../characters/Daemon.js"

let daemon = new Daemon(1);
test('функция returnNumber должна вернуть число 10', () => {
    expect(charToTitle(daemon)).toBe(`\u{1F396} ${daemon.level} \u{2694} ${daemon.attack} \u{1F6E1} ${daemon.defence} \u{2764} ${daemon.health}`);
});