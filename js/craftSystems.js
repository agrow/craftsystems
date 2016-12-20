/////////////////////////////////////////////////////////////////
// Collection of games. Going to use for categorizing and collecting
// and holding data on games we upload....
// Probably should be a singleton...
/////////////////////////////////////////////////////////////////
var CraftSystemLibrary = function(incomingSystems, incomingGames){
	
	this.systems = incomingSystems || {};
	this.gamesByGameName = incomingGames || {};
	this.namesByID = [];
	this.idCount = 0;
	
};

//CraftSystemLibrary.prototype.saveAxisNames

// VALUE should be a CRAFTOBJ which is nothing particularly special or anything, 
// it's just a new obj that holds a copy of all the parseinfo....
CraftSystemLibrary.prototype.store = function(gameName, craftSystem, value){
	var cslName = gameName + " " + craftSystem;
	if(this.systems[cslName] !== undefined) {
		console.log("ASSUMING UNIQUE GAME NAME+SYSTEMS, BUT THERE IS A DUPLICATE!!!!", cslName, this);
		return false;
	}
	this.systems[cslName] = value;
	this.namesByID.push(cslName);
	
	if(this.gamesByGameName[gameName] === undefined){
		this.gamesByGameName[gameName] = [];
	}
	
	// ASSUMES THERE ARE NO DUPLICATE SYSTEMS!
	this.gamesByGameName[gameName].push({	craftSystemName:craftSystem,
								cslName:cslName});
	
	//console.log("adding crafting system " + cslName + " to the library");
	// bestowing libraryID...
	this.systems[cslName].id = this.idCount;
	this.systems[cslName].gameCheckboxID = this.idCount + "_gcb";
	this.systems[cslName].systemCheckboxID = this.idCount + "_cb";
	this.systems[cslName].d3ClassName = "_radar_" + this.idCount;
	this.systems[cslName].cslName = cslName;
	this.idCount++;
	
	return this.systems[cslName];
};
///////////////////////////////////////////////////////////////////////
////////////////////////// LOOKUP FUNCTIONS ///////////////////////////
///////////////////////////////////////////////////////////////////////
/////// Lookup via: arbitrary str, CSLName, game name, or id /////////

// Note: Looking by arbitrary str returns a list either way for easier use
CraftSystemLibrary.prototype.lookupByStr = function(str){
	var tryCSL = [];
	// Try CSL first, it's faster and easier
	if(this.lookupByCSLName(str) === undefined){
		var tryGame = this.lookupByGameName(str);
		return tryGame;
	} else {
		tryCSL.push(this.lookupByCSLName(str));
		return tryCSL;
	}
};

// Returns a CraftObj if it exists
CraftSystemLibrary.prototype.lookupByCSLName = function(name){
	return this.systems[name];
};

// Returns a list of CraftObj if they exist
CraftSystemLibrary.prototype.lookupByGameName = function(name){
	var possibleSystems = [];
	for(var i = 0; i < this.gamesByGameName[name].length; i++){
		possibleSystems.push(this.systems[this.gamesByGameName[name][i].cslName]);
	}
	//console.log("possible systems", possibleSystems);
	return possibleSystems;
};

CraftSystemLibrary.prototype.lookupByID = function(id){
	return this.gamesByGameName[this.namesByID[id]];
};


///////////////////////////////////////////////////////////////////////
//////////////////////////// LOOP FUNCTIONS ///////////////////////////
///////////////////////////////////////////////////////////////////////
///////////// Do some action to or by each system or each game ////////

// e.g. gameLib.each(function(name, data){console.log(name, ": ", data)})
// EXPECTED ACTION: function(name, data){}
CraftSystemLibrary.prototype.eachSystem = function(action){
	for(var prop in this.systems){
		action(prop, this.systems[prop]);
	}
};

// EXPECTED ACTION: function(name, data){}
CraftSystemLibrary.prototype.eachGame = function(gameName, action){
	//forEachIn(this.systems, action); 
	// need to come up with a better way to loop through each system with a game name...
	var gameSystems = this.lookupByGameName(gameName);
	
	for(var i = 0; i < gameSystems.length; i++){
		action(gameSystems[i].cslName, gameSystems[i]);
	}
};

//******************************************************************
//////////////////////////////////////////////////////////////////
// - parseData should be sent by the parser and include all data 
// we have uploaded on the game
// 
var CraftObj = function(parseData) {
	//this.data = parseData;
	// Save local copy so we can iterate over them easily
	//this.axisNames = expectedAxisNames;
	
	// Copy all the parseData
	for (var prop in parseData){
		this[prop] = parseData[prop];
	}
	//console.log("created new CraftObject!", this);

	// Each CraftObj will also have added to it by lib...
	// - 	.id = this.idCount; // UNIQUE NUMBER -- This will be used for 
	// -	.cslName = cslName; // UNIQUE NAME (Game Name + System Description)
	
	this.id = -1;
	this.cslName = "";
	
	// Each CraftObj will also have added to it by main...
	// - 	.gameCheckboxID = _gcb; // UNIQUE
	// -	.systemCheckboxID = _cb; // UNIQUE
	// This way selections can happen by game or by system extremely easily...
	//
	
	this.gameCheckboxID = -1; // _gcb
	this.systemCheckboxID= -1; // _cb
	this.d3ClassName = -1; // radar_ D3 cannot select classes that start with a number...
	
};
