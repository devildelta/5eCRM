$(document).ready(function(){
	pageController.init();
	// retrieve data from somewhere
	pageController.setData(dataController.retrieve());

	$("button.dropdown-toggle").on('hide.bs.dropdown', event=>{
		// console.log('hide.bs.dropdown');
		// console.log($(event.currentTarget).data('dropdown-button'));
		// console.log($(event.clickEvent?.target).data('dropdown-item'));
		switch($(event.clickEvent?.target).data('dropdown-item')){
			case "amend": break;
			case "delete": break;
			case "skip": break;
			default:break;
		}
	})
});

const dataController = function(){return {
	retrieve: function(){
	// retrieve data from somewhere
	/*
	{
		"tokens":[
			{"uuid":"","initiative":"21.0","name":"黃金大樹"},
			{"uuid":"","initiative":"11.1","name":"褔爾摩莎"},
			{"uuid":"","initiative":"11.0","name":"白銀石"}
		],
		"currentToken":1
	}
	*/
		return 	{
			"tokens":[
				{"uuid":"","initiative":"21.0","name":"黃金大樹"},
				{"uuid":"","initiative":"11.1","name":"褔爾摩莎"},
				{"uuid":"","initiative":"11.0","name":"白銀石"}
			],
			"currentToken":1
		};
	},
	validateFloat: function(n,min,max){// always inclusive
		let num = Number.parseFloat(n);
		let minInner = Number.parseFloat(min);
		let maxInner = Number.parseFloat(max);
		
		if(Number.isNaN(num) || Number.isNaN(minInner) || Number.isNaN(maxInner))return false;
		
		if(num < minInner)return false;
		if(num > maxInner)return false;
		
		return true;
	}
};}();

const pageController = function(){
	// private variables
	let list = [];
	// private function
	function repopulate(list,pt){
		for(let x = pt;x<list.length;x++){
			$('div.row-token[data-row="'+x+'"]').remove();
		}
		for(let x = pt;x<list.length;x++){
			insertTokenFromList(list,x);
		}
	}
	function insertTokenFromList(list,i){
		insertToken(list[i].initiative,list[i].name,i);
	}
	function insertToken(init,name,i){
		const template = $('#template-initiative-row').html();
		const clone = $(template);
		clone.find('.data-token-init').html(init);
		clone.find('.data-token-name').html(name);
		//clone.data('row',i);
		clone.attr('data-row',i);
		clone.find('button').attr('data-dropdown-button',i);
		$('hr.prepend-list-here').before($(clone.prop('outerHTML')));
	}
	function bSearchRM(a,t){ // search for the rightmost insertion point for .splice
		let l = 0, r = a.length;
		let m = 0;
		console.log(`${l} <- ${m} -> ${r}`);
		while(l < r){
			m = Math.floor((l+r)/2);
			a[m] > t ? r = m : l = m + 1;
			console.log(`${l} <- ${m} -> ${r}`);
		}
		return a.length - r;
	}
	// public functions
	return {
	init: function(){
		$('#addBtn').click((e)=>{
			e.preventDefault();
			// validate
			let obj = {"name":$('#addToken').val()};
			const template = $('#template-initiative-row').html();
			if(!dataController.validateFloat($('#addInit').val(),0,50))return;
			obj.initiative = $('#addInit').val();
			// find insertion point
			let pt = bSearchRM(list.map(a=>Number.parseFloat(a.initiative)).reverse(),Number.parseFloat(obj.initiative));
			// insert into list
			list.splice(pt,0,obj);
			// re-populate list on and after insertion point
			repopulate(list,pt);
			
			
			// clean up input fields;
			$('#addInit,#addToken').val('');
		});
	},
	setData: function(data){
		if(!data || !data.tokens || data.tokens.length === 0)return;
		Array.prototype.push.apply(list,data.tokens.sort((a,b)=>b.initiative.localeCompare(a.initiative)));
		console.log(list);
		let i = 0;
		for(let token of list){
			insertToken(token.initiative,token.name,i++);
		}
		
	},
	isEmpty: function(){
		return $('div.card-list').find('div.row.initiative-row')
	}
};}();