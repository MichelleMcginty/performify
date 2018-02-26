// router.get('/add', function(req, res){
//     res.render('add');
//   });
  
//   // Register process
//   router.post('/add', function(req, res){
//     const name = req.body.name;
//     const email = req.body.email;
//     const password = req.body.password;
//     const role = req.body.role;
//     const team = req.body.team;
//     const title = req.body.title;
  
//     req.checkBody('name', 'Name is required').notEmpty();
//     req.checkBody('email', 'Email is required').notEmpty();
//     req.checkBody('email', 'Email is required').isEmail();
//     req.checkBody('password', 'Password is required').notEmpty();
//     req.checkBody('role', 'Role is required').notEmpty();
//     req.checkBody('team', 'Team is required').notEmpty();
//     req.checkBody('title', 'Title is required').notEmpty();
  
//     let errors = req.validationErrors();
  
//     if(errors){
//       res.render('add', {
//         errors: errors
//       });
//     } else {
//       let newEmployee = new User({
//         name: name,
//         email: email,
//         password: password,
//         role: role,
//         team: team,
//         title: title
//       });
//       bcrypt.genSalt(10, function(err, salt){
//         bcrypt.hash(newEmployee.password, salt, function(err, hash){
//           if(err){
//             console.error(err);
//           }
//           newEmployee.password = hash;
  
//           newEmployee.save(function(err){
//             if(err) {
//               console.error(err);
//               return;
//             } else {
//               req.flash('success', 'Employee added');
//             }
//           });
//         });
//       })
//     }
//   });