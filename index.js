const express = require("express")

const mongoose = require("mongoose")

const app = express()

app.use(express.json())

const connect  = ()=>{
  mongoose.connect("mongodb://127.0.0.1:27017/bank")
}

const usersSchema = mongoose.Schema(
    {
        firstName:{type:String, require:true},
        middleName:{type:String ,require:false},
        lastName:{type:String , require:true},
        age:{type:Number , require:true},
        email:{type:String ,require:true},
        address:{type:String ,require:true},
        gender:{type:String ,require:false , default:"Female"},
        type:{type:String , require:false , default:"customer"},

    },
    {
        versionkey:false,
        timestamps:true
    }
)

const Users = mongoose.model("users",usersSchema)

const barnchdeatilSchema = mongoose.Schema(
    {
        name:{type:String , require:true},
        address:{type:String ,require:true},
        IFSC : {type:String , require:true},
        MICR : {type:Number , require:true},
        
    },
    {
        versionkey:false,
        timestamps:true
    }
)

const BranchDetail = mongoose.model("branch",barnchdeatilSchema)

const masterSchema = mongoose.Schema(
    {
        balance:{type:Number , require:true},
        userId :{type:mongoose.Schema.Types.ObjectId ,require:true , ref:"users"},
        branchId:{type:mongoose.Schema.Types.ObjectId ,require:true , ref:"branch"}
    },
    {
        versionkey:false,
        timestamps:true
    }
)

const Master = mongoose.model("masterAccount",masterSchema)


const savingSchema = mongoose.Schema(
    {
        acountNumber:{type : Number , require:true},
        balance:{type : Number , require:true},
        interstRate:{type : Number ,require:true},
        masterId:{type :mongoose.Schema.Types.ObjectId , require:true , ref:"masterAccount"}
    },
    {
        versionkey:false,
        timestamps:true
    }
)

const Saving = mongoose.model("savingAccount",savingSchema)

const fixedSchema = mongoose.Schema(
    {
        accountNumber:{type:Number , require:true},
        balance:{type:Number , require:true},
        interstRate :{type:Number , require:true},
        startDate :{type:String , require:true},
        maturityDate:{type:String ,require:true},
        masterId:{type :mongoose.Schema.Types.ObjectId , require:true , ref:"masterAccount"}
    },
    {
        versionkey:false,
        timestamps:true
    }
)

const Fixed = mongoose.model("fixedAccount",fixedSchema)


app.get("/masterAccount", async(req, res)=>{
    try {
        const master = await Master.find({}).lean().exec();

        return res.status(200).send({master:master})
    } catch (error) {
        return res.status(500).send({error:error})
    }
})

app.post("/masterAccount", async(req, res)=>{
    try {
        const master = await Master.create(req.body)

        return res.status(200).send({master:master})
    } catch (error) {
        return res.status(500).send({error:error})
    }
})


app.post("/savingsAccount", async (req,res)=>{
    try {
        const savings = await Saving.create(req.body)

        return res.status(201).send({savings:savings})
    } catch (error) {
        return res.status(500).send({error:error})
    }
})

app.post("/fixedAccount", async (req,res)=>{
    try {
        const fixed = await Fixed.create(req.body)

        return res.status(201).send({fixed:fixed})
    } catch (error) {
        return res.status(500).send({error:error})
    }
})

app.get("/masterAccount/:id", async (req,res)=>{
    try {
        const master = await Master.findById(req.params.id ,req.body , {new:true})
        
        .lean().exec()

        return res.status(201).send({master:master})
    } catch (error) {
        return res.status(500).send({error:error})
    }
})

app.delete("/fixed/:id" , async (req,res) =>{
    try {
        const fixed = await Fixed.findByIdAndDelete(req.params.id).lean().exec()

        return res.status(201).send({fixed:fixed})
    } catch (error) {
        return res.status(500).send({error:error})
    }
})

app.listen(5000, async ()=>{
    try {
        await connect()
    } catch (error) {
        console.log(error)
    }
    console.log("listening on 5000")
})