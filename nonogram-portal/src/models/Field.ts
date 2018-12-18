export class Field {
    constructor(public value: number = 255) {
    }

    public colorsNumbers(max: number): number[] {
        let out = [];
        let v = this.value;
        for (let x = 0; x < max; x++) {
            if (v%2 == 1) {
                out.push(x);
            }
            v = Math.floor(v/2);
        }
        return out;
    }

    public isXed(): Boolean {
        return this.value == 0;
    }
}