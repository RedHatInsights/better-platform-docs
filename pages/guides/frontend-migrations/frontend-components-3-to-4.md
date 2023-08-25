# Frontend components @3 -> @4 migration

There are a small number of breaking changes in this release. Most of them impose stricter props requirements and  the removal of a some default prop values.

## Conditional filter

- typings now accurately reflect the composite component interfaces based on the filter type

### Checkbox filter

- `onChange` prop is now required


### GroupFilter

- `onChange` prop is now required
- the group filter items `label` prop is now required

### RadioFilter

- `onChange` prop is now required

### TextFilter

- `onChange` prop is now required

## Filters

### Filter input

- `filterCategories` prop is now required
- `label` prop is now required

## Input

The `Input` component was removed. Use the patternfly `TextInput` component instead.

## Pagination

The `Pagination` component was removed. Use the patternfly `Pagination` component instead.

## PrimaryToolbar

### No more default filter type

```sh
Uncaught Error: Invalid conditional filter component type! Expected one of text, checkbox, radio, custom, group, got undefined.
```

The `type` of your filters can no longer be undefined. Previous fallback value of `text` was removed and has to be explicitly set.

To filters that do not have any `type`, add `type: 'text'`:

```diff
diff --git a/src/pages/Sources.js b/src/pages/Sources.js
index f434dca6..7b02a49a 100644
--- a/src/pages/Sources.js
+++ b/src/pages/Sources.js
@@ -205,6 +205,7 @@ const SourcesPage = () => {
         filterConfig={{
           items: [
             {
+              type: 'text',
               label: intl.formatMessage({
                 id: 'sources.name',
                 defaultMessage: 'Name',

```

### useMobileLayout is now active by default

The `useMobileLayout` is no longer an opt-in prop and is turned on by default. This changes improves the primary toolbar visuals on small screens. Remove the prop from `PrimaryToolbar`.

## SimpleTableFilter

- `onFilterChange` prop is now required
- `widgetId` prop was removed

## SkeletonTable

The table is no longer using the `ReactTabular` implementation of PF table. It now uses the regular (previously know as `ComposableTable`) table components. The `SkeletonTable` interface has changed dramatically.

### No columns specification

```JSX
<SkeletonTable numberOfColumns={5} />
```

### Custom columns specification

```JSX
<SkeletonTable columns={["Foo", "Bar", "Baz"]} />
```

### Custom number of rows

```JSX
<SkeletonTable numberOfColumns={5} rows={33} />
```
