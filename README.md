# OddJobs - Secure Software Deployment Pipeline

The goal of this project is to mimic and document the flow of full-stack application creation and secure deployment through a cloud service provider. The critical elements of this workflow include the following:

1. My Web Application (Titled: Odd Jobs)
2. CI/CD Pipeline (GitHub Actions)
3. Cloud provider service for deployment (AWS EC2)

## Project Workflow

The deployment of OddJobs will follow this workflow:

``` mermaid
flowchart TD
    A[Application Creation] --> B[Security Scanning and Testing through GitHub Actions CI/CD]

    B -->|Passed| C[Deploy]
    B -->|Failed| D[Developer remediates vulnerabilities]

    D --> B
```

## Odd Jobs

OddJobs is a platform for those who need capable handyman work done in their homes or workplace. Whether you need a shelf fixed, a tv mounted, or a hole in the wall filled, this is the place for you.

The app follows this structure:

``` mermaid
flowchart LR
  A[Database:  PostgreSQL] --> B[Backend: Python Flask] --> C[Frontend: ReactJS]
```
