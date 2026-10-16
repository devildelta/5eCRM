# Pass 2: Externalize UI strings

## Problem and approach

Move application-owned, user-facing strings used by the character resource manager out of `cr.html` and `src/cr.js` into zh-HK and zh-TW locale resources. Have the main script select the locale from the browser language (zh-TW selects Traditional Chinese for Taiwan; all other or missing language preferences default to zh-HK), load the resource, and use it for both static markup and dynamically generated UI.

Keep existing UI wording for the remaining interface text, except for the user-provided zh-HK resource-count prefix (`用咗幾次：`), translated class names, and the Artificer class-name placeholder in its description. Put locale-invariant strings in a shared resource and keep locale-specific availability periods in a shared template. Further translation is deferred. Keep built-in source and cooldown values in saved characters unchanged, and leave user-entered character/resource content and non-display program data untouched. Report resource-loading failures explicitly rather than silently rendering partial UI.

## Todos

1. Inventory user-facing strings in `cr.html` and `src/cr.js`, identifying display copy separately from user data and persisted values.
2. Add shared and zh-HK/zh-TW resource files with current UI strings and the main-script locale selection/loading and markup localization path.
3. Replace UI literals in `cr.html` and `src/cr.js` with resource keys, including dynamic messages and built-in choice labels while retaining their current data values.
4. Validate syntax and manually exercise both locales, default selection, resource CRUD/display, and compatibility of source/cooldown values.

## Notes

- Keep locale files as external resources loaded by `src/cr.js`; do not add a language picker in this pass.
- Put invariant labels in `src/locales/common.json`; locale-specific labels and availability period phrases stay in their locale resources.
- Order reusable action terms before phrase templates, and use locale-owned placeholders when composing titles. This allows locale-specific word order without assuming every future language can combine words with the same grammar; retain a complete phrase where composition would sound unnatural.
- Use the `{character}` and `{resource}` tokens for recurring nouns (except the page title and app heading), and reuse localized action tokens such as `{copy}` and `{delete}` so the same verb has one translation source.
- Use `{class}` for recurring D&D class references, with its noun localized once per locale and substituted by the same token resolver.
- Keep punctuation inside its sentence template unless it has an independent formatting role. `classSummarySeparator` remains locale-controlled because it joins a variable-length list; the former standalone sentence-ending key was removed.
- Keep resource/category/cooldown identifiers stable for saved data; only their displayed labels use locale keys.
- No package manifest or existing unit-test files were found; use available repository checks and focused browser/runtime checks as applicable.
- Preserve existing class/resource identifiers and persisted records; localization affects presentation only.
