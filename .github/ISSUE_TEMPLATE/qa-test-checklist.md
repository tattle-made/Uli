body:
- type: markdown
  attributes:
    value: | 
      "### QA Checklist for Uli"
      Please use this as a guide for testing Uli. Please provide additional info on any issues that you discover during testing in the comments
      
- type: dropdown
  attributes: 
    label: "Platform"
    options: 
      - Chrome
      - Brave
      - Firefox

- type: checkboxes
  attributes:
    label: Tasks
    options:
      - label: Slur Replacement
      - label: Local Tweet Archiving
      - label: Remote Tweet Archiving
      - label: Updating Preferences
      - label: OGBV ML filter
