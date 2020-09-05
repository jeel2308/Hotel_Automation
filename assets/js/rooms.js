const arrivalTime = document.getElementById("arrival-time");
const depTime = document.getElementById("dep-time");
const remainingArrivalTime = document.getElementById("remaining-arrival-time");
const remainingDepTime = document.getElementById("remaining-dep-time");
const bookingWarning = document.getElementById("booking-warning");
const activateNowBtn = document.getElementById("activate-now");
const departBtn = document.getElementById("depart");
const applianceLinks = Array.from(document.getElementsByClassName("appliance-link"));
const status = document.getElementById("status").innerText;

if(status==="true"){
    activateNowBtn.style.display = "none";
    applianceLinks.forEach((link)=>link.style.display = "");
    departBtn.style.display = "";
   setInterval(function(){
    remainingDepTime.innerHTML = "Departure Status : " + setStatus(depDate) + "remaining";
    remainingArrivalTime.innerHTML = "Arrival Status : Arrived";
},1000);
}

departBtn.style.display = "none";

let aTimeString = arrivalTime.innerText;
let dTimeString = depTime.innerText;

const tIndex = aTimeString.indexOf("G");
let aTimeString2 = aTimeString.substr(0,tIndex);
let dTimeString2 = dTimeString.substr(0,tIndex);

arrivalTime.innerHTML = aTimeString2;
depTime.innerHTML = dTimeString2;

const depDate = new Date(dTimeString);
function setStatus(depDate){
    const now = new Date();
    let diff = (depDate - now)/1000;
    let s = "";
    const days = Math.floor(diff/86400);
    if(days) s = s + days + " days ";
    diff = diff%86400;
    const hours = Math.floor(diff/3600);
    if(hours) s = s + hours + ' hours ';
    diff = diff%3600;
    const minutes = Math.floor(diff/60);
    if(minutes) s = s + minutes + ' minutes ';
    diff = Math.floor(diff%60);
    s = s + diff + ' second ';
    return s;
}



activateNowBtn.addEventListener('click',async function(e){
   const now = new Date();
   const aTime = new Date(aTimeString);
   const dTime = new Date(dTimeString);
   if(now<aTime){
       bookingWarning.innerHTML = "Booking Period has not started yet";
       return;
   }
   if(now>dTime){
       bookingWarning.innerHTML = "Booking Period has ended";
       return;
   }
   const fetchPromise = fetch("/activate-booking");
   try{
       await fetchPromise;
   }
   catch(e){
       console.log(e);
   }
   applianceLinks.forEach((link)=>{
       link.style.display = "";
   });
   e.target.style.display = "none";
   departBtn.style.display = "";
   setInterval(function(){
    remainingDepTime.innerHTML = "Departure Status : " + setStatus(depDate) + "remaining";
    remainingArrivalTime.innerHTML = "Arrival Status : Arrived";
},1000);
});

