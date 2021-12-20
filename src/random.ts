import seedrandom from "seedrandom";

export default class Randomizer {
  private random: () => number;

  constructor(seed?: string) {
    this.random = seedrandom(seed ?? new Date().toLocaleDateString("en-US"));
  }

  public chooseFrom<T extends any>(list: T[]): T {
    return list[Math.floor(this.random() * list.length)];
  }

  public shuffle<T extends any>(list: Iterable<T>): T[] {
    const output = [...list];

    for (let i = output.length - 1; i >= 0; i -= 1) {
      const j = Math.floor(this.random() * output.length);
      const temp = output[i];
      output[i] = output[j];
      output[j] = temp;
    }

    return output;
  }

  public shuffleAround<T extends any>(list: Iterable<T>, element: T): T[] {
    const shuffled = this.shuffle(list);

    for (let i = 0; i < shuffled.length; i += 1) {
      if (shuffled[i] !== element) {
        continue;
      }

      const centerIndex = Math.floor((shuffled.length - 1)/ 2);

      shuffled[i] = shuffled[centerIndex];
      shuffled[centerIndex] = element;
      return shuffled;
    }

    throw new Error(`Element ${element} is not a member of the array to shuffle`);
  }
}
