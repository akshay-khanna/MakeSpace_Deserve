const constants = require("../../utils/constants");
const validators=require('../../utils/validation');
const meeting=require('../../model/meeting');
const vacancyService=async(startTime,endTime)=>{
    let isbufferOverLap=validators.bufferValidator(startTime,endTime);
    let durationCheck=validators.durationCheck(startTime,endTime);
    let datesValid=validators.dateParser(startTime,endTime);
    let isStartValid=validators.startInterval(startTime);
    if(
        isStartValid && 
        (datesValid.length!=0) &&
        durationCheck &&
        (!isbufferOverLap)
      )
    { 
        roomArr=constants.rooms.map(e=>{
        return e.name;
        });
        //console.log(roomArr);
        let availRoom=await meeting.fetchForVacancy(startTime,endTime,roomArr);
        
        if( availRoom.length===0){
            return constants.NVR ;
        }
        else
        {
             let availRoomList=availRoom.map((e)=>{
                return constants[e];
            });
            return availRoomList.join(" ");
        }
    }
    else if(isbufferOverLap){
        return constants.NVR;
    }
    else
    {
        return constants.II;
    }

}

module.exports={
    vacancyService
}