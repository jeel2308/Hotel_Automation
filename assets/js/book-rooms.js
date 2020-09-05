// const bookRoomBtn = Array.from(document.getElementsByClassName("book_room_btn"));

const roomTypeMapping = {
    '1' : 'A',
    '2' : 'B',
    '3' : 'C'
};

// bookRoomBtn.forEach(function(node,index){
//    node.addEventListener('click',async function(e){
//        const {target} = e;
//        const price = Number(target.getAttribute("data-price"));
//        roomPrice.value = price;
//        roomType.value = roomTypeMapping[(index + 1).toString()];
//        document.getElementById("submit").click();
//    });
// });