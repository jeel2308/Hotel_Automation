const buyIcrBtn = document.getElementById("buy-icr-btn");
const buyIcrField = document.getElementById("buy-icr");
const buyIcrErr = document.getElementById("buy-icr-err");
const buyIcrForm = document.getElementById("buy-icr-form");

buyIcrBtn.disabled = true;

function validateField(value){
    let err = "";
    if(!value){
       err = "Invalid amount";
       return err;
    }
    if(value.indexOf('e')!==-1){
       err = "Amount must be in proper format";
       return err;
    }
    if(Number(value)<=0){
       err = "Amount must be positive";
       return err;
    }
    return err;
}

buyIcrField.addEventListener('input',function(){
    const err = validateField(buyIcrField.value);
    buyIcrErr.innerHTML = err;
    buyIcrBtn.disabled = !!err;
});



buyIcrBtn.addEventListener('click',function(){
    async function handleToken(token){
        let message = "";
        try {
            const buyIcrPromise = fetch('/buy-icr',{
                method : 'post',
                headers : {
                    'Content-Type':'application/json',
                    'Accept' : 'application/json'
                },
                body : JSON.stringify({
                    id : token.id,
                    price : Number(buyIcrField.value)*100
                })
            });
            await buyIcrPromise;
            console.log("done");
            window.location.href="http://localhost:3000/profile";
        }
        catch(e){
            console.log(e);
            // message = e.message;
        }
        finally{
            // console.log(message);
        }
    }
   const stripeHandler = StripeCheckout.configure({
       key : publicKey,
       locale : 'auto',
       currency : 'inr',
       token : handleToken
   });
    stripeHandler.open({
       amount : Number(buyIcrField.value)*100
    });
});