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
  const WithSteps = forwardRef(({ onSubmit, onChange, formData, steps, ...otherProps }, ref) => {
    const [activeStep, setActiveStep] = useState(0);
    const [maxJump, setMaxJump] = useState(activeStep);
    const [noValidate, setNoValidate] = useState(false);
    const classes = useStyles();
    const formRef = useRef();
    ref ??= formRef;
    const formWrapperRef = useRef();
    const jumpRef = useRef(null);
    function handleStepChange(...args) {
      const nextStep = jumpRef.current ?? activeStep + 1;

      if (nextStep < steps.length) {
        setMaxJump((prev) => Math.max(prev, nextStep));
        setActiveStep(nextStep);
        const stepId = 'formula-step-' + steps[nextStep]['ui:options']?.element?.key;
        document.getElementById(stepId).focus();
        formWrapperRef.current.scrollIntoView({ behavior: "smooth" });
        // Prevent submit
        return false;
      }

      // Submit
      return true;
    }

    const handleSubmit = () => {
      setNoValidate(false);
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
          // If backward button pressed
          step < activeStep ? setNoValidate(true) : setNoValidate(false);
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
      <div ref={formWrapperRef}>
        <Typography component="h2" variant="h5" gutterBottom>
          {otherProps.schema.title}
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
          {steps
            .map(({ 'ui:title': title, 'ui:options': options }) => {return {title, options}})
            .map(({title, options}, index) => {
              const active = index <= maxJump;
              const current = index === activeStep;
              return (
                <Step key={title}>
                  <StepButton
                    id={`formula-step-${options?.element?.key}`}
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
                        formData={formData}
                        onChange={(...args) => {
                          onChange?.(...args);
                          setMaxJump(activeStep);
                        }}
                        noValidate={noValidate}
                        schema={{
                          ...otherProps.schema,
                          properties: pick(
                            otherProps.schema.properties,
                            isLastStep ? beforeMaxJumpElements : currentStepElements
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

                          {isLastStep ? (
                            <Button
                              type="submit"
                              onClick={handleSubmit}
                              variant="contained"
                              color="primary"
                            >
                            <FormattedMessage defaultMessage="Lähetä" />
                            </Button>) : (
                              <Button
                              onClick={createHandleJump(activeStep + 1)}
                              variant="contained"
                              color="primary"
                            >
                              <FormattedMessage defaultMessage="Eteenpäin" />
                            </Button>
                          )}
                      </Form>
                    </StepContent>
                  )}
                </Step>
              );
            })}
        </Stepper>
      </div>
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
