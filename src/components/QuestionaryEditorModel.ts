import { useProposalQuestionTemplate } from "../hooks/useProposalQuestionTemplate";
import { Reducer, useEffect, useCallback } from "react";
import {
  ProposalTemplate,
  ProposalTemplateField
} from "../model/ProposalModel";
import produce from "immer";
import useReducerWithMiddleWares from "../utils/useReducerWithMiddleWares";

export enum EventType {
  READY,
  REORDER_REQUESTED,
  MOVE_TOPIC_REQUESTED,
  UPDATE_TOPIC_TITLE_REQUESTED,
  UPDATE_FIELD_REQUESTED,
  CREATE_NEW_FIELD_REQUESTED,
  FIELD_CREATED,
  DELETE_FIELD_REQUESTED,
  FIELD_DELETED
}

export interface IEvent {
  type: EventType;
  payload: any;
}

export default function QuestionaryEditorModel(middlewares?: Array<Function>) {
  const blankInitTemplate = new ProposalTemplate();
  const [state, dispatch] = useReducerWithMiddleWares<
    Reducer<ProposalTemplate, IEvent>
  >(reducer, blankInitTemplate, middlewares || []);
  const newDispatch = useCallback(dispatch, []);

  const getProposalTemplateRequest = useProposalQuestionTemplate();

  useEffect(() => {
    getProposalTemplateRequest().then(data => {
      newDispatch({
        type: EventType.READY,
        payload: data
      });
    });
  }, [getProposalTemplateRequest, newDispatch]);

  function reducer(state: ProposalTemplate, action: IEvent): ProposalTemplate {
    return produce(state, draft => {
      switch (action.type) {
        case EventType.READY:
          return action.payload;
        case EventType.REORDER_REQUESTED:
          if (!action.payload.destination) {
            return draft;
          }

          var from: any = draft.topics.find(topic => {
            return (
              topic.topic_id.toString() === action.payload.source.droppableId
            );
          });

          var to: any = draft.topics.find(topic => {
            return (
              topic.topic_id.toString() ===
              action.payload.destination.droppableId
            );
          });

          to.fields.splice(
            action.payload.destination.index,
            0,
            ...from.fields.splice(action.payload.source.index, 1)
          );

          return draft;
        case EventType.UPDATE_TOPIC_TITLE_REQUESTED:
          draft.getTopicById(action.payload.topicId)!.topic_title =
            action.payload.title;
          return draft;
        case EventType.UPDATE_FIELD_REQUESTED:
          const field: ProposalTemplateField = action.payload.field;
          const fieldToUpdate = draft.getFieldById(field.proposal_question_id);
          if (field && fieldToUpdate) {
            Object.assign(fieldToUpdate, field);
          } else {
            console.error("Object(s) are not defined", field, fieldToUpdate);
          }
          return draft;
        case EventType.FIELD_CREATED:
          const newField: ProposalTemplateField = action.payload;
          draft.addField(newField);
          return new ProposalTemplate(draft);
        case EventType.FIELD_DELETED:
          return new ProposalTemplate(action.payload);
      }
    });
  }

  return { state, dispatch };
}
