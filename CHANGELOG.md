# 0.4.20

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
