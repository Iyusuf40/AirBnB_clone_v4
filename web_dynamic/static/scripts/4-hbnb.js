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

    let html = '';
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
        data: JSON.stringify({amenities: amenityIds}),
        contentType: 'application/json',
        dataType: 'json',
        success: displayPlaces
    }
      $.ajax(placesUrl, searchSettings);
    });
   function displayPlaces(data, stat, xml) {
	$('.places').empty();
	html = '';
	console.log(data);
	const idx = data.length - 1
        data.map(async (place) => {
          let userUrlById = usersUrl + place.user_id
          await $.ajax(userUrlById, usersSettings);
          const user = users[0];
          const template = `<article>
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
	  </article>`;
          users = [];
	  html += template;
          if (place.id === data[idx].id) {
            $('section.places').append(html);
	  }
	});
      }
});
