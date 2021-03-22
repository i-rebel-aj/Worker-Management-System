## Worker nmanagement System

#### This is a simple worker management system, built with node.js, express js , mongoDB and uses EJS as the templating language

### Stakeholders
- Manager
- Worker

###  Functionalities

### Manager

- Able to login/signup with email and password.
- Able to post/edit the tasks (with details), set estimated time to complete the full task(minute, hour, days) and the points(1-500) to be rewarded for the task on completion.
- Able to view the task submitted by the user and rate the task. (Rewards to be assigned to users if a task is approved).
- Able to view the tasks done/assigned/pending on using a date filter.

#### Worker

- Able to login with email and password.
- Able to view the tasks posted by any manager. (paginated tasks).
- Users should do the task and submit the task details (images/docs or text) for review. it will go to the manager and it will be approved/rejected.
- Able to search the task.
- Able to view/edit his profile details.
- Able to view the completed task history (paginated) and the total rewards.
