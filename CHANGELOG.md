# x.y.z

- Fix issue with number field default value
- Add option to filter autocomplete select options by sibling elements in a `formGroup` list
- Upgrade to `@visma/rjsf-*@3.1.0-18`

# 0.4.60

- Fix duplicate labels in autocomplete
- Upgrade to `@visma/rjsf-*@3.1.0-17`

# 0.4.59

- Add submission handler endpoint
- Remove formdata listing endpoint
- Change submission path

# 0.4.58

- Fix focusing RECAPTCHA
- Upgrade to `@visma/rjsf-*@3.1.0-16`

# 0.4.57

- Memoize config normalization v2

# 0.4.56

- Revert: Memoize config normalization

# 0.4.55

- Make required `multiselect` field require at least 1 selected item

# 0.4.54

- Memoize config normalization (Reverted in `0.4.56`)

# 0.4.53

- Upgrade to `@visma/rjsf-*@3.1.0-15`

# 0.4.52

- Upgrade to `@visma/rjsf-*@3.1.0-13`

# 0.4.51

- Set list field to have one element by default

# 0.4.50

- Optimize text types: propagate changes only on blur
- Upgrade to `@visma/rjsf-*@3.1.0-11`
  - Prevent submit on enter press in single line text field
- Fix refetching when revision changes

# 0.4.49

- Upgrade to `@visma/rjsf-*@3.1.0-10`

# 0.4.48

- Fix rendering form when `ui:order` is undefined
- Transfer ownership

# 0.4.47

- Upgrade to `@visma/rjsf-*@3.1.0-9`
- Allow function types in config
- Fix order of step titles

# 0.4.46

- Add support to prefill formData based on config

# 0.4.45

- Add missing `dateFnsLocale` to form context
- Fix stand-alone forms without CAPTCHA: Fetch config only if CAPTCHA is used
- Fix BMI type crash when height/weight is not available
- Add export endpoint to api

# 0.4.44

- Fix crash when setting default keys if elements is undefined

# 0.4.43

- Upgrade to `@visma/rjsf-*@3.1.0-8`
- Fix form with steps

# 0.4.40

- Stepped form fixes
- Revert: Set empty schema for images etc. dummy elements

# 0.4.39

- Fix array type rendering when columns are undefined
- Review improvements: render "–" in place of unset answers
- Set empty schema for images etc. dummy elements
- Upgrade to `@visma/rjsf-*@3.1.0-7`

# 0.4.38

- Change number type default value from `0` to `undefined`
- Fix submitting form with steps. Only data from the last step was submitted.
- Update external links in rich text:
  - Show icon next to link
  - Add `noopener noreferrer nofollow`
- In review show password as \*\*\*\*\*\*\*\*

# 0.4.37

- Upgrade to `@visma/rjsf-*@3.1.0-5`
- Remove extra titles from date and table types
- Omit extra data on submit
- Fix rich text editor link and image menus
- Fix rendering rich text editor when initial value changes
- Fix rich text review format
- Fix layout issue with large images
- Fix crash when resolving element references if elements is undefined
- Fix crash when localizing config
- Autocomplete updates
- Don't stretch small images

# 0.4.36

- Fix losing focus
- Fix setting default keys

# 0.4.34

- Render multiple files field as list
- Change filter syntax to use MongoDB queries
- Upgrade to `@visma/rjsf-*@^3.1.0-4`

# 0.4.32

- English and Swedish translations
- Fix issues with formatting and styles

# 0.4.31

- Fix CAPTCHA: Remove use of internal dependency

# 0.4.30

- Add support for combining `formGroup` and `list`
- Remove duplicate elements, when multiple dynamic elements use same key

# 0.4.27

- Fix adding element to a form with steps

# 0.4.26

- Fix issues with configuration deprecation and conversion

# 0.4.24

- Add support for form steps

# 0.4.23

- Upgrade to `@visma/rjsf-*@^3.1.0-1`

# 0.4.22

- BMI type update: fallback to index keys

# 0.4.21

- Upgrade to `@visma/rjsf-*@^3.1.0-0`

# 0.4.18

- Add optional CAPTCHA

# 0.4.17

- Fix transition to success/review

# 0.4.16

- Conform api calls to serve correct backend endpoints

# 0.4.15

- Show true and false optinal texts correctly in review
- Fix opening review
- Add boolean type widgets

# 0.4.14

- Fix localizing config when config has a table and a field with choices/elements

# 0.4.13

- Table type fixes

# 0.4.12

- Fix processing form group elements in legacy mode

# 0.4.11

- Fix using label instead of title
- Fix `useForms` API, when fetching published public forms

# 0.4.10

- Use OpenAPI schema and client generator
- Add table type
- BMI type fixes

# 0.4.9

- Fix resuming form when `id` is not `string` type
- Add function for imports to API

# 0.4.8

- Fix `multiselect` when `choices` is empty

# 0.4.6

- Fix `select` when `choices` is empty
- Pretty print file size in review

# 0.4.5

- Fix required elements
- Fix body field when content is undefined

# 0.4.4

- Fix `autocomplete` when `choices` is undefined
- Remove `"type":"form"` in legacy mode

# 0.4.3

- Legacy mode update: If legacy mode is detected, legacy style data is used in API requests
- Fix `readOnly` config
- Fix empty list of `choices` in dynamic list item, when `oneOf` has multiple fields with same key
- Fix `choices` when `enumNames` is empty
- Issue with undefined config

# 0.4.2

- Fix normalizing field titles

# 0.4.1

- Autocomplete field fixes

# 0.4.0

- **Breaking:** <del>`formgroup`</del> Only camel case field type `formGroup` is supported
- Add autocomplete field
- Pass minItems to repeatable field
- Review submitted form
- Add richtext field
- Add dynamic elements support

# 0.3.0

- **Breaking:** `usePublicForms()` is replaced with `useForms({ status: 'published', visibility: 'public' })`
- **Breaking:** `useApi` is renamed to `useMutations`
- **Breaking:** `useApi().handleSubmit` is renamed to `useMutations().submit`
- **Deprecation:** `config.selectWidget` is deprecated. Use `config.widget` instead.
- **Deprecation:** `config.multiselectWidget` is deprecated. Use `config.multiselectWidget` instead.
- **Deprecation:** `config.booleanDefault` is deprecated. Use `config.default` instead.
- Config normalization fixes
- Confirm form submit
- Resume editing form using dataId

# 0.2.2

- Fix recursion in localizing and normalizing config
- Enable defining extraTypes and extraTypePlugins
- More field types
- Add description and help texts
- Forward ref from `<Formula>` and `<Form>` to react-jsonschema-form `<Form>`.

# 0.2.1

- Added character counter to text and multiline text fields.

# 0.2.0

- **Breaking:** `useLocalize` is removed. API localizes configs.
- **Deprecation:** `config.name` is deprecated. Use `config.title` instead.
- Added `onPostSubmit` prop to get notified when form has been submitted

# 0.1.0

- Initial release
