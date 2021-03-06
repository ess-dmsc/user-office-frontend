import produce from 'immer';
import { Dispatch, Reducer } from 'react';

import { Answer, Questionary } from 'generated/sdk';
import { getFieldById } from 'models/ProposalModelFunctions';
import {
  useReducerWithMiddleWares,
  ReducerMiddleware,
} from 'utils/useReducerWithMiddleWares';

export enum EventType {
  SAVE_CLICKED = 'SAVE_CLICKED',
  FIELD_CHANGED = 'FIELD_CHANGED',
  CANCEL_CLICKED = 'CANCEL_CLICKED',
  MODEL_SAVED = 'MODEL_SAVED',
}
export interface Event {
  type: EventType;
  payload?: any;
}

export interface SubquestionarySubmissionModelState {
  isDirty: boolean;
  questionary: Questionary;
}

type MiddleWareType = ReducerMiddleware<
  SubquestionarySubmissionModelState,
  Event
>;

export function SubquestionarySubmissionModel(
  initialState: SubquestionarySubmissionModelState,
  middlewares?: MiddleWareType[]
): {
  state: SubquestionarySubmissionModelState;
  dispatch: Dispatch<Event>;
} {
  function reducer(state: SubquestionarySubmissionModelState, action: Event) {
    return produce(state, draftState => {
      switch (action.type) {
        case EventType.FIELD_CHANGED:
          const field = getFieldById(
            draftState.questionary.steps,
            action.payload.id
          ) as Answer;
          field.value = action.payload.newValue;

          return draftState;
      }
    });
  }

  const [modelState, dispatch] = useReducerWithMiddleWares<
    Reducer<SubquestionarySubmissionModelState, Event>
  >(reducer, initialState, middlewares || []);

  return { state: modelState, dispatch };
}
