
url2="mongodb://localhost/student";
const mongoose=require("mongoose")
db_status=null
module.exports={   
    db_connect:()=>{
        mongoose.connect(url2,(err,data)=>{
            if(!err)
            {
                console.log("db connected");
                db_status=data;                
            }
            else{
                console.log(err+"  db not connected");
            }
        })
    },
    get_db_status:()=>{        
        return db_status;        
    }
}
