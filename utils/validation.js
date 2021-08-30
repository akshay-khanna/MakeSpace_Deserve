

const {rooms,slots}=require('./constants');
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
//Date Parser + Date Format
const dateParser=((startTime,endTime)=>{
    if(moment(startTime, 'HH:mm').isValid() &&  moment(endTime, 'HH:mm').isValid()){
    var inpStartTime=moment(startTime, 'HH:mm').toDate();
    //var inpStartTime= datetime.parse(startTime,'HH:mm');
    var inpEndTime=moment(endTime, 'HH:mm').toDate();
    //var inpEndTime= datetime.parse(endTime,'HH:mm');
    return [inpStartTime,inpEndTime];
    }
    return [];
});

//Buffer Time Overlap Check
const bufferValidator=((startTime,endTime)=>{
let dateRange=dateParser(startTime,endTime);
slots.map(element => {
    element.startTime=moment(element.startTime, 'HH:mm').toDate();
    element.EndTime=moment(element.endTime,'HH:mm').toDate();
});
 slotOverLap=slots.filter( val => {

     let range1=moment.range(val.startTime,val.EndTime);
     let range2=moment.range(dateRange[0],dateRange[1]);
     return !range1.overlaps(range2);
 });

 return slots.length!=slotOverLap.length? true:false;

});


//Duration Check
const durationCheck=((startTime,endTime)=>{
    let dateRange=dateParser(startTime,endTime);
    //console.log(dateRange);
    start=moment(dateRange[0]);
    end=moment(dateRange[1]);
    
    var duration = end.diff(start,"minutes");
    return (duration>0 && duration%15==0)?true:false;
});

const capacityCheck=((capacity)=>{
 return (capacity>=2 && capacity<=20)?true:false;
});
const startInterval=((startTime)=>{
    var minInt= startTime.split(":")[1];
    //console.log(minInt);
    return ['00','15','45','30'].includes(minInt)?true:false;
})
const compatibleRooms=((capacity)=>{
if(capacityCheck(capacity)){
    comptRooms=rooms.filter((e,i)=>{
        return (e.capacity>=capacity)
    });
    return comptRooms;
}
return [];
});

//console.log(compatibleRooms());
module.exports={
    compatibleRooms,
    durationCheck,
    bufferValidator,
    dateParser,
    startInterval
}