
/////////////////////////////////////////////////////////
//////////////// The Radar Chart Setup //////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////
// Edited by April Grow
// Found at http://bl.ocks.org/nbremer/21746a9668ffdf6d8242

////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var margin = {top: 50, right: 100, bottom: 100, left: 100},
	width = 350;//Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
	height = 350;//Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
		
////////////////////////////////////////////////////////////// 
////////////////////////// Data/GLOBALS ////////////////////////////// 
////////////////////////////////////////////////////////////// 

// PROJECT-SPECIFIIIIIC
// Note the order is the same as it appears in the incoming tsv headers
var expectedAxisNames = [	"Fidelity of Action",
							"Transience of Peripherals",
							"Variable Outcome",
							"Recognition of Outcome",
							"Progression",
							"Player Expressiveness",
							"Recipe Definition"
						];

// !!!! THESE TWO LISTS MUST REMAIN PARALLEL! !!!!
var graphData = [];
var graphClassNames = [];
// !!!! THESE TWO LISTS MUST REMAIN PARALLEL! !!!!

/*[
		  [//iPhone
			{axis:"Battery Life",value:0.22},
			{axis:"Brand",value:0.28},
			{axis:"Contract Cost",value:0.29},
			{axis:"Design And Quality",value:0.17},
			{axis:"Have Internet Connectivity",value:0.22},
			{axis:"Large Screen",value:0.02},
			{axis:"Price Of Device",value:0.21},
			{axis:"To Be A Smartphone",value:0.50}			
		  ],[//Samsung
			{axis:"Battery Life",value:0.27},
			{axis:"Brand",value:0.16},
			{axis:"Contract Cost",value:0.35},
			{axis:"Design And Quality",value:0.13},
			{axis:"Have Internet Connectivity",value:0.20},
			{axis:"Large Screen",value:0.13},
			{axis:"Price Of Device",value:0.35},
			{axis:"To Be A Smartphone",value:0.38}
		  ],[//Nokia Smartphone
			{axis:"Battery Life",value:0.26},
			{axis:"Brand",value:0.10},
			{axis:"Contract Cost",value:0.30},
			{axis:"Design And Quality",value:0.14},
			{axis:"Have Internet Connectivity",value:0.22},
			{axis:"Large Screen",value:0.04},
			{axis:"Price Of Device",value:0.41},
			{axis:"To Be A Smartphone",value:0.30}
		  ]
		];
		*/
		

	
var craftLib = new CraftSystemLibrary();

////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////// 

var parseData = function(tsvFile){
	d3.tsv(tsvFile, function(error, data) {
		if(error) throw error;
		
		// SORT ALPHABETICALLY?! on data["Game Name"]?
		data.sort(function(a, b){
			return a["Game Name"].localeCompare(b["Game Name"]);
		});
		
		var axisNoteName = "";
		data.forEach(function(d) {
			var gameGraphData= [];
			var gameStored = craftLib.store(d["Game Name"], d["System Description"], new CraftObj(d));
			// game.push({axis:NAME,value:score/100})
			// To the data container for each axis for this game
			for(var i = 0; i < expectedAxisNames.length; i++){
				gameGraphData.push({axis:expectedAxisNames[i],
						   value:d[expectedAxisNames[i]]/100});
			}
			
			// Communicate with d3 that this game belongs to a bigger system... 
			// to be called when buttons are pressed!
			// Which we must call via class names
			// !!!! THESE TWO LISTS MUST REMAIN PARALLEL! !!!!
			graphData.push(gameGraphData);
			graphClassNames.push(gameStored.d3ClassName);
			// !!!! THESE TWO LISTS MUST REMAIN PARALLEL! !!!!
			
			// Make some UI elements....
			addCheckbox(gameStored.cslName, gameStored.systemCheckboxID, "systemList");
			// make show/hide//$("#" + systemCheckboxID).
			
			// If this is the first time we have seen the game, make a new checkbox
			// If not, don't but still add the ID for that game's checkbox to its fellow game objects...
			if(craftLib.lookupByGameName(d["Game Name"]).length > 1){
				gameStored.gameCheckboxID = craftLib.lookupByGameName(d["Game Name"])[0].gameCheckboxID;
			} else {
				addCheckbox(gameStored['Game Name'], gameStored.gameCheckboxID, "gameList");
			}
			//console.log(d);
			//console.log(game);
			//console.log(d["Game Name"]);
		});
		
		//console.log(jQuery.ui);
		
		//console.log($("input[type='checkbox']"));
		//console.log(graphData);
		//console.log(craftLib);
		// more tests.... of our new lib...
		/*
		craftLib.eachSystem(function(name, data){
			console.log(name, data);
		});
		
		console.log("!!! TESTING OTHER THING !!!");
		craftLib.eachGame("Diablo III", function(name, data){
			console.log("D3? " + name, data);
		});
		*/
		
		// Wait until graphData has been parsed TO MAKE THE GRRAAAAAPHHH
		//Call function to draw the Radar chart
		RadarChart(".radarChart", graphData, radarChartOptions, graphClassNames);
	});
	
	
};


////////////////////////////////////////////////////////////// 
//////////////////// Draw the Chart ////////////////////////// 
////////////////////////////////////////////////////////////// 

var color = d3.scaleOrdinal()
	.range(["#4D2E2E","#9E4C36","#D18538", "#D96745", "#ECBA59", "#BD5A3D", 
			"#EB9A0D","#E3CCAA","#AADFE3", "#4F6670", "#E0E3B8", "#FF9191",
			"#E3E3C5","#C9C991","#B2B32D", "#78F6FF", "#2EF1FF", "#3BB9D9",
			"#BE60E0","#E053C6","#F25CA2", "#F2BBCF", "#26B9CD", "#F2B704"]);
	
var radarChartOptions = {
  w: width,
  h: height,
  margin: margin,
  maxValue: 0.5,
  levels: 5,
  roundStrokes: true,
  color: color
};

////////////////////////////////////////////////////////////// 
///////////////// Dynamic UI Nonsense //////////////////////// 
////////////////////////////////////////////////////////////// 

var addCheckbox = function(name, id, parentID){
	var container = $('#' + parentID);
	
	$('<input />', {type: 'checkbox', id: id, value: name}).appendTo(container);
	//$('#' + id).checkboxradio( "option", "classes.ui-checkboxradio" );
	
	$('<label />', {'for': id, text: name}).appendTo(container);
	
	//console.log($('#' + id));
	$("#"+id).checkboxradio();
	
	$('#' + id).change(function() {
        if(this.checked) {
            showSystem(this.value);
        } else {
        	hideSystem(this.value);
        }
        refreshCheckboxStatus();       
    });
	
};

/////////////////// Dynamic Radar Chart... /////////////////////

var hideSystem = function(str){
	// RadarChart.hideRadarWrapper(d3ClassName);
	console.log("Trying to hide... " + str);
	var systems = craftLib.lookupByStr(str);
	
	for(var i = 0; i < systems.length; i++){
		console.log("Calling hide on " + systems[i].d3ClassName);
		console.log(d3.selectAll("#" + systems[i].d3ClassName));
		d3.selectAll("." + systems[i].d3ClassName).style("opacity", 0);
		systems[i].visible = false;
	}
	
};

var showSystem = function(str){
	// RadarChart.showRadarWrapper(d3ClassName);
	// RadarChart.hideRadarWrapper(d3ClassName);
	console.log("Trying to show... " + str);
	var systems = craftLib.lookupByStr(str);
	
	for(var i = 0; i < systems.length; i++){
		console.log("Calling show on " + systems[i].d3ClassName);
		console.log(d3.selectAll("#" + systems[i].d3ClassName));
		d3.selectAll("." + systems[i].d3ClassName).style("opacity", 1);
		systems[i].visible = true;
	}
};

var refreshCheckboxStatus = function(){
	// Connects the different systems of checkboxes
	// Such that if all the systems of DiabloIII are unchecked but the game is checked,
	// uncheck it!
	craftLib.eachGame(function(gameName, listOfSystems){
		var allvisible = true;
		var allhidden = true;
		for(var i = 0; i < listOfSystems.length; i++){
			// If any system in the list of systems is visible, then they cannot be hidden
			if(listOfSystems[i].visible === true) {
				//console.log("found visible system, all hidden false ");
				allhidden = false;
			}
			// likewise, if any is NOT visible, then they cannot be all visible
			else {
				//console.log("found hidden system, all visible false");
				allvisible = false;
			}
		}
		//console.log("state of variables", allvisible, allhidden);
		// If all systems in a group are visible, make sure all the checkboxes are checked
		if(allvisible){
			for(var i = 0; i < listOfSystems.length; i++){
				// Check each system
				//console.log("Checking each system...", listOfSystems[i].systemCheckboxID);
				checkAndSetVisibility(listOfSystems[i].systemCheckboxID, false, true);
			}
			// Check the game
			if(listOfSystems.length > 0){ 
				//console.log("Checking THE GAME...", listOfSystems[0].gameCheckboxID);
				checkAndSetVisibility(listOfSystems[0].gameCheckboxID, false, true);
			}
		}
		
		// Likewise, if all systems are hidden, make sure they are unchecked
		if(allhidden){
			for(var i = 0; i < listOfSystems.length; i++){
				// Uncheck each system
				checkAndSetVisibility(listOfSystems[i].systemCheckboxID, true, false);
			}
			// Uncheck the game
			if(listOfSystems.length > 0){ 
				checkAndSetVisibility(listOfSystems[0].gameCheckboxID, true, false);
			}
		}
		
	});
};

// If id's visibility is === to check, set visibility to (set)
var checkAndSetVisibility = function(id, check, set){
	//console.log("Check and set visibility...", id, check, set, $("#" + id).prop('checked'));
	if($("#" + id).prop('checked') === check){
		//console.log("Changing " + id + " checked property from " + check + " to " + set);
		$("#" + id).prop('checked', set);
		$("#" + id).checkboxradio( "refresh" );
	}
};

////////////////////////////////////////////////////////////////
////////////////// START THE CODE!!! ///////////////////////////
////////////////////////////////////////////////////////////////


$(document).ready(function() {
	//$( "#radio" ).controlgroup();
	parseData("media/data/craftingDimensions.tsv");
});