const express = require("express");
const ejs = require("ejs");
const app = express();
const bp = require("body-parser");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const url =
  "mongodb+srv://22pa1a12g7:22pa1a12g7@cluster0.rg2rl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
app.use(bp.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
let dbClient;
async function connectToDB() {
  if (!dbClient) {
    try {
      dbClient = new MongoClient(url);
      await dbClient.connect();
      console.log("Connected to MongoDB");
    } catch (error) {
      console.log("Failed to connect to MongoDB", error);
      process.exit(1);
    }
  }
}
connectToDB();
app.get("/", async (req, res) => {
  try {
    const storage = dbClient.db("complaintsDB").collection("complaints");
    const complaints = await storage.find({}).sort({ likes: -1 }).toArray();
    res.render("home", { complaints });
  } catch (error) {
    console.log("Error fetching complaints", error);
  }
});
app.get("/form", (req, res) => {
  res.render("form");
});
app.post("/form", async (req, res) => {
  const data = req.body;
  console.log("Form data received", data);
  try {
    const storage = dbClient.db("complaintsDB").collection("complaints");
    await storage.insertOne({ ...data, likes: 0 }); 
    console.log("Data submitted", data);
    res.redirect("/");
  } catch (error) {
    console.log("Error inserting data", error);
  }
});
app.post("/like/:id", async (req, res) => {
  const complaintId = req.params.id;
  try {
    const storage = dbClient.db("complaintsDB").collection("complaints");
    await storage.updateOne(
      { _id: new ObjectId(complaintId) },
      { $inc: { likes: 1 } },
    );
    res.redirect("/");
  } catch (error) {
    console.log("Error liking complaint", error);
  }
});
app.post("/filter", async (req, res) => {
  const filter = req.body.filtervalue; 
  try {
    const storage = dbClient.db("complaintsDB").collection("complaints");
    let query = {};
    if (filter !== "all") {
      query = { department: filter };
    }
    const filteredComplaints = await storage.find(query).toArray();
    res.render("home", { complaints: filteredComplaints, filterValue: filter });
  } catch (error) {
    console.log("Error filtering complaints", error);
  }
});
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
