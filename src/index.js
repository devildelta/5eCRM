resourceController = function(){return {
	// static fields
	storageKey: 'resources',
	
	// dynamic fields
	profile: '',
	resources:[],
	load: function(profile){
		console.log(`resourceController.load#start profile=${profile}`);
		resourceController.profile = profile;
		resourceController.resources = localStorageController.load(resourceController.getStorageKey(),'array',true);
		resourceController.populateResource();
		console.log('resourceController.load#end');
	},
	getStorageKey: function(){
		return `${resourceController.storageKey}.${resourceController.profile}`;
	},
	/*
	convertData: function(){// 
		let resource = localStorageController.load(resourceController.storageKey,'array',true);
		resourceController.profile = 'default';
		localStorageController.save(resourceController.profileKey,resourceController.profile);
		localStorageController.save(resourceController.getStorageKey(),resource);
		localStorageController.remove(resourceController.storageKey);
	},
	*/
	populateResource: function(){
		console.log('resourceController.populateResource#start');
		$('div.container-md div[data-type="resource"] div.item-resource').remove();
		for(let i = 0;i< resourceController.resources.length;i++){
			let resource = resourceController.resources[i];
			console.log(`\t${resource.name} (${resource.rest})`);
			$('div.container-md div[data-type="resource"]').append(toHTML(resource,i));
		}
		console.log('resourceController.populateResource#end');
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
	removeAll: function(needConfirm){
		if(needConfirm)if(!confirm('Are you sure to remove all resources?'))return;
		resourceController.resources.length = 0;
		localStorageController.save(resourceController.getStorageKey(),resourceController.resources);
		resourceController.populateResource();
	},
	removeProfile: function(profile){
		localStorageController.remove(resourceController.getStorageKey());
	},
	onIncrement: function(id){
		let org = resourceController.resources[id].current;
		resourceController.resources[id].current = Math.min(resourceController.resources[id].current+1,resourceController.resources[id].max);
		if(resourceController.resources[id].current === org)return;
		//localStorageController.save(resourceController.getStorageKey(),resourceController.resources);
		resourceController.populateResource();
	},
	onDecrement: function(id){
		let org = resourceController.resources[id].current;
		resourceController.resources[id].current = Math.max(resourceController.resources[id].current-1,0);
		if(resourceController.resources[id].current === org)return;
		//localStorageController.save(resourceController.getStorageKey(),resourceController.resources);
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

profileController = function(){return {
	listKey: 'profiles',
	profileKey: 'profile',
	list: [],
	init:function(){
		//load profile list from memory
		console.log('profileController.init#start');
		profileController.list = localStorageController.load(profileController.listKey,'array',true);
		profileController.populate();
		// on list change populate list
		$('.select-profile-list').change(function(e){
			resourceController.load($(this).val());
		});
		
		console.log('profileController.init#end');
	},
	populate:function(){
		console.log('profileController.populate#start');
		$('.select-profile-list option').remove();
		$('.select-profile-list').append($('<option value="default">(default)</option>'));
		for(item of profileController.list){
			console.log(`\tProfile ${item}`);
			$('.select-profile-list').append($(`<option value="${item}">${item}</option>`));
		}
		console.log('profileController.populate#end');
	},
	addProfile:function(){
		let input = prompt('Enter the profile name');
		if(profileController.list.indexOf(input) > -1){
			console.log(`profileController.addProfile input=${input} already existed.`);
			return;
		}
		console.log(`profileController.addProfile#start input=${input}`);
		profileController.list.push(input);
		localStorageController.save(profileController.listKey,profileController.list);
		profileController.populate();
		$('.select-profile-list').val(input).change();
		//profileController.loadProfile();
		console.log('profileController.addProfile#end');
	},
	deleteProfile:function(){
		if(!confirm('Are you sure to remove the profile?'))return;
		let input = $('.select-profile-list').val();
		profileController.list.splice(profileController.list.findIndex(e=>e===input),1);
		localStorageController.save(profileController.listKey,profileController.list);
		profileController.populate();
		resourceController.removeAll(false);
		resourceController.removeProfile();
		$('.select-profile-list').val('default').change();
	},
	//saveProfile:function(){},
	/*
	loadProfile:function(){
		resourceController.load($('.select-profile-list').val());
	}
	*/
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
	console.log('document.ready#start');
	profileController.init();
	//resourceController.init();
	resourceModalController.init();
	$('.select-profile-list').val('default').change();
	//profileController.loadProfile();
	console.log('document.ready#end');
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