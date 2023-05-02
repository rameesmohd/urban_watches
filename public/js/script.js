
//::::::::::::::::::::::::::::::::::::::::::::WISHLIST::::::::::::::::::::::::::::::
function addtowishlist(id) {
    $.ajax({
    type: "GET",
    url:`/add-to-wishlist?id=${id}`,
    success: function(data) {
        console.log("success");
        if(data.success){       
            swal({  
                title: "sucess",  
                text: data.message,  
                icon: "success",  
                button: "oh yes!",
            });  

            $(`#${id}icon1`).hide()
            $(`#${id}icon2`).show()
        }else{
            location.href ='/login'
        }   
    },
    error: function(data) {
    console.log(error);
    }
    });
}


function removewishlist(productId,num) {
          $.ajax({
          type: "GET",
          url:`/rmv-wishlist?id=${productId}`,
          success: function(response) {
          // handle successful response
                  swal({  
                      title: "Removed from wishlist!",  
                      text: response.message,  
                      icon: "success",
                      button: "ok",
                  });
                //   const divToRemove = document.getElementById(productId);
                //           divToRemove.remove();
                // location.href='/wishList'
                $(`#${productId}icon1`).show()
                $(`#${productId}icon2`).hide()
                $(`#${productId}`).hide()
          },
          error: function(xhr, status, error) {
          // handle error response
          }
          });
      }
      
//:::::::::::::::::::::::::::::::::::::::::::CART::::::::::::::::::::::::::::::::::::

function removecart(productId) {
        $.ajax({
        type: "GET",
        url:`/deletecart?id=${productId}`,
        success: function(response) {
        // handle successful response
                swal({  
                    title: "Good job!",  
                    text: response.message,  
                    icon: "success",  
                    button: "oh yes!",
                });     
                const divToRemove = document.getElementById(productId);
                      divToRemove.remove();
        },
        error: function(xhr, status, error) {
        // handle error response
        }
        });
    }



function addtocart(id) {
    $.ajax({
    type: "GET",
    url:`/addToCart?id=${id}`,
    success: function(data) {
        if(data.success){  

            swal({  
                title: "Added to Cart",  
                text: data.message,  
                icon: "success",  
                button: "Ok",
            });  
          
            function removeafteradd(productId,num) {
                $.ajax({
                type: "GET",
                url:`/rmv-wishlist?id=${productId}`,
                success: function(response) {
             
                      $(`#${productId}`).hide()   
                },
                error: function(xhr, status, error) {
                // handle error response
                }
                });
            }

            removeafteradd(id)

        }else{
            location.href ='/login'
        }   
    },
    error: function(data) {
    console.log(error);
    }
    });
}

function outOfStock(){
  swal({ 
    title: "Alert",  
    text: "Out of stock products in the Cart",  
    icon: "warning",  
    button: "ok",
  });  

}

// :::::::::::::::::::::::::::::::::::--->PROFILE<------::::::::::::
function validatePass(){

    let currentPass = document.getElementById('currentPass').value

    let newPass = document.getElementById('newPassword').value

    let confirmPass = document.getElementById('confrimPassword').value
   
    if(newPass != confirmPass){

        message = 'New password and confirm password do not match.'
        $(`#msg`).text(message)

    }else{
        $.ajax({
            url : '/change-pass',
            method : 'post',
            contentType : 'application/json',
            dataType : 'json',
            data:JSON.stringify({currentPass,newPass,confirmPass}),
            success:function(res){

             if(res.success){  
                swal({  
                    title: "Good job!",  
                    text: res.message,  
                    icon: "success",  
                    button: "ok",
                });
            }else{

                $(`#currentPassMsg`).text(res.message)

            }
            }
        })
    }
}



function deleteAddress(id){
    console.log("entered eto script");
    $.ajax({
        type : "GET",
        contentType : 'application/json',
        url : `/delete-address?id=${id}`,
        dataType : 'json',
        success : function(res){
            console.log("successs");
          if(res.success){
            swal({
                title : "deleted address",
                text : res.message,
                icon : "success",
                button : "ok"
            });

            const divToRemove = document.getElementById(id);
            divToRemove.remove();
          }
        }
    })    
}





