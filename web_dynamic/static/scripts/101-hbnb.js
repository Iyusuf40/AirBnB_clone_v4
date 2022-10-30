$('document').ready(() => {
  let buttonCheckedIds = []
  let amenityIds = []

  $('input.amenity-input').each((i, ipt) => {
    $(ipt).click((e) => {
      const name = ipt.getAttribute('data-name');
      const id = ipt.getAttribute('data-id');
      const inputObj = {id: id, name: name};
      if (e.target.checked) {
        buttonCheckedIds.push(inputObj);
	amenityIds.push(id);
      } else {
        buttonCheckedIds = buttonCheckedIds.filter((item) => {
		return item.id !== inputObj.id
	});
	amenityIds = amenityIds.filter((i) => { 
		return i !== id
	});
      };
      $('.amenities h4').text('');
      let text = '';
      $.each(buttonCheckedIds, (i, obj) => {
        text += obj.name;
	text += ' ';
      });
      $('.amenities h4').text(text);
    });
  });

  let cityNames = [];
  let cityIds = [];
  let stateNames = [];
  let stateIds = [];
  $('.state-input, .city-input').each((i, ipt) => {
    $(ipt).click((e) => {
      const cData = e.target.dataset
      if (e.target.classList.contains('city-input')) {
        if (e.target.checked) {
          cityNames.push(cData.name);
	  cityIds.push(cData.id);
	} else {
          cityNames = cityNames.filter((item) => { return item !== cData.name });
          cityIds = cityIds.filter((item) => { return item !== cData.id });
	}
      } else {
        if (e.target.checked) {
          stateNames.push(cData.name);
	  stateIds.push(cData.id);
	} else {
          stateNames = stateNames.filter((item) => { return item !== cData.name });
	  stateIds = stateIds.filter((item) => { return item !== cData.id });
	}
      }
      // console.log(stateIds, stateNames, cityIds, cityNames);
      let text = '';
      stateNames.map((txt) => { text += txt; text += ' ' });
      cityNames.map((txt) => { text += txt; text += ' ' });
      text = text.trim()
      $('.locations h4').text(text);
    });
  });

    const statusUrl = 'http://localhost:5001/api/v1/status/';
    $.get(statusUrl, (obj, stat, xml) => {
      if (obj.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available')
      };
    });

    const placesUrl = 'http://localhost:5001/api/v1/places_search/'
    let usersUrl = 'http://localhost:5001/api/v1/users/'
    let users = []
    
    const usersSettings = {
      type: 'GET',
      dataType: 'json',
      success: (data, stat, xml) => {
        users.push(data);
	// console.log(users);
      }
    }

    const placesSettings = {
      type: "POST",
      dataType: "json",
      data: '{}',
      contentType: "application/json",
      success: displayPlaces
    }
    $.ajax(placesUrl, placesSettings);
	
    $('button.search-button').click((e) => {
      const searchSettings = {
        type: 'POST',
        data: JSON.stringify({
		amenities: amenityIds,
		states: stateIds,
		cities: cityIds}),
        contentType: 'application/json',
        dataType: 'json',
        success: displayPlaces
    }
      $.ajax(placesUrl, searchSettings);
    });

   const placesSafe = [];
   let html = '';
   let returnedReviews = []
   function displayPlaces(data, stat, xml) {
	$('.places').empty();
	html = '';
	// console.log(data);
	const idx = data.length - 1
        data.map(async (place) => {
	  placesSafe.push(place);
          let userUrlById = usersUrl + place.user_id
	  await $.ajax(userUrlById, usersSettings);
          const user = users[0];
          const template = `<article data-id=${place.id} data-gname="place">
	  <div class="title_box">
	  <h2>${place.name}</h2>
	  <div class="price_by_night">${place.price_by_night}</div>
	  </div>
	    <div class="information">
	      <div class="max_guest">
	      ${place.max_guest} Guest${place.max_guest !== 1? 's' : ''}
	      </div>
	      <div class="number_rooms">
	      ${place.number_rooms} Bedroom${place.number_rooms !== 1? 's' : ''}
	      </div>
	      <div class="number_bathrooms">
	      ${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1? 's' : ''}
	      </div>
	    </div>
	    <div class="user">
	        <b>Owner:</b> ${ user.first_name } ${ user.last_name ? user.last_name : 
		'last name'}
	    </div>
	    <div class="description">
	        ${place.description ? place.description : 'Our place is nice'}
	    </div>
	    <h3 class="border-b"> 2 Reviews <span class="show">show</span></h3>
	  </article>`;
          users = [];
	  returnedReviews = [];
	  html += template;
          if (place.id === data[idx].id) {
            $('section.places').append(html);

	    $('.show').each( (i, el) => {
	      $(el).click( (e) => {
  	      $($(el).parent().next()).toggleClass('hide');
	      if ($(el).text().includes('hide')) {
	        $(el).text('show')
	      } else {
                $(el).text('hide')
	      }
  	    });
	   });

	    placesSafe.map( async (place) => {
	      const placesReviewUrl = `http://localhost:5001/api/v1/places/${place.id}/reviews`;
	      await $.ajax(placesReviewUrl, {type: "GET", success: (data, stat, xml) =>{
                returnedReviews = data;
	        }
	      })

	    let subTemp = '<div class="review hide">';
	    for (const review of returnedReviews) {
              const text = review.text;
	      const userId = review.user_id;
	      subTemp += `
	  		<h3> <strong>From ${userId} on the 31st of October</strong> <h3>
	  		<p> ${text}</p>`
	    }
	    subTemp += '</div>';
	    if (!returnedReviews.length) {
              subTemp = '';
	    }
	    $('article').each((i, el) => {
              if ($(el).attr('data-id') === place.id) {
                $(el).append(subTemp);
	      }
	    })

	      }
	     )

	  }
	});
      }
});
