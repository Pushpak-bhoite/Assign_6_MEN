app.post('/register', async (req, res) => {
    try {
        console.log(req.body.password);
        if (req.body.password === req.body.confirmPass) {
            var form = new formidable.IncomingForm();
            let fields;
            let files;
            try {
                [fields, files] = await form.parse(req);
            }
            catch (err) {
                console.log(err)
            }
            if (files) {
                let oldPath = files.userPhoto[0].filepath;
                let og_file_path = path.join(__dirname, '../templates/views/uploads') + '/' + files.userPhoto[0].originalFilename;
                const hexaPass = await bycrpt.hash(fields.password[0], 5);
                const newUser = new User({
                    firstname: fields.firstname[0],
                    lastname: fields.lastname[0],
                    email: fields.email[0],
                    mobile: fields.mobile[0],
                    gender: fields.gender[0],
                    password: hexaPass,
                    userPhoto: og_file_path
                });
                const result = newUser.save();
                var folderpath = path.join(__dirname, '../template/views/uploads/' + result._id);
                if (!fs.existsSync(folderpath)) {
                    fs.mkdirSync(path.join(__dirname, '../template/views/uploads/' + result._id));
                }
                var newpath = path.join(__dirname, '../template/views/uploads/' + result._id + "/" + files.userPhoto[0].originalFilename);
                fs.copyFile(oldPath, newpath, function (err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }
                });
                console.log("Registered Successfully");
                return res.redirect('/');
            };
        } else {
            return res.status(400).redirect('/register');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).redirect('/register');
    }
});

app.post('/upload', (req, res, next) => {
    console.log(req.body.mydata+"***********")
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

        if (err) {
            console.log(err);
            return res.status(500).send('intenal server Error ')
        }

        // Check if files were uploaded
        if (!files || !files.profilePic || !files.profilePic.length) {
            return res.status(400).send('No files uploaded or incorrect field name');
        }

        let oldPath = files.profilePic[0].filepath;
        let newPath = path.join(__dirname, '../template/views/uploads') + `/` + files.profilePic[0].originalFilename
        console.log(newPath + "-------------")
        let rawData = fs.readFileSync(oldPath)

        fs.writeFile(newPath, rawData, function (err) {
            if (err) console.log(err + "******************")
            return res.send("Successfully uploaded")
        })
    })
});













app.patch("/editUser/:id", async (req, res ,next) => {
    try {
          // ----------------------------Upload Img--------------------------
          const form = new formidable.IncomingForm();
          form.parse(req, function (err, fields, files) {
      
              if (err) {
                  console.log(err);
                  return res.status(500).send(' intenal server Error ')
              }
      
              // Check if files were uploaded
              if (!files || !files.profilePic || !files.profilePic.length) {
                  return res.status(400).send('No files uploaded or incorrect field name');
              }
      
              let oldPath = files.profilePic[0].filepath;
              let newPath = path.join(__dirname, '../template/views/uploads') + `/` + files.profilePic[0].originalFilename
              console.log(newPath + "-------------")
              let rawData = fs.readFileSync(oldPath)
      
              fs.writeFile(newPath, rawData, function (err) {
                  if (err) console.log(err + "******************")
                  return res.send("Successfully uploaded")
              })
  
              // res.redirect('/users');
          })


        const userId = req.params.id;
        const newData = req.body; // Assuming the updated data is sent as 'data'
        const result = await User.findByIdAndUpdate({ _id: userId }, { $set: newData }, { new: true });
        console.log(result)

        if (!result) {
            return res.status(404).send("User not found");
        }
        // res.redirect("/dashboard"); // Redirect to the homepage or any other appropriate page after successful update

    } catch (error) {
        res.status(500).send(error + "This is error");
    }
});













try {
    var form = new formidable.IncomingForm();
    let fields;
    let files;
    try {
        [fields, files] = await form.parse(req);
    }
    catch (error) {
        console.log(error);
    }
    if (files) {
        var oldPath = files.userPhoto[0].filepath;
        const og_file_path = files.userPhoto[0].originalFilename;
        console.log(fields.userID)
        const result = await User.updateOne(
            { _id: fields.userID },
            {
                $set: {
                    firstname: fields.firstname[0],
                    lastname: fields.lastname[0],
                    email: fields.email[0],
                    gender: fields.gender[0],
                    mobile: fields.mobile[0],
                    photo: og_file_path
                }
            }
        );
        var folderpath = path.join(__dirname, '../templates/views/uploads/' + fields.userID);
        console.log(folderpath);
        if (!fs.existsSync(folderpath)) {
            fs.mkdirSync(path.join(__dirname, '../templates/views/uploads/' + fields.userID));
        }
        var newpath = path.join(__dirname, '../templates/views/uploads/' + fields.userID + "/" + files.userPhoto[0].originalFilename);
        fs.copyFile(files.userPhoto[0].filepath, newpath, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).redirect('/secret');
            }
        });
    }
    res.redirect('/secret');
}
catch (err) {
    console.log(err);
    res.status(400).redirect('/secret')
}
});









                          
                          
app.post("/register", async (req, res) => {
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ fmail: req.body.fmail });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }

        // Check if password matches confirm password
        if (req.body.fpass !== req.body.fcpass) {
            return res.status(400).send("Passwords do not match");
        }
        // DATA ENCRYPTION
        const hashPassword = await bcrypt.hash(req.body.fpass, 10);
        // Create a new user
        const newUser = new User({
            ffname: req.body.ffname,
            flname: req.body.flname,
            fmail: req.body.fmail,
            fphone: req.body.fphone,
            fpass: hashPassword,
            fgender: req.body.fgender
        });

        // Save the user to the database
        await newUser.save();

        // Send response indicating successful registration
        res.render('pandalogin')
    } catch (error) {
        // Handle any errors that occur during registration
        res.status(500).send("An error occurred during registration");
    }
});