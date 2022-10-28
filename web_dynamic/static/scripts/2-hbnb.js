$('document').ready(() => {
  const buttonCheckedIds = []
  $('input').each((i, ipt) => {
    $(ipt).change(() => {
      const name = ipt.getAttribute('data-name');
      const id = ipt.getAttribute('data-id');
      const inputObj = {id: id, name: name};
      if (ipt.checked) {
        buttonCheckedIds.push(inputObj);
      } else {
        buttonCheckedIds.pop(inputObj);
      };
      $('.amenities h4').text('');
      $.each(buttonCheckedIds, (i, obj) => {
        $('.amenities h4').text(obj.name + ' ' + $('.amenities h4').text());
	$('.amenities h4').append("&nbsp;");
      });
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
});
