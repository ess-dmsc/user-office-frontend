import JSDict from "../utils/Dictionary";
import { ProposalTemplateField } from "./ProposalModel";

export class ConditionEvaluator {
  private validatorMap!: JSDict<string, IFieldConditionEvaluator>;

  private getMappings() {
    if (!this.validatorMap) {
      // lazy initialization
      this.validatorMap = JSDict.Create<string, IFieldConditionEvaluator>();
      this.validatorMap.put("equals", new EqualityValidator());
    }
    return this.validatorMap;
  }

  getConfitionEvaluator(id: string): IFieldConditionEvaluator {
    return this.getMappings().get(id)!;
  }
}

export interface IFieldConditionEvaluator {
  isSattisfied(field: ProposalTemplateField, params: object): boolean;
}

export class EqualityValidator implements IFieldConditionEvaluator {
  isSattisfied(field: ProposalTemplateField, params: object): boolean {
    return field.value === params;
  }
}