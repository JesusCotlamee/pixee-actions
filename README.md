# Actions for Pixee Service

This repository contains GitHub Actions for interacting with the Pixee service. There are two actions available:

## 1. Upload File Pixee Action

This action uploads a file to an AWS S3 bucket associated with Pixee.

### Inputs

- `file`:
    - Description: File to be uploaded.
    - Required: true

- `url`:
    - Description: Endpoint URL where the file will be uploaded. (Optional)
    - Required: false

- `tool`:
    - Description: Specific property identifying the tool or service related to the uploaded file.
    - Required: true
    - Options:
      - `sonar`
      - `codeql`
      - `semgrep`

### Outputs

- `status`:
    - Description: Status.

### Example Usage

```yaml
jobs:
  upload-file:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Upload file to Pixee
        uses: pixee/upload-file@main
        with:
          file: path/to/your/file
          tool: your-tool-name
```

## 2. Trigger Pixee Action

This action triggers an analysis of pull requests in GitHub using Pixee.

### Inputs

- `url`:
    - Description: Endpoint URL where the analysis will be triggered. (Optional)
    - Required: false

- `pr-number`:
    - Description: PR number to trigger analysis for. (Optional)
    - Required: false

### Outputs

- `status`:
    - Description: Status.

### Example Usage

```yaml
jobs:
  trigger-pixee:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Trigger Pixee analysis
        uses: pixee/trigger@main
        with:
          url: ${{ secrets.PIXEE_ENDPOINT }}
          pr-number: ${{ github.event.pull_request.number }}
```
