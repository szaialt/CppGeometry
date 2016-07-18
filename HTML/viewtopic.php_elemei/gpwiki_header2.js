$( document ).ready(function() {

	$('#ld2').fadeOut(0); 
    setInterval(logoSwap, 30000);
    
//    function logoSwap(){

		document.domain="gpwiki.org";
        
		// Select a new image
		$.ajax({ url: 'gpwiki/db_get.php?logo=1',
			 dataType: 'json',
			 type: 'GET'
		})
		.done(function( logo ) {
			var imgUrl = 'http://www.gpwiki.org/images/logo/' + logo.filename
			// Quit if new logo matches the current one
			if($('#li2').attr('src') == imgUrl) {
				return;
			}
			//Set image2 source to new image
			$('#li2').attr('src', imgUrl);
			// Fade In image2
			$('#ld2').fadeIn(800);
			// Fade out image 1
			$('#ld1').fadeOut( 1000, function () { 
				// Then replace image1 with the new image
				$('#li1').attr('src', imgUrl);
				//Update the alt and title for popup
				$('#li1').attr('alt', logo.desc);
				$('#li1').attr('title', logo.desc);
				$('#li2').attr('alt', logo.desc);
				$('#li2').attr('title', logo.desc); 
				// Snap image1 back ...
				$('#ld1').fadeIn(0);            
				// and fade image2 out again
				$('#ld2').fadeOut();            
			});
		});			
    };

});
