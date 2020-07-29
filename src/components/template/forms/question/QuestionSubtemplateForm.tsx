import { FormControl, InputLabel, Link, MenuItem } from '@material-ui/core';
import { Field } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import * as Yup from 'yup';

import TitledContainer from 'components/common/TitledContainer';
import { Question, TemplateCategoryId } from 'generated/sdk';
import { useTemplates } from 'hooks/template/useTemplates';
import { useNaturalKeySchema } from 'utils/userFieldValidationSchema';

import { TFormSignature } from '../TFormSignature';
import { QuestionFormShell } from './QuestionFormShell';

export const QuestionSubtemplateForm: TFormSignature<Question> = props => {
  const field = props.field;
  const naturalKeySchema = useNaturalKeySchema(field.naturalKey);
  const { templates } = useTemplates(
    false,
    TemplateCategoryId.SAMPLE_DECLARATION
  );

  return (
    <QuestionFormShell
      label="Template"
      closeMe={props.closeMe}
      dispatch={props.dispatch}
      question={props.field}
      validationSchema={Yup.object().shape({
        naturalKey: naturalKeySchema,
        question: Yup.string().required('Question is required'),
        config: Yup.object({
          templateId: Yup.number().required('Template is required'),
          addEntryButtonLabel: Yup.string(),
          maxEntries: Yup.number().nullable(),
        }),
      })}
    >
      {() => (
        <>
          <Field
            name="naturalKey"
            label="Key"
            type="text"
            component={TextField}
            margin="normal"
            fullWidth
            inputProps={{ 'data-cy': 'natural_key' }}
          />
          <Field
            name="question"
            label="Question"
            type="text"
            component={TextField}
            margin="normal"
            fullWidth
            inputProps={{ 'data-cy': 'question' }}
          />

          <TitledContainer label="Options">
            <FormControl fullWidth>
              <InputLabel htmlFor="age-simple">Template name</InputLabel>
              <Field
                name="config.templateId"
                type="text"
                component={Select}
                margin="normal"
                data-cy="templateId"
              >
                {templates &&
                  templates.map(template => {
                    return (
                      <MenuItem
                        value={template.templateId}
                        key={template.templateId}
                      >
                        {template.name}
                      </MenuItem>
                    );
                  })}
              </Field>
              <Link href="/SampleDeclarationTemplates/" target="blank">
                View all templates
              </Link>
            </FormControl>

            <Field
              name="config.addEntryButtonLabel"
              label="Add button label"
              placeholder='(e.g. "add new")'
              type="text"
              component={TextField}
              margin="normal"
              fullWidth
              data-cy="addEntryButtonLabel"
            />
            <Field
              name="config.maxEntries"
              label="Max entries"
              placeholder="(e.g. 4, leave blank for unlimited)"
              type="text"
              component={TextField}
              margin="normal"
              fullWidth
              data-cy="maxEntries"
            />
          </TitledContainer>
        </>
      )}
    </QuestionFormShell>
  );
};