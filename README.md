# Performify
FYP - Employee Performance software using Node.js, Express.js, Pug.js, Sass(soon), MongoDB on mLab and Deployed with Heroku.

There is 4 types of users - An Employee, Manager, Senior Manager and Admin.

For the moment:
  An Admin can:
  - List All Users
  - View Users Profile
  - Edit a Users Profile to an extent eg Team, Role, Job Title.
  - Delete a user

  An Employee can:
  - Submit a Self-Review
  - View their Previous Self-Reviews
  - View a Preformance Review from their Manager 

  An Manager can:
  - List Employees on their Team
  - View an Employees profile that lists all the employees previous Self-Reviews and Performance Reviews from their manager and are able to view the reviews.
  - Submit a Self-Review
  - View their Previous Self-Reviews
  - View a Preformance Review from their Senior Manager 

An Senior Manager can:
  - List All Managers on in the company
  - View a Managers profile that lists all the Managers previous Self-Reviews and Performance Reviews from their Senior Manager and are able to view the reviews.
  - Submit a Self-Review
  - View their Previous Self-Reviews
  - to do:
    - list all senior managers in company, able to view other senior manager's profile and to be able to sumbit a review on them.

TO DO:
- Start on the Employee Engagement Side of Project
- Start On Data Analytics
 
 
To Start:
- Comment out the mLab refrence in Config/Database and put back in " database: 'mongodb://127.0.0.1:27017/performify-start' "
- Remove the node modules folder
- Run "Npm install"
- Run "nodemon app or node app.js"

Navigate to https://performify.herokuapp.com/
