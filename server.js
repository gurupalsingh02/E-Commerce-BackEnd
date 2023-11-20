const app = require("./app");

const { connectDatabase } = require("./config/database");
connectDatabase();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config/config.env" });
}
const port = process.env.PORT;

app.get("/",(req,res)=>{
    res.json({success:true,message:"E Commerce API HOME PAGE"});
});


app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `The page you are looking for does not exist`,
  });
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
