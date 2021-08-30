const constants = require("../../utils/constants");
const validators=require('../../utils/validation');
const meeting=require('../../model/meeting');

const bookingService=async(startTime,endTime,capacity)=>{
    let isbufferOverLap=validators.bufferValidator(startTime,endTime);
    let durationCheck=validators.durationCheck(startTime,endTime);
    let datesValid=validators.dateParser(startTime,endTime);
    let isStartValid=validators.startInterval(startTime);
    if  (
            isStartValid && 
            datesValid.length!=0 &&
            durationCheck
        )
    {    
        let compatibleRooms=validators.compatibleRooms(capacity);
        if(compatibleRooms.length===0){
            return constants.NVR;  
        }
        if(isbufferOverLap){
            return constants.NVR; 
        }

        let roomArr=compatibleRooms.map(e=>{
        return e.name;
        });
        //console.log(roomArr);
        
        let {index}=await meeting.fetchForAdd(startTime,endTime,roomArr);
        
        if(index!=-1)
        {
            let  createResult=
                await meeting.createRec({
                    startTime,
                    endTime,
                    members:capacity,
                    room:roomArr[index]
                });
            if(createResult.room){
                return constants[createResult.room];
            }
            //console.log(createResult.id);
        }
        else
        {
            return constants.NVR;
        }
    }
    else
    {
       return  constants.II;
    }

}

module.exports={
    bookingService
}