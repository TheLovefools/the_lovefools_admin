import React from 'react';
import { FormProvider as Form, FieldValues } from 'react-hook-form';

const FormProvider = ({ children, onSubmit, methods, ...rest }) => {
  return (
    <Form
      {...methods}
      {...rest}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
};

export default FormProvider;
