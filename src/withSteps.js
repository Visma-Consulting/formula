import Button from '@material-ui/core/Button';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { mapValues } from 'lodash';
import { forwardRef, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { StepTitle } from './configToSchemas/types/stepTitle';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));

export default function withSteps(Form) {
  const WithSteps = forwardRef(({ onSubmit, steps, ...otherProps }, ref) => {
    const [activeStep, setActiveStep] = useState(0);
    const [maxJump, setMaxJump] = useState(activeStep);
    const classes = useStyles();
    const formRef = useRef();
    ref ??= formRef;
    const jumpRef = useRef(null);

    function handleStepChange(...args) {
      const nextStep = jumpRef.current ?? activeStep + 1;

      if (nextStep < steps.length) {
        setMaxJump((prev) => Math.max(prev, nextStep));
        setActiveStep(nextStep);
        // Prevent submit
        return false;
      }

      // Submit
      return true;
    }

    const isLastStep = activeStep === steps.length - 1;

    const { elements } = Object.entries(otherProps.uiSchema)
      .filter(([key]) => key in otherProps.schema.properties)
      .filter(([, value]) => value)
      .reduce(
        ({ current, elements }, [key, { 'ui:field': uiField }]) => {
          if (uiField === StepTitle) {
            return { current: current + 1, elements };
          }
          if (current === -1 || current === activeStep) {
            elements.push(key);
          }
          return { current, elements };
        },
        { current: -1, elements: [] }
      );

    const createHandleJump = (step) =>
      function handleJump(event) {
        jumpRef.current = step;
        ref.current.submit(event);
        // Wait for the submit event to trigger.
        setTimeout(() => {
          // If form has validation errors, jump does not happen and we must clean
          // current value.
          jumpRef.current = null;
        });
      };

    return (
      <>
        <Typography variant="h5" gutterBottom>
          {otherProps.schema.title}
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
          {steps
            .map(({ 'ui:title': title }) => title)
            .map((title, index) => {
              const active = index <= maxJump;
              const current = index === activeStep;
              return (
                <Step key={title}>
                  <StepButton
                    completed={index < activeStep}
                    disabled={current || !active}
                    active={active}
                    onClick={createHandleJump(index)}
                  >
                    {title}
                  </StepButton>
                  {current && (
                    <StepContent>
                      <Form
                        {...otherProps}
                        onPreSubmit={handleStepChange}
                        ref={ref}
                        schema={{
                          ...otherProps.schema,
                          title: undefined,
                          required: otherProps.schema.required?.filter((key) =>
                            elements.includes(key)
                          ),
                        }}
                        uiSchema={{
                          ...mapValues(otherProps.uiSchema, (value, key) =>
                            key in otherProps.schema.properties &&
                            !elements.includes(key)
                              ? { 'ui:widget': 'hidden' }
                              : value
                          ),
                        }}
                      >
                        {activeStep !== 0 && (
                          <Button
                            className={classes.button}
                            onClick={createHandleJump(activeStep - 1)}
                          >
                            <FormattedMessage defaultMessage="Takaisin" />
                          </Button>
                        )}
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          {isLastStep ? (
                            <FormattedMessage defaultMessage="Lähetä" />
                          ) : (
                            <FormattedMessage defaultMessage="Seuraava" />
                          )}
                        </Button>
                      </Form>
                    </StepContent>
                  )}
                </Step>
              );
            })}
        </Stepper>
      </>
    );
  });

  return forwardRef((props, ref) => {
    const steps = Object.values(props.uiSchema)
      .filter(Boolean)
      .filter(({ 'ui:field': uiField }) => uiField === StepTitle);
    return steps.length ? (
      <WithSteps ref={ref} {...props} steps={steps} />
    ) : (
      <Form ref={ref} {...props} />
    );
  });
}
