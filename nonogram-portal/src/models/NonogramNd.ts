import { Color } from "./Color";
import { Field } from "./Field";
import { RuleItem } from "./RuleItem";
import { Nonogram2d } from "./Nonogram2d";

export class NonogramNd {
    constructor(public dimensions: number[], public colors: Color[]) {

        this.fields = this.generateFields(this.dimensions.length);
        this.rules = [];
        for (let x = 0; x < this.dimensions.length; x++)
            this.rules.push(this.generateRules(this.dimensions.length, x));
    }

    public fields: any;
    public rules: any;

    public getRules(dimension: number, fieldCoordinates: number[]) {
        let r = this.rules[dimension];
        let arr = Object.assign([], fieldCoordinates);
        arr.splice(dimension, 1);
        arr.forEach(e => {
            r = r[e];
        });
        return r;
    }

    public setRules(rules: RuleItem[], dimension: number, fieldCoordinates: number[]) {
        let r = this.rules[dimension];
        let arr = Object.assign([], fieldCoordinates);
        arr.splice(dimension, 1);
        for (let x = 0; x < arr.length - 1; x++) {
            r = r[arr[x]];
        }
        r[arr[arr.length - 1]] = rules;
    }

    public getField(fieldCoordinates: number[]): Field {
        let f = this.fields;
        fieldCoordinates.forEach(e => {
            f = f[e];
        });
        return f;
    }

    public setField(field: Field, fieldCoordinates: number[]) {
        let f = this.fields;
        for (let x = 0; x < fieldCoordinates.length - 1; x++) {
            f = f[fieldCoordinates[x]];
        }
        f[fieldCoordinates[fieldCoordinates.length - 1]] = field;
    }

    public updateRules() {
        for (let x = 0; x < this.dimensions.length; x++)
            this.updateRulesFormFiledsForDimension(x);
    }

    public getNonogram2d(xIndex: number, yIndex: number, fieldCoordinates: number[]) {
        let nonogram = new Nonogram2d();
        let arr = Object.assign([], fieldCoordinates);
        nonogram.fields = [];
        nonogram.upRules = [];
        nonogram.leftRules = [];
        for (let x = 0; x < this.dimensions[xIndex]; x++) {
            arr[xIndex] = x;
            let ytab = [];
            for (let y = 0; y < this.dimensions[yIndex]; y++) {
                arr[yIndex] = y;
                ytab.push(this.getField(arr));
            }
            nonogram.fields.push(ytab);
        }
        for (let x = 0; x < this.dimensions[xIndex]; x++) {
            arr[xIndex] = x;
            nonogram.upRules.push(this.getRules(yIndex, arr));
        }
        for (let y = 0; y < this.dimensions[yIndex]; y++) {
            arr[yIndex] = y;
            nonogram.leftRules.push(this.getRules(xIndex, arr));
        }
        nonogram.colors = this.colors;
        return nonogram;
    }

    public mapColors(source: number, destination: number) {
        this.generateFieldCoordinates().forEach(e => {
            let field = this.getField(e);
            let colors = field.colorsNumbers(this.colors.length);
            if (colors.length == 1 && colors[0] == source) {
                field.value = 1 << destination;
            }
        });
        for(let x=0;x<this.dimensions.length;x++){
            this.generateFieldCoordinatesForDimension(x).forEach(e => {
                let rules: RuleItem[] = this.getRules(x, e);
                rules.forEach(rule => {
                    if(rule.color == source)
                        rule.color = destination;
                });
            });
        }
    }

    private generateFieldCoordinates(r: number = this.dimensions.length - 1) {
        if (r == -1)
            return [[]];
        let ret = [];
        for (let x = 0; x < this.dimensions[r]; x++) {
            this.generateFieldCoordinates(r - 1).forEach(e => {
                e.push(x);
                ret.push(e);
            });
        }
        return ret;
    }

    private updateRulesFormFiledsForDimension(dimension: number) {
        this.generateFieldCoordinatesForDimension(dimension).forEach(e => {
            let rules = this.rulesFormFields(dimension, e);
            this.setRules(rules, dimension, e);
        });
    }

    private generateFieldCoordinatesForDimension(dimension: number, r: number = this.dimensions.length - 1) {

        if (r == -1)
            return [[]];
        if (r == dimension) {
            let ret = this.generateFieldCoordinatesForDimension(dimension, r - 1);
            ret.forEach(e => {
                e.push(0);
            });
            return ret;
        }
        let ret = [];
        for (let x = 0; x < this.dimensions[r]; x++) {
            this.generateFieldCoordinatesForDimension(dimension, r - 1).forEach(e => {
                e.push(x);
                ret.push(e);
            });
        }
        return ret;
    }

    private rulesFormFields(dimension: number, fieldCoordinates: number[]) {
        let f: Field[] = []
        let atDimensionValue = fieldCoordinates[dimension];
        for (let x = 0; x < this.dimensions[dimension]; x++) {
            fieldCoordinates[dimension] = x;
            f.push(this.getField(fieldCoordinates));
        }
        fieldCoordinates[dimension] = atDimensionValue;
        let r: [Field, number][] = [[f[0], 0]];
        f.forEach(e => {
            let [v, n] = r[r.length - 1];
            if (e.value == v.value) {
                r[r.length - 1] = [v, n + 1];
            }
            else {
                r.push([e, 1]);
            }
        });
        let rules: RuleItem[] = []
        r.forEach(e => {
            let [v, n] = e;
            if (v.colorsNumbers(this.colors.length).length == 1) {
                rules.push(new RuleItem(n, v.colorsNumbers(this.colors.length)[0]));
            }
        });
        return rules;
    }

    private generateFields(depth: number) {
        if (depth == 0) {
            return new Field();
        }
        let ret = [];
        for (let x = 0; x < this.dimensions[this.dimensions.length - depth]; x++)
            ret.push(this.generateFields(depth - 1));
        return ret;
    }

    private generateRules(depth: number, avoid: number) {
        if (this.dimensions.length - avoid == depth) {
            return this.generateRules(depth - 1, avoid);
        }
        if (depth == 0) {
            return [];
        }
        let ret = [];
        for (let x = 0; x < this.dimensions[this.dimensions.length - depth]; x++)
            ret.push(this.generateRules(depth - 1, avoid));
        return ret;
    }
}