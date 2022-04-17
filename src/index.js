resourceController = function(){return {
	resources:[],
	storageKey: 'resources',
	init: function(){
		//load all records from localStorage
		resourceController.resources = localStorageController.load(resourceController.storageKey,'array',true);
		//populate to UIs
		resourceController.populateResource();
	},
	populateResource: function(){
		$('div.container-md div[data-type="resource"] div.item-resource').remove();
		for(let i = 0;i< resourceController.resources.length;i++){
			let resource = resourceController.resources[i];
			$('div.container-md div[data-type="resource"]').append(toHTML(resource,i));
		}
	},
	saveResource: function(){
		console.log('resourceController.saveResource');
		let r = $('form[data-type="resource"]').serializeArray();
		let output = {};
		output.name = r.find(e=>e.name==="name").value;
		output.rest = r.find(e=>e.name==="rest").value;
		output.current = output.max = Number.parseInt(r.find(e=>e.name==="max").value)
		let id = r.find(e=>e.name==="id").value;
		if(id !== "" && id > -1)resourceController.resources.splice(id,1,output);
		else resourceController.resources.push(output);
		
		localStorageController.save(resourceController.storageKey,resourceController.resources);
		resourceController.populateResource();
		resourceModalController.clear();
	},
	removeAll: function(){
		if(!confirm('Are you sure to remove all resources?'))return;
		resourceController.resources.length = 0;
		localStorageController.save(resourceController.storageKey,resourceController.resources);
		resourceController.populateResource();
	},
	onIncrement: function(id){
		let org = resourceController.resources[id].current;
		resourceController.resources[id].current = Math.min(resourceController.resources[id].current+1,resourceController.resources[id].max);
		if(resourceController.resources[id].current === org)return;
		localStorageController.save(resourceController.storageKey,resourceController.resources);
		resourceController.populateResource();
	},
	onDecrement: function(id){
		let org = resourceController.resources[id].current;
		resourceController.resources[id].current = Math.max(resourceController.resources[id].current-1,0);
		if(resourceController.resources[id].current === org)return;
		localStorageController.save(resourceController.storageKey,resourceController.resources);
		resourceController.populateResource();
	},
	onRemove: function(id){
		if(!confirm('Are you sure to remove the resource?'))return;
		resourceController.resources.splice(id,1);
		localStorageController.save(resourceController.storageKey,resourceController.resources);
		resourceController.populateResource();
	},
	doShortRest: function(){
		resourceController.resources.filter((e)=>["SR"].includes(e.rest)).forEach((e)=>{
			if(e.current === e.max)return;
			console.log(`${e.name}: ${e.current} -> ${e.max}`);
			e.current = e.max;
		});
		localStorageController.save(resourceController.storageKey,resourceController.resources);
		resourceController.populateResource();
	},
	doLongRest: function(){
		resourceController.resources.filter((e)=>["LR","SR"].includes(e.rest)).forEach((e)=>{
			if(e.current === e.max)return;
			console.log(`${e.name}: ${e.current} -> ${e.max}`);
			e.current = e.max;
		});
		localStorageController.save(resourceController.storageKey,resourceController.resources);
		resourceController.populateResource();
	}
};}();

resourceModalController = function(){return {
	show: function(id){
		if(id !== undefined && id !== ""){//damn it can be zero...
			let resource = resourceController.resources[id];
			$('form[data-type="resource"]').find('[name="id"]').val(id);
			$('form[data-type="resource"]').find('[name="name"]').val(resource.name);
			$('form[data-type="resource"]').find('[name="rest"]').val(resource.rest);
			$('form[data-type="resource"]').find('[name="max"]').val(resource.max);
		}
		$('div.modal[data-type="resource"]').modal('show');
	},
	clear: function(){$('form[data-type="resource"] :input').val('');}
};}();

localStorageController = function(){return {
	load: function(key,type,emptyIfNull){
		let val = localStorage.getItem(key);
		if(!val){
			if(!emptyIfNull)return null;
			switch(type){
			case 'array':case 'list':return [];
			case 'object':case 'map':return {};
			case 'string':return '';
			case 'float':case 'int':return 0;
			default: return null;
			}
		}
		switch(type){
		case 'array':case 'list':case 'object':case 'map':
			return JSON.parse(val);
		case 'float': 
			return Number.parseFloat(val);
		case 'int': 
			return Number.parseInt(val);
		case 'string': default:
			return val;
		}
	},
	save: function(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	}
};}();

$(document).ready(function(){
	resourceController.init();
});

function toHTML(resource,i){
	if(!resource)return '<li></li>';
	return `
	<div class="item-resource card">
		<h2 class="d-flex justify-content-between align-items-center">${resource.name}</h2>
		<h2 class=""><span class="badge bg-${resource.rest}">${formatRest(resource.rest)}</span><span class="badge bg-primary" data-current="${resource.current}" data-max="${resource.max}">${resource.current}/${resource.max}</span></h2>
		<div>
		<button class="btn btn-dark btn-operate" onclick="resourceController.onIncrement(${i})">+</button>
		<button class="btn btn-dark btn-operate" onclick="resourceController.onDecrement(${i})">−</button>
		<button class="btn btn-warning btn-operate" onclick="resourceModalController.show(${i})">E</button>
		<button class="btn btn-danger btn-operate" onclick="resourceController.onRemove(${i})">R</button>
		</div>
	</div>
	`;
}

function formatRest(key){
	switch(key){
		case 'SR':return 'Short Rest';
		case 'LR':return 'Long Rest';
		case 'OR':default: return 'Others';
	}
}