const constants = require("../../utils/constants");
const validators=require('../../utils/validation');
const meeting=require('../../model/meeting');
const cancelService=async(startTime,endTime)=>{
    let isbufferOverLap=validators.bufferValidator(startTime,endTime);
    let durationCheck=validators.durationCheck(startTime,endTime);
    let datesValid=validators.dateParser(startTime,endTime);
    let isStartValid=validators.startInterval(startTime);
    /*console.log('isStartValid',isStartValid);
    console.log('datesValid',datesValid.length);
    console.log('durationCheck',durationCheck);
    console.log('isbufferOverLap',isbufferOverLap);*/
    if(
        isStartValid &&
        (datesValid.length!=0) &&
        durationCheck &&
        (!isbufferOverLap)
      )
    { 
        //console.log("in If")
        roomArr=constants.rooms.map(e=>{
            return e.name;
            });
        let isCancel =await meeting.fetchForCancel(startTime,endTime,roomArr);
        return (isCancel)?  constants.CS:constants.NBF;
    }
    else{

        return constants.II;
    }
}
module.exports={
    cancelService
}