import { calcTileType } from "../utils";
test.each(
    [
      [0, 8,  "top-left"],
      [63, 8,  "bottom-right"],
      [56, 8,  "bottom-left"],
      [7, 8,  "top-right"],
      [1, 8,  "top"],
      [8, 8,  "left"],
      [57, 8,  "bottom"],
      [31, 8,  "right"],
      [12, 8,  "center"],
    ])("%n tile in %n field is %s", (index, size, expected)=>{
      const result = calcTileType(index, size);
      expect(result).toEqual(expected);
    });