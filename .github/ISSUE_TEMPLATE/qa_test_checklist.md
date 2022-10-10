name: QA
description: File a bug report
title: "[QA]: "
labels: ["enhancement"]
assignees
  - dennyabrain
body:
- type: dropdown
  attributes: 
    label: Platform
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



- type: dropdown
  attributes:
    label: Version
    options:
      - 0.1.5
      - 0.1.6
      - 0.1.7
      - 0.1.8
      - 0.1.9

