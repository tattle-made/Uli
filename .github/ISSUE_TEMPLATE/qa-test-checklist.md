name: QA
description: File a bug report
title: "[QA]: "
labels: ["enhancement"]
assignees:
  - dennyabrain
body:
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

