const GPUdb = require('./GPUdb.js')
var express = require("express");
var bodyParser = require('body-parser');
const util = require('util')


var analytics = new GPUdb(
  "https://cluster1450.saas.kinetica.com/cluster1450/gpudb-0",
  {
      username: "mhawkins_kinetica",
      password: "bIBp7z2KN_HaZL]ARPuD3E&sW1inlTF="
  }
);

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var stringToColour = (string, saturation = 20, lightness = 75) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
hash = string.charCodeAt(i) + ((hash << 5) - hash);
hash = hash & hash;
  }
  return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/barChartSingleColoured", async (req, res, next) => {
 try{
 console.log(req.body.sql)
 const q = await analytics.execute_sql(req.body.sql)
 const qres = q.data.column_1.map((key, i) => ({ [q.data.column_headers[0]]: key, value: q.data.column_2[i],color: stringToColour(key) }));
 res.json(qres);
 }catch(err){
 console.log(err)
 res.status(500).json({
      result: "error",
      message: err.message,
    });
 }
});

app.post("/getData", async(req,res,next) => {
 try{
 console.log(req.body.sql)
 const q = await analytics.execute_sql(req.body.sql)
 res.json(q.data)
 }catch(err){
 console.log(req.body.sql)
 console.log(err)
 res.status(500).json({
      result: "error",
      message: err.message,
    });
 }
});

app.post("/getHeatMapData", async(req,res,next) => {
 console.log(req.body.sql)
 const q = await analytics.execute_sql(req.body.sql)
 const ret = q.data.column_1.map((key, i) =>({
  id : key, data: [ {x: q.data.column_headers[1], y:q.data.column_2[i]},{ x:q.data.column_headers[2],y:q.data.column_3[i]},{ x:q.data.column_headers[3],y:q.data.column_4[i]},{ x:q.data.column_headers[4],y:q.data.column_5[i]},{ x:q.data.column_headers[5],y:q.data.column_6[i]},{ x:q.data.column_headers[6],y:q.data.column_7[i]},{ x:q.data.column_headers[7],y:q.data.column_8[i]} ]
}))
 res.json(ret)
})

app.listen(4000, () => {
 console.log("Server running on port 4000");
});
