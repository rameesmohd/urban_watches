//for side cart

const cartData = await cartModel.findOne({user : session}).populate('item.product')




<form class="bg0 p-t-75 p-b-85">
    <div class="container">
        <div class="row">

            <div class="col-lg-10 col-xl-7 m-lr-auto m-b-50">
                <div class="m-l-25 m-r--38 m-lr-0-xl">
                    <div class="wrap-table-shopping-cart">

                        <table class="table-shopping-cart">

                        
                            <% for(let i = 0 ;i < orderData.length ; i++ ){ %>

                            <tr class="table_row">
                                <td class="column-1">
                                    <div class="how-itemcart1">
                                        <img src="/productimages/<%= orderData.order[i].product.image[0] %>" alt="IMG">
                                    </div>
                                </td>
                                <!-- <td class="column-2"></td>
                                <td  class="column-3"></td>

                                
                                <td class="column-5"></td>

                                <td class="btn hov-btn1 trans-04 ">

                                    <a href="/delete-item?id= "><i class="bi bi-cart-x"></i></a> -->

                                </td>
                                
                            </tr>

                            <% } %>

                        </table>

                    </div>
                </div>
            </div>
        </div>
    </div>
</form>



//------------------------------------orders


<div class="row">
    <div class="col-lg-12 col-md-12 grid-margin">
        <div class="card card-white h-100">
            <div class="card-heading clearfix">
                <h4 class="card-title">Latest Transaction</h4>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="customCheck1">
                                        <label class="custom-control-label" for="customCheck1">&nbsp;</label>
                                    </div>
                                </th>
                                <th>Order ID</th>
                                <th>Billing Name</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Payment Status</th>
                                <th>Payment Method</th>
                                <th>View Details</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="customCheck2">
                                        <label class="custom-control-label" for="customCheck2">&nbsp;</label>
                                    </div>
                                </td>
                                <td><a href="#">#SK2540</a> </td>
                                <td>Nicolette Villeneuve</td>
                                <td>
                                    20 Mar, 2022
                                </td>
                                <td>
                                    $400
                                </td>
                                <td>
                                    <span class="badge rounded-pill bg-soft-green">Paid</span>
                                </td>
                                <td>
                                    <i class="fab fa-cc-mastercard me-1"></i> Mastercard
                                </td>
                                <td>
                                    <button type="button" class="btn btn-primary btn-sm btn-rounded">
                                        View Details
                                    </button>
                                </td>
                                <td>
                                    <a href="#" class="me-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                                        <i class="far fa-edit text-primary"></i>
                                    </a>
                                    <a href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
                                        <i class="far fa-trash-alt text-danger"></i>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>




<script> 
								const btn_w_<%= product[i]._id %> = document.getElementById('wishListBtn_<%= product[i]._id %>') 
					
									btn_w_<%= product[i]._id %>.addEventListener('click',(e)=>{
										e.preventDefault()
										$.ajax({
												url : btn_w_<%= product[i]._id %>.href,
   											    type : 'GET', 
   												data : {variable1 : "some data"},
   											    success : function(result){
													console.log('success');
    										   },
    										   error : function(result, statut, error){ 
												console.log(error);
   													    }
   											 });
									})	
								
							</script>
                            


                          



                                <div class="pos-relative">
								<img id="<%= product[i]._id %>icon2" onclick="removewishlist('<%= product[i]._id %>')" class="icon-heart2 trans-04" src="images/icons/icon-heart-02.png" alt="ICON" style="display: none; cursor: pointer;">
								
								<img id="<%= product[i]._id %>icon1" onclick="addtowishlist('<%= product[i]._id %>')" class="icon-heart1 trans-04" src="images/icons/icon-heart-01.png" alt="ICON" style="cursor: pointer;">
								</div>





//::::::::::::::::::::::product page deleted js

<!--===============================================================================================-->	
	<script src="vendor/jquery/jquery-3.2.1.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/animsition/js/animsition.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/bootstrap/js/popper.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/select2/select2.min.js"></script>
	<script>
		$(".js-select2").each(function(){
			$(this).select2({
				minimumResultsForSearch: 20,
				dropdownParent: $(this).next('.dropDownSelect2')
			});
		})
	</script>
<!--===============================================================================================-->
	<script src="vendor/daterangepicker/moment.min.js"></script>
	<script src="vendor/daterangepicker/daterangepicker.js"></script>
<!--===============================================================================================-->
	<script src="vendor/slick/slick.min.js"></script>
	<script src="js/slick-custom.js"></script>
<!--===============================================================================================-->
	<script src="vendor/parallax100/parallax100.js"></script>
	<script>
        $('.parallax100').parallax100();
	</script>
<!--===============================================================================================-->
	<script src="vendor/MagnificPopup/jquery.magnific-popup.min.js"></script>
	<script>
		$('.gallery-lb').each(function() { // the containers for all your galleries
			$(this).magnificPopup({
		        delegate: 'a', // the selector for gallery item
		        type: 'image',
		        gallery: {
		        	enabled:true
		        },
		        mainClass: 'mfp-fade'
		    });
		});
	</script>
<!--===============================================================================================-->
	<script src="vendor/isotope/isotope.pkgd.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/sweetalert/sweetalert.min.js"></script>
	<script>
		$('.js-addwish-b2, .js-addwish-detail').on('click', function(e){
			e.preventDefault();
		});

		$('.js-addwish-b2').each(function(){
			var nameProduct = $(this).parent().parent().find('.js-name-b2').html();
			$(this).on('click', function(){
				swal(nameProduct, "is added to wishlist !", "success");

				$(this).addClass('js-addedwish-b2');
				$(this).off('click');
			});
		});

		$('.js-addwish-detail').each(function(){
			var nameProduct = $(this).parent().parent().parent().find('.js-name-detail').html();

			$(this).on('click', function(){
				swal(nameProduct, "is added to wishlist !", "success");

				$(this).addClass('js-addedwish-detail');
				$(this).off('click');
			});
		});

		/*---------------------------------------------*/

		$('.js-addcart-detail').each(function(){
			var nameProduct = $(this).parent().parent().parent().parent().find('.js-name-detail').html();
			$(this).on('click', function(){
				swal(nameProduct, "is added to cart !", "success");
			});
		});
	
	</script>
<!--===============================================================================================-->
	<script src="vendor/perfect-scrollbar/perfect-scrollbar.min.js"></script>
	<script>
		$('.js-pscroll').each(function(){
			$(this).css('position','relative');
			$(this).css('overflow','hidden');
			var ps = new PerfectScrollbar(this, {
				wheelSpeed: 1,
				scrollingThreshold: 1000,
				wheelPropagation: false,
			});

			$(window).on('resize', function(){
				ps.update();
			})
		});
	</script>
<!--===============================================================================================--></img>








<div class="item-slick1" style="background-image: url(https://www.fossil.com/on/demandware.static/-/Library-Sites-FossilSharedLibrary/default/dwbe229aaf/2023/SP23/set_03152023_in_hp/3.15_FS_IN_SP23_Ecom_Celeb_Spring_Launch_Desktop_Hero03.jpg);"></div>