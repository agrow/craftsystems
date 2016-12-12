
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

var margin = {top: 10, right: 60, bottom: 10, left: 60},
	width = 350;//Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
	height = 350;//Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
		
////////////////////////////////////////////////////////////// 
////////////////////////// Data ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var graphData = [];
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
		
var fullGameData = [];

var parseData = function(tsvFile){
	d3.tsv(tsvFile, function(error, data) {
		if(error) throw error;
		
		var rowCounter = 0;
		var axisNames = [];
		data.forEach(function(d) {
			if(rowCounter === 0){
				//TITLE ROW. Grab the axis name values we want...
			} else {
				// OTHER ROWS. Add...
				var game= [];
				// game.push({axis:NAME,value:score/100})
				// To the data container for each axis for this game
				
				graphData.push(game);
			}
			console.log(d);
		});
	});
};

parseData("media/data/craftingDimensions.tsv");

////////////////////////////////////////////////////////////// 
//////////////////// Draw the Chart ////////////////////////// 
////////////////////////////////////////////////////////////// 

var color = d3.scaleOrdinal()
	.range(["#EDC951","#CC333F","#00A0B0"]);
	
var radarChartOptions = {
  w: width,
  h: height,
  margin: margin,
  maxValue: 0.5,
  levels: 5,
  roundStrokes: true,
  color: color
};
//Call function to draw the Radar chart
//RadarChart(".radarChart", graphData, radarChartOptions);