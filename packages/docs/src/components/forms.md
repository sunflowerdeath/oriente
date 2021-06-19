---
imports:
    '{ TextInputExample, SwitchExample }': './InputExample'
---

# Forms

## Usage

## Example

```@render
<TextInputExample />
```

## Disabled

```@render
<TextInputExample isDisabled={true} />
```

## Multiline

```@render
<TextInputExample isMultiline={true} lines={2} maxLines={4} />
```

## Example

```@render
<SwitchExample label="Label" />

<SwitchExample label="Disabled" isDisabled={true} />
```
