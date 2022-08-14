/////////////////////////////////////////////////////
//Graphing Setup
/////////////////////////////////////////////////////
var canvas = document.getElementById( "canvasMain" );  
var ctx = canvas.getContext( "2d" );  
   
//Graph variables
var GRAPH_TOP = 25;
var GRAPH_BOTTOM = 300;
var GRAPH_LEFT = 75;
var GRAPH_RIGHT = 615;
   
var GRAPH_HEIGHT = GRAPH_BOTTOM - GRAPH_TOP; 
var GRAPH_WIDTH = GRAPH_RIGHT - GRAPH_LEFT;

//Setup test data   
var dataArr = [ 10, 24, 18, 16, 13 ];  
var arrayLen = 31; //set manually here to 31 days //dataArr.length;  
var largestElement = 0;
FindLargestElement();

//Clear canvas  
ctx.clearRect( 0, 0, 500, 400);

//Draw primary X and Y axis  
ctx.beginPath();  
ctx.moveTo( GRAPH_LEFT, GRAPH_TOP );  
ctx.lineTo( GRAPH_LEFT, GRAPH_BOTTOM );  
ctx.lineTo( GRAPH_RIGHT, GRAPH_BOTTOM );  
ctx.stroke(); 

//Draw faint ref lines
DrawRefLine(GRAPH_LEFT, GRAPH_TOP, GRAPH_RIGHT, GRAPH_TOP);
DrawRefLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/4)*1, GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/4)*1);
DrawRefLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/4)*2, GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/4)*2);
DrawRefLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/4)*3, GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/4)*3);

//Draw the 13kb limit
DrawLimitLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/largestElement) * (largestElement-13), GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/largestElement) * (largestElement-13));

//Draw graph titles and text
PrintAxisHeadings();
PrintAxisValues();

//Draw the graph
DrawDataPlot();


/////////////////////////////////////////////////////
//STATIFY FUNCTIONS
/////////////////////////////////////////////////////

function PrintAxisValues() {
    ctx.font = "bold 14px Calibri";
    ctx.fillText(largestElement, GRAPH_LEFT - 20, GRAPH_TOP);
    ctx.fillText("0", GRAPH_LEFT - 20, GRAPH_BOTTOM);
}

function PrintAxisHeadings() {
    ctx.font = "bold 14px Calibri";
    ctx.fillText("Kilobytes", GRAPH_LEFT - 65, GRAPH_HEIGHT/2 + GRAPH_TOP);
    ctx.fillText("Days 1-31", GRAPH_RIGHT - GRAPH_WIDTH/2 - 20, GRAPH_BOTTOM + 30);
}

function DrawRefLine(startX, startY, endX, endY) {
    // draw reference line at the top of the graph  
    ctx.beginPath();
    // set light grey color for reference lines  
    ctx.strokeStyle = "#BBB";
    ctx.moveTo( startX, startY );
    ctx.lineTo( endX, endY );
    ctx.stroke();
}
function DrawLimitLine(startX, startY, endX, endY) {
    // draw reference line at the top of the graph  
    ctx.beginPath();
    // set light grey color for reference lines  
    ctx.strokeStyle = "#F55";
    ctx.moveTo( startX, startY );
    ctx.lineTo( endX, endY );
    ctx.stroke();
}

function DrawDataDiamond(x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, (y)-size);
    // top left edge
    ctx.lineTo(x - size, (y + size)-size);
    // bottom left edge
    ctx.lineTo(x, (y + size*2) - size);
    // bottom right edge
    ctx.lineTo(x + size, (y + size) - size);
    // closing the path automatically creates
    // the top right edge
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.restore();
}

function DrawDataPlot() {
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
    //Add first point in the graph
    var pointX = GRAPH_LEFT;
    var pointY = (GRAPH_HEIGHT - dataArr[ 0 ] / largestElement * GRAPH_HEIGHT) + GRAPH_TOP;
    ctx.moveTo(pointX, pointY);
    DrawDataDiamond(pointX, pointY, 4);
    
    //Loop over each datapoint
    for( var i = 1; i < arrayLen; i++ ){
        pointX = GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT;
        pointY = (GRAPH_HEIGHT - dataArr[ i ] / largestElement * GRAPH_HEIGHT) + GRAPH_TOP;
        ctx.lineTo(pointX, pointY);
        //Draw the graph  
        ctx.stroke();
        DrawDataDiamond(pointX, pointY, 4);
    }
}

function FindLargestElement() {
    var pos = 0;
    for( var i = 0; i < arrayLen; i++ ){  
        if( dataArr[ i ] > largestElement ){  
            largestElement = dataArr[ i ];
            pos = i;  
        }  
    }  
    //if largest point below 13, set 13kb as the upper limit of the graph

    console.log("Largest data-point in array is " + largestElement + "kb, on day " + (pos+1));
}