## Analysis Input Pixee Action

The composite action combines two key functionalities to further simplify and automate analysis in the development workflow.

### Inputs

- `file`:
    - Description: File to be uploaded.
    - Required: true

- `tool`:
    - Description: Specific property identifying the tool or service related to the uploaded file.
    - Required: true
    - Options:
        - `sonar`
        - `codeql`
        - `semgrep`

- `url`:
    - Description: Endpoint URL where the file will be uploaded. (Optional)
    - Required: false

- `pr-number`:
    - Description: PR number to trigger analysis for. (Optional)
    - Required: false

### Outputs

- `status`:
    - Description: Status.

### Example Usage

See the examples folder for copy/paste usable example workflows.

* [Upload file](../examples/upload-file.yml)
