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
      //$('.amenities h4').append("&nbsp;");
    });
  });
});
