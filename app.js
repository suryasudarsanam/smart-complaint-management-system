const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // For serving static files like CSS

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Add authentication logic here
  if (username === "admin" && password === "password") {
    res.redirect("/complaints");
  } else {
    res.send("Invalid credentials. Please try again.");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
