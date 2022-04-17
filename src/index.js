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
		$('table[data-type="resource"] tbody tr').remove();
		for(let i = 0;i< resourceController.resources.length;i++){
			let resource = resourceController.resources[i];
			$('table[data-type="resource"] tbody').append(toHTML(resource,i));
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
		if(confirm('Are you sure to remove all resources?')){
			resourceController.resources.length = 0;
			localStorageController.save(resourceController.storageKey,resourceController.resources);
			resourceController.populateResource();
		}
	},
	onIncrement: function(id){
		resourceController.resources[id].current = Math.min(resourceController.resources[id].current+1,resourceController.resources[id].max);
		localStorageController.save(resourceController.storageKey,resourceController.resources);
		resourceController.populateResource();
	},
	onDecrement: function(id){
		resourceController.resources[id].current = Math.max(resourceController.resources[id].current-1,0);
		localStorageController.save(resourceController.storageKey,resourceController.resources);
		resourceController.populateResource();
	}
};}();

resourceModalController = function(){return {
	show: function(id){
		if(id !== ""){
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
	if(!resource)return '<tr><td colspan="3">Not Available</td></tr>';
	return `
	<tr><td>${resource.name}<span class="badge bg-secondary">${resource.rest}</span><span class="badge bg-primary" data-current="${resource.current}" data-max="${resource.max}">${resource.current}/${resource.max}</span></td>
	<td>
	<button class="btn btn-dark btn-operate" onclick="resourceController.onIncrement(${i})">+</button>
	<button class="btn btn-dark btn-operate" onclick="resourceController.onDecrement(${i})">−</button>
	<button class="btn btn-warning btn-operate" onclick="resourceModalController.show(${i})">E</button>
	</td></tr>
	`;
}