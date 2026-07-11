# Importing Slurs

Admins can bulk-import crowdsourced slurs into the platform from a CSV file at `/admin/import-slurs`. This is useful for onboarding data from offline collection exercises, external datasets, or expert review sessions.

Regular users do not have access to this page. Attempting to visit it will redirect to the home page.

---

## Overview

The import flow has three steps:

1. **Upload** — pick a CSV file and validate its structure
2. **Preview & Configure** — review parsed rows, assign a contributor, and optionally override the language and source for all rows
3. **Done** — see a summary of how many rows were imported

---

## Step 1 — Prepare your CSV file

### Required columns

Your CSV must have at least these three columns (header names are case-sensitive):

| Column | Description |
|--------|-------------|
| `label` | The slur text |
| `level_of_severity` | `low`, `medium`, or `high` |
| `categories` | One or more categories, separated by `\|` (pipe) |

### Optional columns

These columns can be left out entirely or left blank on individual rows:

| Column | Description |
|--------|-------------|
| `source` | `plugin`, `experts_2022`, or `crowdsourcing_exercise` — can be assigned for all rows in step 2 |
| `language` | ISO 639-3 language code (e.g. `hin`, `tam`, `ben`) — can be assigned for all rows in step 2 |
| `casual` | `true` or `false` |
| `appropriated` | `true` or `false` |
| `appropriation_context` | `true` or `false` |
| `meaning` | Free-text definition |
| `page_url` | URL of the source page |

### Categories

The `categories` column accepts one or more of the following values, separated by `|`:

`gendered`, `sexualized`, `religion`, `ethnicity`, `political_affiliation`, `caste`, `class`, `body_shaming`, `ableist`, `sexual_identity`, `other`

### Example CSV

```csv
label,level_of_severity,categories,source,language,casual,appropriated,meaning
mc,high,gendered|other,crowdsourcing_exercise,hin,false,false,a common expletive
bc,high,gendered,crowdsourcing_exercise,hin,false,false,
kalmuhi,medium,gendered|body_shaming,experts_2022,ben,false,false,derogatory term for appearance
```

---

## Step 2 — Preview and configure

After uploading, you will see a table showing every row parsed from the CSV along with its validation status.

### Override controls

Three dropdowns at the top let you assign values that apply to **all rows** in the file:

- **Assign contributor user** *(required)* — every imported slur will be attributed to this user. The CSV does not need a user column; this must always be set here.
- **Override language** — sets the language for all rows, replacing whatever is in the CSV `language` column. Useful when importing a dataset for a single language.
- **Override source** — sets the source for all rows. If the CSV has no `source` column, you must select a source here before you can import.

### Row validation

Each row is validated in real time as you change the overrides:

- **Valid** rows (shown normally) will be imported.
- **Invalid** rows (highlighted in red) show specific field errors and will be **skipped** during import. Fix the CSV and re-upload if you need those rows.

Common reasons a row may be invalid:

| Error | Cause |
|-------|-------|
| `label: can't be blank` | The `label` column is empty for this row |
| `level_of_severity: can't be blank` | Missing or blank severity value |
| `level_of_severity: is invalid` | Value is not `low`, `medium`, or `high` |
| `categories: can't be blank` | No categories provided for this row |
| `categories: is invalid` | One or more category values don't match the allowed list |
| `language: must be a valid ISO 639-3 language code` | The language code is not recognised — check the [supported languages list](#supported-languages) |

### Blocking conditions

The **Import** button stays disabled until:

1. A contributor user is selected
2. Every row either has a `source` value in the CSV or a source override is selected

---

## Step 3 — Import complete

After clicking **Import**, a summary shows how many rows were successfully inserted and how many failed at the database level. Click **Import Another File** to start a new import.

---

## Supported languages

The platform recognises the following ISO 639-3 language codes:

| Code | Language |
|------|----------|
| `asm` | Assamese |
| `ben` | Bengali |
| `brx` | Bodo |
| `doi` | Dogri |
| `guj` | Gujarati |
| `hin` | Hindi |
| `kan` | Kannada |
| `kas` | Kashmiri |
| `kok` | Konkani |
| `mai` | Maithili |
| `mal` | Malayalam |
| `mni` | Manipuri |
| `mar` | Marathi |
| `nep` | Nepali |
| `ori` | Odiya |
| `pan` | Punjabi |
| `san` | Sanskrit |
| `sat` | Santhali |
| `snd` | Sindhi |
| `tam` | Tamil |
| `tel` | Telugu |
| `urd` | Urdu |

---

## Tips

- **Always use the language override** when importing a single-language dataset — it saves having to fill in the `language` column for every row.
- **Rows with errors are skipped**, not rejected wholesale. You can import the valid rows first and fix the invalid ones in a follow-up file.
- **The contributor user does not need to be an admin.** You can attribute imported slurs to any registered user, including a dedicated "import" or "system" account.
- **There is no undo.** Review the preview table carefully before clicking Import. If you import incorrect data, rows must be deleted individually from the contributions page.
