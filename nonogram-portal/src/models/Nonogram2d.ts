import { RuleItem } from "./RuleItem";
import { Field } from "./Field";
import { Color } from "./Color";

export class Nonogram2d {
    public colors: Color[];
    public upRules: RuleItem[][];
    public leftRules: RuleItem[][];
    public fields: Field[][];
}
