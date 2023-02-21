$(document).ready(function(){
	pageController.init();
	// retrieve data from somewhere
	pageController.setData(dataController.retrieve());
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
	let current = -1;
	// private function
	function repopulate(list,pt){
		let originalLength = $('div.row-token').length;
		for(let x = pt;x<originalLength;x++){
			$('div.row-token[data-row="'+x+'"]').remove();
		}
		for(let x = pt;x<list.length;x++){
			insertTokenFromList(list,x);
		}
		mountDropdownFunctions();
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
		//console.log(`${l} <- ${m} -> ${r}`);
		while(l < r){
			m = Math.floor((l+r)/2);
			a[m] > t ? r = m : l = m + 1;
			//console.log(`${l} <- ${m} -> ${r}`);
		}
		return a.length - r;
	}
	
	function setCurrent(){
		$('div.row-token[data-row="'+current+'"]').addClass('current-row');
	}
	
	function resetCurrent(){
		$('div.card-list').find('.current-row').removeClass('current-row');
	}
	
	function mountDropdownFunctions(){
		$("button.dropdown-toggle").off('hide.bs.dropdown').on('hide.bs.dropdown', event=>{
			// console.log('hide.bs.dropdown');
			// console.log($(event.currentTarget).data('dropdown-button'));
			// console.log($(event.clickEvent?.target).data('dropdown-item'));
			let pt = $(event.currentTarget).data('dropdown-button');
			switch($(event.clickEvent?.target).data('dropdown-item')){
				case "amend": pageController.amend(pt); break;
				case "remove": pageController.remove(pt); break;
				case "skip": pageController.skip(pt); break;
				default:break;
			}
		})
	}
	
	function validateInput(){
		let result = true;
		if(!dataController.validateFloat($('#addInit').val(),0,50)){
			$('#addInit').addClass('is-invalid').removeClass('is-valid');
			result = false;
		} else {
			$('#addInit').addClass('is-valid').removeClass('is-invalid');
		}
		if(!$('#addName').val()){
			$('#addName').addClass('is-invalid').removeClass('is-valid');
			result = false;
		} else {
			$('#addName').addClass('is-invalid').removeClass('is-valid');
		}
		return result;
	}
	// public functions
	return {
	init: function(){
		$('#addBtn').click((e)=>{
			e.preventDefault();
			// validate
			let obj = {"name":$('#addName').val()};
			const template = $('#template-initiative-row').html();
			if(!validateInput())return;
			obj.initiative = Number.parseFloat($('#addInit').val()).toFixed(1);
			// find insertion point
			let pt = bSearchRM(list.map(a=>Number.parseFloat(a.initiative)).reverse(),Number.parseFloat(obj.initiative));
			// if(pt <= current) nextInit();
			// insert into list
			list.splice(pt,0,obj);
			// re-populate list on and after insertion point
			repopulate(list,pt);
			if(current === -1){
				current = 0;
				setCurrent(current);
			} else if(pt < current) {
				pageController.nextInit();
			} else {
				resetCurrent();
				setCurrent(current);
			}
			// clean up input fields;
			$('#addInit,#addName').val('').removeClass('is-valid is-invalid');
		});
		$('#nxtBtn').click(pageController.nextInit);
		$('#lstBtn').click(pageController.lastInit);
		$('#clrBtn').click(pageController.clearData);
		mountDropdownFunctions();
	},
	setData: function(data){
		if(!data || !data.tokens || data.tokens.length === 0)return;
		Array.prototype.push.apply(list,data.tokens.sort((a,b)=>b.initiative.localeCompare(a.initiative)));
		current = data.currentToken;
		//console.log(list);
		let i = 0;
		for(let token of list){
			insertToken(token.initiative,token.name,i++);
		}
		mountDropdownFunctions();
		setCurrent(current);
	},
	nextInit: function(){
		current === -1 ? current = 0 : list.length - current === 1 ? current = 0 : current++;
		resetCurrent();
		setCurrent();
	},
	lastInit: function(){
		current === -1 ? current = 0 : current === 0 ? current = list.length-1 : current--;
		resetCurrent();
		setCurrent();
	},
	clearData: function(){
		if(!confirm('Remove all items?'))return;
		list = [];
		repopulate(list,0);
		current = -1;
		resetCurrent();
	},
	amend: function(pt){
		let [{name,initiative}] = list.splice(pt,1);
		
		$('#addName').val(name);
		$('#addInit').val(initiative);
		repopulate(list,pt);
	},
	remove: function(pt){
		list.splice(pt,1);
		current === -1 ? 0 : current < pt ? current = list.length-1 : current--
		repopulate(list,current);
		resetCurrent();
		setCurrent();
	},
	skip: function(pt){
		current = pt;
		resetCurrent();
		setCurrent();
	}
};}();