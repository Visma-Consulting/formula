# 0.4.1

- autocomplete field fixes

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
