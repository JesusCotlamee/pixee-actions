# GitHub Actions for Pixee

This repository contains GitHub Actions for interacting with the Pixee.

## 1. Upload File

This action uploads a file to an AWS S3 bucket. Essentially, it facilitates the process of uploading relevant files for further processing or reference.

## 2. Trigger

This action triggers an analysis of pull requests on GitHub using Pixee. By triggering the analysis automatically in response to certain events, such as the opening of a pull request,
this action helps keep the analysis process seamlessly integrated into the development workflow.

## 3. Composite

The composite action combines these two fundamental functionalities to further simplify and automate the analysis process in the development workflow,
providing a comprehensive solution for code analysis with Pixee in GitHub.

### Usage:

Workflows can be called from other repositories using the `uses` clause and passing the necessary inputs and secrets.

### Examples:

See the examples folder for copy/paste usable example workflows.

* [Analysis input](examples/analysis-input.yml)
* [Upload file](examples/upload-file.yml)
* [Trigger](examples/trigger.yml)
