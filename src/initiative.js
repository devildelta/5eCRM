$(document).ready(function(){

	$("button.dropdown-toggle").on('hide.bs.dropdown', event=>{
		// console.log('hide.bs.dropdown');
		// console.log($(event.currentTarget).data('dropdown-button'));
		// console.log($(event.clickEvent?.target).data('dropdown-item'));
		switch($(event.clickEvent?.target).data('dropdown-item')){
			case "amend": break;
			case "amend": break;
			case "amend": break;
			default:break;
		}
	})

	$('#addBtn').click((e)=>{
		e.preventDefault();
		const template = $('#template-initiative-row').html();
		const clone = $(template);
		clone.find('.data-initiative').html($('#addInit').val());
		clone.find('.data-token-name').html($('#addToken').val());
		$('hr.prepend-list-here').before($(clone.prop('outerHTML')));
		$('#addInit,#addToken').val('');
	});
});
