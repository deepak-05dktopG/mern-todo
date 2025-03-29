//Express
const express = require("express");
const app = express();
app.use(express.json());
const PORT = 8000;
const cors = require('cors');
app.use(cors());

const mongoose = require("mongoose");

//connecting mongodb
mongoose
  .connect("mongodb://localhost:27017/mern-app")
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("Error in DB is : ", err);
  });

//creating Schema
const todoSchema = new mongoose.Schema({
  title: { required: true, type: String },
  description: String,
});
//creating model
const todoModel = mongoose.model("Todo", todoSchema);

//create a new todo item
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in creating new todo item" });
  }
})

//get all items
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in creating new todo item" });
  }
});

//update all items
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id

    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in creating new todo item" });
  }
});

//delete todos
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in creating new todo item" });
  }
}); 

//Start the server
app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
