import Randomizer from "./random";

describe(Randomizer, () => {
  it("chooses from a list", () => {
    const got = new Set();
    const options = [..."abcdefghijklmnopqrstuvwxyz"];

    const randomizer = new Randomizer("seed");

    for (let i = 0; i < 1000; i += 1) {
      const choice = randomizer.chooseFrom(options);
      expect(options).toContain(choice);
      got.add(choice);
    }

    expect(got.size).toBe(options.length);
  });

  it("shuffles deterministically", () => {
    const options = [..."abcde"];

    const r1 = new Randomizer("seed");
    expect(r1.shuffle(options)).toStrictEqual(["d", "a", "b", "c", "e"]);
    expect(r1.shuffle(options)).toStrictEqual(["a", "c", "e", "b", "d"]);
    expect(r1.shuffle(options)).toStrictEqual(["c", "d", "a", "e", "b"]);

    const r2 = new Randomizer("seed");
    expect(r2.shuffle(options)).toStrictEqual(["d", "a", "b", "c", "e"]);
    expect(r2.shuffle(options)).toStrictEqual(["a", "c", "e", "b", "d"]);
    expect(r2.shuffle(options)).toStrictEqual(["c", "d", "a", "e", "b"]);

    const r3 = new Randomizer("different seed");
    expect(r3.shuffle(options)).toStrictEqual(["d", "a", "e", "c", "b"]);
  });

  it("shuffles around a letter", () => {
    const options = [..."abcde"];

    const r = new Randomizer("seed");
    expect(r.shuffleAround(options, "e")).toStrictEqual([
      "d",
      "a",
      "e",
      "c",
      "b"
    ]);
    expect(r.shuffleAround(options, "e")).toStrictEqual([
      "a",
      "c",
      "e",
      "b",
      "d"
    ]);
    expect(r.shuffleAround(options, "e")).toStrictEqual([
      "c",
      "d",
      "e",
      "a",
      "b"
    ]);
  });

  it("throws if shuffling around a letter that doesn't exist", () => {
    const options = [..."abcde"];

    const r = new Randomizer("seed");
    expect(() => r.shuffleAround(options, "j")).toThrow(
      new Error("Element j is not a member of the array to shuffle")
    );
  });
});
