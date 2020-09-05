// const bookRoomsForm = document.getElementById("book-rooms");
// const formError = Array.from(document.getElementsByClassName("form-error"));
// const typeARooms = document.getElementById("type-a-rooms");
// const typeBRooms = document.getElementById("type-b-rooms");
// const typeCRooms = document.getElementById("type-c-rooms");
// const arrivalTime = document.getElementById("arrival-time");
// const depTime = document.getElementById("dep-time");
// const totalPrice = document.getElementById("total-price");
// const currentBalance = Number(document.getElementById("current-balance").innerText);
// const previousValues = {
//     'A' : 0,
//     'B' : 0,
//     'C' : 0
// }
//
// const roomPrices = {
//   'A' : 1,
//   'B' : 2,
//   'C' : 3
// };
//
// function updatePrice(roomType,e){
//     const value = Number(e.target.value);
//     let currentPrice = Number(totalPrice.value);
//     currentPrice = currentPrice + roomPrices[roomType]*(value - previousValues[roomType]);
//     totalPrice.value = currentPrice.toString();
//     previousValues[roomType] = value;
// }
//
// function validateForm(typeARooms,typeBRooms,typeCRooms,arrivalTime,depTime){
//     let isValid = true;
//     let errors = ["","","",""];
//     if(!typeARooms && !typeBRooms && !typeCRooms){
//         errors[0] = "Select atleast one type of room";
//         isValid = false;
//     }
//     if(!arrivalTime){
//         errors[1] = "Enter Arrival Time";
//         isValid = false;
//     }
//     if(!depTime){
//         errors[2] = "Enter Departure Time";
//         isValid = false;
//     }
//     const diff = new Date(depTime) - new Date(arrivalTime);
//     if(diff<0 && arrivalTime && depTime) {
//         errors[2] = "Arrival Time should be less then Dep Time";
//         isValid = false;
//     }
//     if(totalPrice>currentBalance) {
//         errors[3] = "You Do not have sufficient balance";
//         isValid = false;
//     }
//     return [isValid,errors];
// }
//
// arrivalTime.addEventListener('input',function(){
//    formError[1].innerHTML = "";
// });
//
// depTime.addEventListener('input',function(){
//     formError[2].innerHTML = "";
// })
//
// typeARooms.addEventListener('input',function(e){
//     updatePrice('A',e);
//     formError[0].innerHTML = formError[3].innerHTML = "";
// });
//
// typeBRooms.addEventListener('input',function(e){
//     updatePrice('B',e);
//     formError[0].innerHTML = formError[3].innerHTML = "";
// });
//
// typeCRooms.addEventListener('input',function(e){
//    updatePrice('C',e);
//    formError[0].innerHTML = formError[3].innerHTML = "";
// });
//
// bookRoomsForm.addEventListener('submit',function(e){
//     const [isValid,errors] = validateForm(
//         typeARooms.value,
//         typeBRooms.value,
//         typeCRooms.value,
//         arrivalTime.value,
//         depTime.value,
//         totalPrice.innerHTML);
//     if(!isValid){
//         e.preventDefault();
//         formError.forEach((node,index)=>node.innerHTML = errors[index]);
//     }
// });



const aDateEle = document.getElementById("a-date");
const dDateEle = document.getElementById("d-date");
const rooms = Array.from(document.querySelectorAll("#rooms-container .rooms"));
const confirmDetails = document.getElementById("confirm");
let confirmRooms = [];
const bookNow = document.getElementById("book-now");
const cancelBooking = document.getElementById("cancel-booking");
const confirmBookingBtn = document.getElementById("confirm-booking");
bookNow.disabled = true;
confirmDetails.style.display = "none";
const roomsContainer = document.getElementById("rooms");
roomsContainer.style.display = "none";

const roomPrice = {
    "golden" : 1,
    "silver" : 2,
    "platinum" : 3
};
let totalPrice = 0;

function validDate(aDate,dDate){
    if(!aDate) return false;
    if(!dDate) return false;
    return aDate <= dDate;
}

async function findRooms(){
    const aDate = new Date(aDateEle.value);
    const dDate = new Date(dDateEle.value);
    if(!validDate(aDate,dDate)) return;
    const fetchPromise = fetch('/find-room',{
        method : 'post',
        headers : {
            'Content-Type':'application/json'
        },
        body : JSON.stringify({
            aDate,dDate
        })
    });
    let res = {};
    try{
        res = await fetchPromise;
        res = await res.json();

    }
    catch(e){
        console.log(e);
    }finally{
        if(res!=={} && res.length){
            rooms.forEach((node)=>{
               let roomNo = Number(node.innerText);
               if(res.indexOf(roomNo)===-1) node.classList.add('disabled');
            });
        }else{
            roomsContainer.innerHTML = "No Rooms are Available";
        }
        roomsContainer.style.display = "";
    }

}

aDateEle.addEventListener('input',findRooms);

dDateEle.addEventListener('input',findRooms);

rooms.forEach(function(node){
   node.addEventListener('click',function(){
       const classList = Array.from(node.classList);
       if(classList.indexOf("disabled")!==-1) return;
       const roomType = classList.indexOf("golden")===-1?(classList.indexOf("silver")===-1?"platinum":"silver"):"golden";
       if(classList.indexOf('selected')===-1){
           node.classList.add("selected");
           totalPrice = totalPrice + roomPrice[roomType];
           confirmRooms.push(node.innerText);
           bookNow.disabled = false;
       }else{
           node.classList.remove("selected");
           totalPrice = totalPrice - roomPrice[roomType];
           confirmRooms.splice(confirmRooms.indexOf(node.innerText),1);
           if(!confirmRooms.length) bookNow.disabled = true;
       }
   });
});

bookNow.addEventListener('click',function(){
    document.getElementById("confirm-rooms").innerHTML = confirmRooms.join(",");
    let tIndex = aDateEle.value.indexOf("T");
    document.getElementById("arrival-time").innerHTML = aDateEle.value.substr(0,tIndex) + " " + aDateEle.value.substr(tIndex + 1);
    document.getElementById("dep-time").innerHTML = dDateEle.value.substr(0,tIndex) + " " + dDateEle.value.substr(tIndex + 1);
    document.getElementById("price").innerHTML = totalPrice + " ICR";
    document.getElementById("hide-form").style.display = "none";
    confirmDetails.style.display = "";
});

cancelBooking.addEventListener('click',function(){
    document.getElementById("hide-form").style.display = "";
    confirmDetails.style.display = "none";
});

confirmBookingBtn.addEventListener('click',async function(){
    const data = {
        rooms : confirmRooms,
        arrivalTime : aDateEle.value,
        depTime : dDateEle.value,
        price : totalPrice
    };
    const fetchPromise = fetch("/book-room",{
        method : 'post',
        headers : {
            'Content-Type':'application/json'
        },
        body : JSON.stringify(data)
    });
    try{
        let res = await fetchPromise;
        res = await res.json();
        console.log(res);
        window.location.href = "/profile";
    }
    catch(e){
        console.log(e);
    }
});
