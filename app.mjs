// index.js
import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';
import { Admin, User, Dealership, Deal, Car, SoldVehicle } from './Schema/allSchema.mjs'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config();
const { PORT = 3000, MONGODB_URI, JWT_SECRET } = process.env;
const app = express();
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, minPoolSize:20 });
const database=client.db("Data");
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
  console.log('hi home')
  res.send("hi");
})

app.get('/addadmin',async(req,res)=>{
  try {
    console.log("hiadmin");
    const data={admin_id:'13235',password:"123456"};
    console.log(data);
    
    const collection=database.collection('Admin');
    const newAdmin= await collection.insertOne(new Admin(data));
    console.log('newadmin',newAdmin);
  
    res.send(newAdmin);
  } catch (error) {
    console.log(error);
  }
})

// app.get('/userlogin',async(req,res)=>{
//   try {
//     const data={user_email :'8765499999999993',password:"12345"};
//     const user=await database.collection('User').findOne({user_email:data.user_email});
//     console.log('User',user);
//     if (!user) {
//       throw new Error('User not found');
//     }
    
//     // Compare passwords
//     if (user.password === data.password) {
//       res.send(user);
//     } else {
//       throw new Error('Password does not match');
//     }
    
//   } catch (error) {
//     console.log(error)
//   }
// })

app.post('/userregister',async(req,res)=>{
  try {
    console.log("hi user");
    const {user_email,user_location,user_info,password,vehicle_info}=req.body;
    const user=await database.collection('User').findOne({user_email});
    if(user){
      throw new Error("user already exist")
    }
    const haspass=await bcrypt.hash(password,10);
    console.log(haspass);
    const collection=database.collection('User');
    const newUser= await collection.insertOne(new User({user_email,user_location,user_info,password:haspass,vehicle_info}));
    console.log('newUser',newUser);
    res.send(newUser);
  } catch (error) {
    console.log(error);
  }
})


app.post('/userlogin',async(req,res)=>{
  try {
    const {user_email, password}=req.body;
    console.log(req.body);
    const user=await database.collection('User').findOne({user_email});
    console.log('User',user);
    if (!user) {
      throw new Error('User not found');
    }
    // Compare passwords
    if (bcrypt.compare(password,user.password)) {
      // const isMatch=await bcrypt.compare(password,userLogin.password); 
            console.log('ok')
            //token generation
            const token= jwt.sign({_id:user._id},'qwertyuiopasdfghjklzxcvbnm1234567890', { expiresIn: '1d' }); //generateAuthToken will define at userSchema page
            console.log(token);
            if(token){
                console.log("token generated Successfully");
                console.log(token);
            }else{
                console.log("no token generated");
            }
            //adding token as cokkie in the web browser to identify that the user is login or not
            //if there is no cokkie in the web browser cookie section the user will assume as logout

            res.cookie("usertoken",token,{
                expires: new Date(Date.now() + 25892000000),
                httpOnly:true
            });

      res.send(user);
    } else {
      throw new Error('Password does not match');
    }
  } catch (error) {
    console.log(error)
  }
})

app.post('/user-change-password', async (req, res) => {
  try {
    const { user_email, oldPassword, newPassword } = req.body;

    // Find the user by user_email
    const user = await database.collection('User').findOne({ user_email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the old password is correct
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await database.collection('User').updateOne({ user_email }, { $set: { password: hashedPassword } });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/dealerregister',async(req,res)=>{
  try {
    console.log("hi dealer");
    const {dealership_email,dealership_name,dealership_location,dealership_info, password}=req.body;
    const dealer=await database.collection('Dealer').findOne({dealership_email});
    if(dealer){
      throw new Error("Dealer already exist")
    }
    const haspass=await bcrypt.hash(password,10);
    const collection=database.collection('Dealer');
    const newDealer= await collection.insertOne(new Dealership({dealership_email,dealership_name,dealership_location,dealership_info, password:haspass}));
    console.log('newDealer',newDealer);
    res.send(newDealer);
  } catch (error) {
    console.log(error);
  }
})

app.post('/dealerlogin',async(req,res)=>{
  try {
    const {dealership_email, password}=req.body;
    console.log(req.body);
    const Dealer=await database.collection('Dealer').findOne({dealership_email});
    console.log('Dealer',Dealer);
    if (!Dealer) {
      throw new Error('Dealer not found');
    }
    // Compare passwords
    if (bcrypt.compare(Dealer.password,password)) {
      res.send(Dealer);
    } else {
      throw new Error('Password does not match');
    }
  } catch (error) {
    console.log(error)
  }
})

app.post('/dealer-change-password', async (req, res) => {
  try {
    const { user_email, oldPassword, newPassword } = req.body;

    // Find the user by user_email
    const user = await database.collection('Dealer').findOne({ dealership_email:user_email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the old password is correct
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await database.collection('Dealer').updateOne({ user_email }, { $set: { password: hashedPassword } });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/addcar',async(req,res)=>{
  try {
    const {type, name, model, car_info}=req.body;
    console.log(req.body);
    const car = await database.collection('Cars').insertOne({type, name, model, car_info});
    console.log(car.insertedId);
    await database.collection('Dealer').updateOne(
       {_id: new ObjectId(car_info.dealer_id)},
      { $push: { cars: car.insertedId } }
    );
    res.send(car);

  } catch (error) {
    console.log(error);
  }
})

app.post('/updatecar', async (req, res) => {
  try {
    const { type, name, model, car_info, car_id } = req.body;
    console.log(req.body);

    const car = await database.collection('Cars').updateOne(
      { _id: ObjectId(car_id) },
      { $set: { type, name, model, car_info } }
    );

    if (car.modifiedCount === 0) {
      throw new Error("Car not found");
    }

    res.status(200).json({ message: 'Car updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/adddeal',async(req,res)=>{
  try {
    const {car_id,deal_info}=req.body;
    // const dealer_id='65d70cb9b02d693ec3a4371a';// id of the login dealer
    const deal = await database.collection('Deals').insertOne({car_id,deal_info});
    console.log(deal.insertedId);
    await database.collection('Dealer').updateOne(
       {_id: new ObjectId(deal_info.dealer_id)},
      { $push: { deals: deal.insertedId } }
    );
    res.send(deal);
  } catch (error) {
    
  }
})

app.post('/addsoldvehicle',async(req,res)=>{
  try {
    console.log("add vehicle");
    const {car_id,vehicle_info,user_id}=req.body;
    // const dealer_id='65d70cb9b02d693ec3a4371a';// id of the deler who creat the deal  --- add it in the vehicle ingo sec

    console.log(req.body);
    const newSoldVehicle= await database.collection('SoldVehicle').insertOne(new SoldVehicle({car_id,vehicle_info}));
    console.log('new vihicle',newSoldVehicle.insertedId);

    await database.collection('Dealer').updateOne(
      {_id: new ObjectId(vehicle_info.dealer_id)},
     { $push: { sold_vehicles: newSoldVehicle.insertedId } });
     
    await database.collection('User').updateOne(
      {_id: new ObjectId(user_id)},
     { $push: { vehicle_info: newSoldVehicle.insertedId } }
   );
   //also add in the user data who buy it i.e login user
    res.send(newSoldVehicle);
  } catch (error) {
    console.log(error);
  }
})

app.get('/alldeals',async(req,res)=>{
  try {
    console.log("getting all deals");
    const dealsCollection = database.collection('Deals');
    const allDeals = await dealsCollection.find({}).toArray();
    console.log(allDeals);
    res.send(allDeals)
  } catch (error) {
    console.log(error);
  }
})

app.post('/getuserdata',async(req,res)=>{
  const {_id}=req.body;
  console.log("nndkjfjl",_id);
  try {
    const user = await database.collection('User').findOne({ _id: new ObjectId(_id) });

    console.log("userdata",user);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
 

})

app.post('/getdealserdata',async(req,res)=>{
  const {_id}=req.body;
  console.log("dealer id",_id);
  try {
    const dealer = await database.collection('Dealer').findOne({ _id: new ObjectId(_id) });

    console.log("dealerdata",dealer);
    res.send(dealer);
  } catch (error) {
    console.log(error);
  }
})

app.post('/getsoldvehiclebyid',async(req,res)=>{
  const {_id}=req.body;
  console.log('vehicle id',_id);
  try {
    const vehicle=await database.collection('SoldVehicle').findOne({_id:new ObjectId(_id)});
    console.log("vehicle",vehicle);
    res.send(vehicle);
  } catch (error) {
    console.log(error);
  }
})

app.post('/getcardet',async(req,res)=>{
  const {_id}=req.body;
  console.log('car id', _id);
  try {
    const car=await database.collection('Cars').findOne({_id:new ObjectId(_id)});
    console.log("car ", car);
    res.send(car);
  } catch (error) {
    console.log(error);
  }
})

app.post('/getdealerbyid',async(req,res)=>{
  try {
    const {id}=req.body;
    const Dealer=await database.collection('Dealer').findOne({_id: new ObjectId(id)});
    console.log('Dealer',Dealer);
    res.send(Dealer)
  } catch (error) {
    console.log(error);
  }
})

app.post('/getcarbyid',async(req,res)=>{
  try {
    const {_id}=req.body;
    console.log("getcarby id ", _id)
    const Car=await database.collection('Cars').findOne({_id: new ObjectId(_id)});
    console.log(Car);
    res.send(Car);
  } catch (error) {
    console.log(error);
  }
})

app.post('/getdealsbyid',async(req,res)=>{
  try {
    const {_id}=req.body;
    console.log("getcarby id ", _id)
    const Car=await database.collection('Deals').findOne({_id: new ObjectId(_id)});
    console.log(Car);
    res.send(Car);
  } catch (error) {
    console.log(error);
  }
})

app.post('/getvehiclesbyid',async(req,res)=>{
  try {
    const {_id}=req.body;
    console.log("getcarby id ", _id)
    const Car=await database.collection('SoldVehicle').findOne({_id: new ObjectId(_id)});
    console.log(Car);
    res.send(Car);
  } catch (error) {
    console.log(error);
  }
})

const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
// Start the server
app.listen(PORT,async () => {
  await connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});