resourceController = function(){return {
	// static fields
	storageKey: 'resources',
	profileKey: 'profile',
	
	// dynamic fields
	profile: '',
	resources:[],
	init: function(){
		// load profile
		resourceController.profile = localStorageController.load(resourceController.profileKey,'string',false);
		if(!resourceController.profile){// if no current profile, it must be from elder version. do conversion
			resourceController.convertData();
		}
		//load all records from localStorage
		resourceController.resources = localStorageController.load(resourceController.getStorageKey(),'array',true);
		//populate to UIs
		resourceController.populateResource();
	},
	getStorageKey: function(){
		return `${resourceController.storageKey}.${resourceController.profile}`;
	},
	convertData: function(){// 
		let resource = localStorageController.load(resourceController.storageKey,'array',true);
		resourceController.profile = 'default';
		localStorageController.save(resourceController.profileKey,resourceController.profile);
		localStorageController.save(resourceController.getStorageKey(),resource);
		localStorageController.remove(resourceController.storageKey);
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
		if(!resourceModalController.validate())return;
		let r = $('form[data-type="resource"]').serializeArray();
		let output = {};
		output.name = r.find(e=>e.name==="name").value;
		output.rest = r.find(e=>e.name==="rest").value;
		output.current = output.max = Number.parseInt(r.find(e=>e.name==="max").value)
		let id = r.find(e=>e.name==="id").value;
		if(id !== "" && id > -1)resourceController.resources.splice(id,1,output);
		else resourceController.resources.push(output);
		
		localStorageController.save(resourceController.getStorageKey(),resourceController.resources);
		resourceController.populateResource();
		$('div.modal[data-type="resource"]').modal('hide');
	},
	removeAll: function(){
		if(!confirm('Are you sure to remove all resources?'))return;
		resourceController.resources.length = 0;
		localStorageController.save(resourceController.getStorageKey(),resourceController.resources);
		resourceController.populateResource();
	},
	onIncrement: function(id){
		let org = resourceController.resources[id].current;
		resourceController.resources[id].current = Math.min(resourceController.resources[id].current+1,resourceController.resources[id].max);
		if(resourceController.resources[id].current === org)return;
		localStorageController.save(resourceController.getStorageKey(),resourceController.resources);
		resourceController.populateResource();
	},
	onDecrement: function(id){
		let org = resourceController.resources[id].current;
		resourceController.resources[id].current = Math.max(resourceController.resources[id].current-1,0);
		if(resourceController.resources[id].current === org)return;
		localStorageController.save(resourceController.getStorageKey(),resourceController.resources);
		resourceController.populateResource();
	},
	onRemove: function(id){
		if(!confirm('Are you sure to remove the resource?'))return;
		resourceController.resources.splice(id,1);
		localStorageController.save(resourceController.getStorageKey(),resourceController.resources);
		resourceController.populateResource();
	},
	doTurnRest: function(){
		resourceController.doRest(["PR"]);
	},
	doShortRest: function(){
		resourceController.doRest(["SR"]);
	},
	doLongRest: function(){
		resourceController.doRest(["LR","SR"]);
	},
	doDawnRest: function(){
		resourceController.doRest(["DN"]);
	},
	doDailyRest: function(){
		resourceController.doRest(["24"]);
	},
	doRest: function(types){
		resourceController.resources.filter((e)=>types.includes(e.rest)).forEach((e)=>{
			if(e.current === e.max)return;
			console.log(`${e.name}: ${e.current} -> ${e.max}`);
			e.current = e.max;
		});
		localStorageController.save(resourceController.getStorageKey(),resourceController.resources);
		resourceController.populateResource();
	}
};}();

resourceModalController = function(){return {
	init: function(){
		//validation
		$('form[data-type="resource"]').find('[data-validate][data-validate-empty]').change(function(event){
			event.preventDefault();
			$(this).removeClass('is-valid is-invalid');
			let isValid = $(this).val() !== '' && $(this).val() !== null && $(this).val() !== undefined;
			$(this).addClass(isValid ? 'is-valid' : 'is-invalid');
		});
		$('div.modal[data-type="resource"]').on('hidden.bs.modal',function(event){
			resourceModalController.clear();
		});
	},
	show: function(id){
		if(id !== undefined && id > -1){//damn it can be zero...
			let resource = resourceController.resources[id];
			$('form[data-type="resource"]').find('[name="id"]').val(id);
			$('form[data-type="resource"]').find('[name="name"]').val(resource.name);
			$('form[data-type="resource"]').find('[name="rest"]').val(resource.rest);
			$('form[data-type="resource"]').find('[name="max"]').val(resource.max);
		}
		$('div.modal[data-type="resource"]').modal('show');
	},
	clear: function(){
		$('form[data-type="resource"]').find('[name="id"]').val('');
		$('form[data-type="resource"]').find('[data-validate]').val('');
		$('form[data-type="resource"]').find('[data-validate]').removeClass('is-valid is-invalid');
	},
	validate: function(){
		$('form[data-type="resource"]').find('[data-validate][data-validate-empty]').change();
		return $('form[data-type="resource"]').find('[data-validate].is-invalid').length < 1;
	}
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
	},
	remove: function(key){
		localStorage.removeItem(key);
	}
};}();

$(document).ready(function(){
	resourceController.init();
	resourceModalController.init();
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
		case 'PR':return 'Per Round';
		case 'DN':return 'Dawn';
		case '24':return 'Per 24 Hours';
		case 'OR':default: return 'Others';
	}
}