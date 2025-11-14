# OddJobs

OddJobs is a platform for those who need capable handyman work done in their homes or workplace. Whether you need a shelf fized, a tv mounted, or a hole in the wall filled, this is the place for you.

## Project Structure and Timelime

OddJobs is a CRUD web application that is made with this structure:

Frontend: ReactJS (Vite) --> Backend: Python (Flask) --> Database: SQLite (local edition)/PostgresQL (deployment)

In creating this web application, I decided to define each phase of its production into these catergories:
1. Initial App creation
2. Docker implementation
3. CI/CD Integration and Deployment

### 1. Initial App Creation
In this phase, I am focusing primarily on creating a functioning local version of the OddJobs web app. The tables within this app's database track Users (those posting and accepting jobs on the apps) and Jobs (the services that the users need). Here is the format for these database tables.

#### User Table Format
|userid|user_name|first_name|last_name|email|
|------|---------|----------|---------|-----|

#### Job Table Format
|jobid|user_name|address|description|fixer_name|status|
|-----|---------|-------|-----------|----------|------|