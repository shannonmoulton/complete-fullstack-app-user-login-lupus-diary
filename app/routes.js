module.exports = function (app, passport, db, diaryLogModel) {
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("diary-logs")
      .find({ ownerId: req.user._id.valueOf() })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          diaryLogs: result,
        });
      });
  });

  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
  app.get("/log", isLoggedIn, async function (req, res) {
    var response = await diaryLogModel
      .find({ ownerId: req.user._id.valueOf() })
      .then((response) => {
        console.log(response);
        return response;
      });
    return res.render("log.ejs", {
      diaryLogs: response,
    });
  });

  app.post("/log", (req, res) => {
    var diaryLog = new diaryLogModel();
    diaryLog.ownerId = req.user._id;
    diaryLog.currentDate = req.body.currentDate;
    diaryLog.medication = req.body.medication;
    diaryLog.medicationTime = req.body.medicationTime;
    diaryLog.description = req.body.description;
    diaryLog.mood = req.body.mood;
    diaryLog.symptoms = req.body.symptoms;
    diaryLog.photo = req.body.photo;
    var response = diaryLog
      .save()
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    return res.redirect("/log");
  });

  app.delete("/diaryLogs", (req, res) => {
    db.collection("diary-Logs").findOneAndDelete(
      { name: req.body.name, msg: req.body.msg },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Diary Log deleted!");
      }
    );
  });

  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/signup",
      failureFlash: true,
    })
  );

  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
