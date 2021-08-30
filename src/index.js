const validators=require('../utils/validation');
const readline=require('readline');
const constants=require('../utils/constants');
const meeting=require('../model/meeting');
const {bookingService}=require('./service/book')
const {vacancyService}=require('./service/vacancy');
const {cancelService}=require('./service/cancel');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
   });
   
var waitForUserInput = async ()=> {
await meeting.initial();
    rl.question("User Operation: (q to quit) ",  async(answer)=> {
    if (answer == "q"){
        rl.close();
    } else {
        let inputs=answer.split(" ");
        let output=await executeLogic(inputs);
        console.log(output);       
        waitForUserInput();
    }
    });
}
waitForUserInput();

const executeLogic=( async(inputs)=>{
if(inputs[0]==constants.V && inputs.length===3){
    let startTime=inputs[1];
    let endTime=inputs[2];
    return vacancyService(startTime,endTime);
}
else if(inputs[0]==constants.B && inputs.length===4){
    let startTime=inputs[1];
    let endTime=inputs[2];
    let capacity=inputs[3];
    return bookingService(startTime,endTime,capacity);
}
if(inputs[0]==constants.CB && inputs.length===3){
    let startTime=inputs[1];
    let endTime=inputs[2];
    return cancelService(startTime,endTime);
}
else
{ 
    return constants.II;
}
});