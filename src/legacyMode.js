import produce from 'immer';
export let isLegacyMode = false;

export function setLegacyMode() {
  if (!isLegacyMode) {
    isLegacyMode = true;
    console.log('Legacy mode enabled');
  }
}

export const handleLegacyConfig = produce((config) => {
  if (isLegacyMode) {
    if (config.type === 'form') {
      delete config.type;
    }

    if (config.type === 'boolean') {
      config.booleanWidget = {
        radio: 0,
        select: 1,
        switch: 2,
        switchWithEmptyOption: 3,
      }[config.widget];
      //delete config.widget;

      config.booleanDefault = config.default;
      //delete config.default;
    }

    if (config.type === 'select') {
      config.selectWidget = { radio: 0 }[config.widget];
      //delete config.widget;
    }

    if (config.type === 'multiselect') {
      config.multiselectWidget = { checkboxes: 0 }[config.widget];
      //delete config.widget;
    }

    if (config.type === 'text' || config.type === 'textarea') {
      config.textDefault = config.default;
      //delete config.default;
    }

    if (config.elements) {
      config.elements = config.elements.map((element) =>
        element.type === 'formGroup'
          ? { ...element, type: 'formgroup' }
          : element
      );
    }

    config.name = config.title;
    //delete config.title;
  }
});
