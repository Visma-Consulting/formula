import Button from '@material-ui/core/Button';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { mapValues, pick } from 'lodash';
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
        document.getElementById(steps[nextStep]['ui:title']).focus();
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        // Prevent submit
        return false;
      }

      // Submit
      return true;
    }

    const isLastStep = activeStep === steps.length - 1;

    const elements = otherProps.uiSchema['ui:order'];

    const currentStepElements = [];
    const beforeMaxJumpElements = [];
    let current = -1;
    for (const element of elements) {
      const uiField = otherProps.uiSchema[element]?.['ui:field'];
      if (uiField === StepTitle) {
        current++;
        if (current > maxJump) {
          break;
        } else {
          continue;
        }
      }
      if ((current === -1 && activeStep === 0) || current === activeStep) {
        currentStepElements.push(element);
      }
      beforeMaxJumpElements.push(element);
    }

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
                    id={title}
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
                        onSubmit={isLastStep ? onSubmit : undefined}
                        onPreSubmit={handleStepChange}
                        ref={ref}
                        schema={{
                          ...otherProps.schema,
                          properties: pick(
                            otherProps.schema.properties,
                            beforeMaxJumpElements
                          ),
                          title: undefined,
                          required: otherProps.schema.required?.filter((key) =>
                            currentStepElements.includes(key)
                          ),
                        }}
                        uiSchema={{
                          // Hide elements outside current step
                          ...mapValues(
                            otherProps.schema.properties,
                            (value, key) =>
                              currentStepElements.includes(key)
                                ? otherProps.uiSchema[key]
                                : { 'ui:widget': 'hidden' }
                          ),
                          // Include additional schema options
                          ...mapValues(otherProps.uiSchema, (value, key) =>
                            elements.includes(key) &&
                            !currentStepElements.includes(key)
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
    const uiOrder = props.uiSchema['ui:order'] ?? [];
    const steps = Object.entries(props.uiSchema)
      .sort(([a], [b]) => uiOrder.indexOf(a) - uiOrder.indexOf(b))
      .map(([, value]) => value)
      .filter(Boolean)
      .filter(({ 'ui:field': uiField }) => uiField === StepTitle);
    return steps.length ? (
      <WithSteps ref={ref} {...props} steps={steps} />
    ) : (
      <Form ref={ref} {...props} />
    );
  });
}
