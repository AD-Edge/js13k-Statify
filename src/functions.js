/////////////////////////////////////////////////////
//Graphing Setup
/////////////////////////////////////////////////////
var canvas = document.getElementById( "canvasMain" );
var ctx = canvas.getContext( "2d" );

//Graph variables
var GRAPH_TOP = 25;
var GRAPH_BOTTOM = 300;
var GRAPH_LEFT = 60;
var GRAPH_RIGHT = 766;
   
var GRAPH_HEIGHT = GRAPH_BOTTOM - GRAPH_TOP; 
var GRAPH_WIDTH = GRAPH_RIGHT - GRAPH_LEFT;

//Setup test data
var dataArr = [ 20, 26, 45, 36, 25, 25, 26, 19, 12, 13, 16, 18, 18, 18, 22, 15, 12, 10, 11, 13 ];
//var dataArr = [ 45, 43, 30, 25];
var dataArrOp = [ 10, 12, 27, 24, 12, 12, 13, 9, 6, 5, 9, 10, 10, 10, 12, 8 , 7, 6, 7, 8 ];
var arrayLen = 31; //set manually here to 31 days //dataArr.length;  
var largestElement = 0;

//TODO
//add toggle for max value graph displays

FindLargestElement();

//Clear canvas  
ctx.clearRect( 0, 0, canvas.width, canvas.height);

//Draw primary X and Y axis  
ctx.beginPath();  
ctx.moveTo( GRAPH_LEFT, GRAPH_TOP );  
ctx.lineTo( GRAPH_LEFT, GRAPH_BOTTOM );  
ctx.lineTo( GRAPH_RIGHT, GRAPH_BOTTOM );  
ctx.stroke(); 

//Draw faint ref lines
DrawRefLine(GRAPH_LEFT, GRAPH_TOP, GRAPH_RIGHT, GRAPH_TOP);
DrawRefLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/4)*1, GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/4)*1);
PrintYAxisValue(GRAPH_TOP + (GRAPH_HEIGHT/4)*1, largestElement*0.75);
DrawRefLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/4)*2, GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/4)*2);
PrintYAxisValue(GRAPH_TOP + (GRAPH_HEIGHT/4)*2, largestElement*0.5);
DrawRefLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/4)*3, GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/4)*3);
PrintYAxisValue(GRAPH_TOP + (GRAPH_HEIGHT/4)*3, largestElement*0.25);

//Draw the 13kb limit
DrawLimitLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/largestElement) * (largestElement-13), GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/largestElement) * (largestElement-13));

//Draw graph titles and text
PrintAxisHeadings();
PrintAxisValues();

//Draw the uncompressed data graph
DrawDataPlot_UNCOMPRESSED();

//Draw the optimized data graph
DrawDataPlot_OPTIMIZED();

/////////////////////////////////////////////////////
//STATIFY FUNCTIONS
/////////////////////////////////////////////////////

function PrintAxisValues() {
    ctx.font = "14px Calibri";
    ctx.fillStyle = "#888888";
    ctx.fillText(largestElement, GRAPH_LEFT - 20, GRAPH_TOP);
    ctx.fillText("0", GRAPH_LEFT - 20, GRAPH_BOTTOM);
}

function PrintAxisHeadings() {
    ctx.font = "bold 18px Calibri";
    ctx.fillStyle = "#000000";
    ctx.fillText("kb", GRAPH_LEFT - 52, GRAPH_HEIGHT/2 + GRAPH_TOP);
    ctx.fillText("Days 1-31", GRAPH_RIGHT - GRAPH_WIDTH/2 - 20, GRAPH_BOTTOM + 40);
}

function PrintXAxisValue(x, val, bold) {
    if(bold) {
        ctx.font = "bold 12px Calibri";
        ctx.fillStyle = "#000000";
    } else {
        ctx.font = "10px Calibri";
        ctx.fillStyle = "#888888";
    }
    ctx.fillText(val, x, GRAPH_BOTTOM + 14);
}
function PrintYAxisValue(y, val) { 
    ctx.font = "10px Calibri";
    ctx.fillStyle = "#888888";
    ctx.fillText(val, GRAPH_LEFT - 26, y);
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

    //draw red 13 text
    ctx.font = "bold 10px Calibri";
    ctx.fillStyle = "#FF8888";
    ctx.fillText("13", GRAPH_LEFT - 20, startY);
}

function DrawDataDiamond(x, y, size, color) {
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
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();

    ctx.moveTo(x, y); //seems needed to get graph drawing from center of points, fix this
}

function DrawDataPlot_UNCOMPRESSED() {
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.setLineDash([5, 15]);
    ctx.strokeStyle = "blue";
    //Add first point in the graph
    var pointX = GRAPH_LEFT;
    var pointY = (GRAPH_HEIGHT - dataArr[ 0 ] / largestElement * GRAPH_HEIGHT) + GRAPH_TOP;
    ctx.moveTo(pointX, pointY);
    DrawDataDiamond(pointX, pointY, 4, 'blue');
    PrintXAxisValue(pointX, 1, true);
    
    //Loop over each datapoint
    for(var i = 1; i < arrayLen; i++ ){
        pointX = (GRAPH_RIGHT-40) / (arrayLen) * i + GRAPH_LEFT; //-40 here scales down the axis to fit
        pointY = (GRAPH_HEIGHT - dataArr[i] / largestElement * GRAPH_HEIGHT) + GRAPH_TOP;
        ctx.lineTo(pointX, pointY);
        //Draw the graph  
        ctx.stroke();

        DrawDataDiamond(pointX, pointY, 4, 'blue');
        PrintXAxisValue(pointX, i+1, false);
        //console.log("checking value: " + i);
    }
}
function DrawDataPlot_OPTIMIZED() {
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.setLineDash([]);
    ctx.strokeStyle = "black";
    //Add first point in the graph
    var pointX = GRAPH_LEFT;
    var pointY = (GRAPH_HEIGHT - dataArrOp[ 0 ] / largestElement * GRAPH_HEIGHT) + GRAPH_TOP;
    ctx.moveTo(pointX, pointY);
    DrawDataDiamond(pointX, pointY, 4, 'black');
    PrintXAxisValue(pointX, 1, true);
    
    //Loop over each datapoint
    for(var i = 1; i < arrayLen; i++ ){
        pointX = (GRAPH_RIGHT-40) / (arrayLen) * i + GRAPH_LEFT; //-40 here scales down the axis to fit
        pointY = (GRAPH_HEIGHT - dataArrOp[i] / largestElement * GRAPH_HEIGHT) + GRAPH_TOP;
        ctx.lineTo(pointX, pointY);
        //Draw the graph  
        ctx.stroke();

        DrawDataDiamond(pointX, pointY, 4, 'black');
        PrintXAxisValue(pointX, i+1, false);
        //console.log("checking value: " + i);
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