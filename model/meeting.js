const { Sequelize, Model, DataTypes,QueryTypes } = require('sequelize');
const constants = require('../utils/constants');
database=process.env.DB_NAME
host=process.env.DB_HOST
port=process.env.DB_PORT
user=process.env.DB_USER
password=process.env.DB_PASSWORD
const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: process.env.DB_DIALECT,
  logging: false
})

const Meeting=sequelize.define('meetings', {
  startTime:
  {
    type: Sequelize.TIME,
    field:"starttime",
  },
  endTime:{
    type: Sequelize.TIME,
    field:"endtime",
  },
  room:{
    type: Sequelize.CHAR,
    field:"room",
  },
  members:{
    type: Sequelize.TIME,
    field:"members",
  }
  });
const initial=(async () => {
  await sequelize.sync({ force: false });

});

const createRec=(async (meetingReq) => {
  //console.log(meetingReq);
  await sequelize.sync();
  const meeting1 = await Meeting.create(
  meetingReq);
  return meeting1.toJSON();
});

/*
  Check All Eligible Rooms sequencially as per size
  that can cater to book Request Once the room is available its 
  index is returned.
*/
const fetchForAdd=(async (startTime,endTime,rooms) => {
    let isAvail=false;
    let loop=rooms.length;
    let counter=0
    while (counter<loop){
    let room=rooms[counter];
    //console.log(startTime,endTime,room);
      let [result, metadata] =await sequelize.query(
        `select count(1) from public.meetings where 
        (( :startTime between startTime and endTime and :startTime !=endTime) or
        (:endTime between startTime and endTime and :endTime!=startTime)) and room=:room`,
     {
        replacements: {startTime,endTime,room},
        type: QueryTypes.SELECT
      }
    )
    //console.log(counter,results);    
    if(result.count==='0'){
      isAvail=true;
      break;
    }
    counter++; 
    
    }
    //console.log('Here 2');
    //console.log(results.count);
    return isAvail?{index: counter}:{index:-1};
    
    //Checked all possible rooms for vacancy
    
});

/*
    Check All the rooms based on Start Time & End Time
    and Push to Array if its Available
*/
const fetchForVacancy=(async (startTime,endTime,rooms) => {
  let loop=rooms.length;
  let availRooms=[];
  let counter=0
  while (counter<loop){
  let room=rooms[counter];
  //console.log(startTime,endTime,room);
   const [result, metadata] =await sequelize.query(
      `select count(1) from public.meetings where 
      (( :startTime between startTime and endTime and :startTime !=endTime) or
      (:endTime between startTime and endTime and :endTime!=startTime)) and room=:room`,
   {
      replacements: {startTime,endTime,room},
      type: QueryTypes.SELECT
    }
  )
  //console.log(counter,result);    
  result.count==='0'? availRooms.push(room):false;
  //console.log(availRooms);
  counter++; 
  }
  return availRooms;
  //Checked all possible rooms for vacancy
  
});


const fetchForCancel=(async (startTime,endTime,rooms) => {
  let isCancel=false;
  //console.log(startTime,endTime,room);
    let [result, metadata] =await sequelize.query(
      `delete from public.meetings where 
      ( :startTime = startTime and :endTime=endTime  and room IN(:room))`,
   {
      replacements: {startTime,endTime,room:rooms},
      //type: QueryTypes.SELECT
    }
  )
    
  if(metadata.rowCount!=0){
    isCancel=true;
  }
  return isCancel;
});



module.exports={
    fetchForAdd,
    createRec,
    initial,
    fetchForVacancy,
    fetchForCancel
}