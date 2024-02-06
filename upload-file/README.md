## Upload File Pixee Action

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

See the examples folder for copy/paste usable example workflows.

* [Upload file](../examples/upload-file.yml)
