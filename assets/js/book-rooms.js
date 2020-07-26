const bookRoomBtn = Array.from(document.getElementsByClassName("book_room_btn"));
const status = document.getElementById("status");
bookRoomBtn.forEach(function(node){
   node.addEventListener('click',async function(e){
       status.innerHTML = "";
      const {target} = e;
      const price = Number(target.getAttribute("data-price"));
      const bookRoomPromise = fetch("/book-room",{
         method : 'post',
         headers : {
             'Content-Type' : 'application/json'
         },
          body: JSON.stringify({
              price
          })
      });
      let res = "";
      try{
          res = await bookRoomPromise;
          res = await res.json();
          if(res.warning){
              res = res.warning;
          }
          if(res.success){
              res = res.success;
          }
      }catch(e){
          res = res.warning;
      }
      finally {
          status.innerHTML = res;
      }
   });
});