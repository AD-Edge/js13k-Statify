// A graph/data-renderer for use in competitions like #js13k
// Built using HTML/Canvas/JS
// First Created By Alex Delderfield, 2022
// https://twitter.com/Alex_ADEdge

/////////////////////////////////////////////////////
//Graphing Setup
/////////////////////////////////////////////////////
var canvas = document.getElementById( "canvasMain" );
var ctx = canvas.getContext( "2d" );
var canvasUnder = document.getElementById( "canvasUnder" );
var ctxU = canvasUnder.getContext( "2d" );

//Graph variables
var GRAPH_TOP = 25;
var GRAPH_BOTTOM = 300;
var GRAPH_LEFT = 60;
var GRAPH_RIGHT = 766;
   
var GRAPH_HEIGHT = GRAPH_BOTTOM - GRAPH_TOP; 
var GRAPH_WIDTH = GRAPH_RIGHT - GRAPH_LEFT;

//Setup test/demo data
// var dataArr = [ 20, 26, 45, 36, 25, 25, 26, 19, 12, 13, 16, 18, 18, 18, 22, 15, 12, 10, 11, 13 ];
// var dataArrOp = [ 10, 12, 27, 24, 12, 12, 13, 9, 6, 5, 9, 10, 10, 10, 12, 8 , 7, 6, 7, 8 ];

//Setup current user data
//TODO - generate these arrays automatically via batch script, manually input for now
var dataArr = [ 45, 51, 23, 24, 27, 29 ];
var dataArrOp = [ 11, 12, 7, 7, 9, 9];
//other data required
var incDay = 0; //current day, start at day 1 (0)
var arrayLen = 31; //set manually here to 31 days //dataArr.length;  
var largestElement = 0;

//Initial process of data
FindLargestElement();

//TODO
//Add toggle for max value graph displays
//If null, have no limit on Y
var maxYVal = null;

//Clear Canvas
ctx.clearRect( 0, 0, canvas.width, canvas.height);

//Draw primary X and Y axis  
ctx.beginPath();  
ctx.moveTo( GRAPH_LEFT, GRAPH_TOP );  
ctx.lineTo( GRAPH_LEFT, GRAPH_BOTTOM );  
ctx.lineTo( GRAPH_RIGHT, GRAPH_BOTTOM );  
ctx.stroke(); 

//Draw faint ref lines and print values
DrawRefLine(GRAPH_LEFT, GRAPH_TOP, GRAPH_RIGHT, GRAPH_TOP);
DrawRefLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/4)*1, GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/4)*1);
PrintYAxisValue(GRAPH_TOP + (GRAPH_HEIGHT/4)*1, Math.ceil(largestElement*0.75));
DrawRefLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/4)*2, GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/4)*2);
PrintYAxisValue(GRAPH_TOP + (GRAPH_HEIGHT/4)*2, Math.ceil(largestElement*0.5));
DrawRefLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/4)*3, GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/4)*3);
PrintYAxisValue(GRAPH_TOP + (GRAPH_HEIGHT/4)*3, Math.ceil(largestElement*0.25));

//Draw the 13kb limit line
DrawLimitLine(GRAPH_LEFT, GRAPH_TOP + (GRAPH_HEIGHT/largestElement) * (largestElement-13), GRAPH_RIGHT, GRAPH_TOP + (GRAPH_HEIGHT/largestElement) * (largestElement-13));

//Draw graph titles and text and legend
PrintAxisValues();
PrintLegend();

//todo instantiate a loop which slowly displays all values
const renderAnim = setInterval(LoopRenderGraph, 300);

/////////////////////////////////////////////////////
//STATIFY FUNCTIONS
/////////////////////////////////////////////////////

function LoopRenderGraph() {
    
    //Clear Canvas
    ctxU.clearRect( 0, 0, canvasUnder.width, canvasUnder.height);
    
    //Jump to final day, if we're at the end of the array
    //Otherwise, draw each day individually
    if(incDay == dataArr.length) {
        DrawDataPlot_UNCOMPRESSED(incDay-1, true);
        DrawDataPlot_OPTIMIZED(incDay-1);
        
        //draw remaining day values
        for(var i = incDay; i < arrayLen; i++) {
            if(i == dataArr.length-1) {
                PrintXAxisValue((GRAPH_RIGHT-40) / (arrayLen) * (i) + GRAPH_LEFT, i+1, true);
            } else {
                PrintXAxisValue((GRAPH_RIGHT-40) / (arrayLen) * (i) + GRAPH_LEFT, i+1, false);
            }
        }
        incDay = arrayLen-1;
        console.log(incDay);    
        PrintAxisHeadings();
        
        //end interval
        clearInterval(renderAnim);
        return;
    } else {
        //Draw the uncompressed data graph
        DrawDataPlot_UNCOMPRESSED(incDay, false);
        //Draw the optimized data graph
        DrawDataPlot_OPTIMIZED(incDay);
        
        console.log(incDay);    
        PrintAxisHeadings();
    }

    incDay++; //new day each run
}

//Prints Axis headings
function PrintAxisValues() {
    ctx.font = "14px Calibri";
    ctx.fillStyle = "#888888";
    ctx.fillText(largestElement, GRAPH_LEFT - 20, GRAPH_TOP);
    ctx.fillText("0", GRAPH_LEFT - 20, GRAPH_BOTTOM);
}
function PrintAxisHeadings() {
    ctxU.font = "bold 18px Calibri";
    ctxU.fillStyle = "#000000";
    ctxU.fillText("kb", GRAPH_LEFT - 52, GRAPH_HEIGHT/2 + GRAPH_TOP);
    ctxU.fillText("Days 1-" + (incDay+1), GRAPH_RIGHT - GRAPH_WIDTH/2 - 20, GRAPH_BOTTOM + 40);
}

//Legend which specifies the 2x types of graph viewed
function PrintLegend() {
    DrawDataDiamond(GRAPH_WIDTH * 0.95, GRAPH_BOTTOM + 30, 5, 'blue', 0, ctx);
    ctx.font = "bold 12px Calibri";
    ctx.fillStyle = 'blue';
    ctx.fillText('Uncompressed', GRAPH_WIDTH * 0.96, GRAPH_BOTTOM + 35,);
    
    DrawDataDiamond(GRAPH_WIDTH * 0.95, GRAPH_BOTTOM + 45, 5, 'black', 0, ctx);
    ctx.font = "bold 12px Calibri";
    ctx.fillStyle = 'black';
    ctx.fillText('Compressed', GRAPH_WIDTH * 0.96, GRAPH_BOTTOM + 50,);
}

//For printing X Axis values (days)
function PrintXAxisValue(x, val, bold) {
    if(bold) {
        ctxU.font = "bold 12px Calibri";
        ctxU.fillStyle = "#000000";
    } else {
        ctxU.font = "10px Calibri";
        ctxU.fillStyle = "#888888";
    }
    ctxU.fillText(val, x, GRAPH_BOTTOM + 14);
}
//For printing Y Axis values (kbs)
function PrintYAxisValue(y, val) { 
    //only print if value is high enough to not overlap with the 13 printed
    if(val > 13+(largestElement/16) || val < 13-(largestElement/16)) {
        ctx.font = "10px Calibri";
        ctx.fillStyle = "#888888";
        ctx.fillText(val, GRAPH_LEFT - 20, y);
    } else {// else, dont print
        console.log("Not printing Y-axis value for line at " + val + ", as it overlaps value '13'");
    }
        
}

//Draw a reference line (lighter line) to break up the graph
function DrawRefLine(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.strokeStyle = "#BBB"; //Light grey for reference lines  
    ctx.moveTo( startX, startY );
    ctx.lineTo( endX, endY );
    ctx.stroke();
}

//Draws red limit line at 13kb level
//Also labels it
function DrawLimitLine(startX, startY, endX, endY) {
    // draw reference line at the top of the graph  
    ctx.beginPath();
    // set light grey color for reference lines  
    ctx.strokeStyle = "#F55";
    ctx.moveTo( startX, startY );
    ctx.lineTo( endX, endY );
    ctx.stroke();

    //TODO handle graphs which start out under 13kb

    //draw red 13 text
    ctx.font = "bold 10px Calibri";
    ctx.fillStyle = "#FF8888";
    ctx.fillText("13", GRAPH_LEFT - 20, startY);
}

//Draw a diamond shape
//requires x/y location, scale to draw diamond and colour
function DrawDataDiamond(x, y, size, color, printVal, context) {
    context.save();
    context.beginPath();
    context.moveTo(x, (y)-size);
    // top left edge
    context.lineTo(x - size, (y + size)-size);
    // bottom left edge
    context.lineTo(x, (y + size*2) - size);
    // bottom right edge
    context.lineTo(x + size, (y + size) - size);
    // closing the path automatically creates
    // the top right edge
    context.closePath();
    context.fillStyle = color;
    context.fill();
    context.restore();

    if(printVal > 0) {
        context.font = "bold 10px Calibri";
        context.fillStyle = color;
        context.fillText(printVal, x + 4, y - 10);
    }

    context.moveTo(x, y); //seems needed to get graph drawing from center of points, fix this
}

//Plots the data from dataArr
//Uncompressed (blue line) data
//**also draws bold day */
function DrawDataPlot_UNCOMPRESSED(max, highlightFinal) {
    ctxU.beginPath();
    ctxU.lineJoin = "round";
    ctxU.setLineDash([5, 15]);
    ctxU.strokeStyle = "blue";

    //Add first point in the graph
    var pointX = GRAPH_LEFT;
    var pointY = (GRAPH_HEIGHT - dataArr[0] / largestElement * GRAPH_HEIGHT) + GRAPH_TOP;
    ctxU.moveTo(pointX, pointY);
    //print bold for day 1 condition
    if(incDay == 0) {
        PrintXAxisValue(pointX, 1, true);
    } else {
        PrintXAxisValue(pointX, 1, false);
    }
    DrawDataDiamond(pointX, pointY, 4, 'blue', dataArr[0], ctxU);

    //if beyond day 1 (0), and into day 2 (1) handle more days
    if(incDay >= 1) { 
        //Loop over each other datapoint
        for(var i = 0; i < max; i++ ){
            pointX = (GRAPH_RIGHT-40) / (arrayLen+1) * (i+1) + GRAPH_LEFT; //-40 here scales down the axis to fit
            pointY = (GRAPH_HEIGHT - dataArr[i+1] / largestElement * GRAPH_HEIGHT) + GRAPH_TOP;
            ctxU.lineTo(pointX, pointY);
            //Draw the graph  
            ctxU.stroke();
            //draw day number dynamically (bold or normal)
            if(i+1 == incDay) {
                PrintXAxisValue(pointX, i+2, true);
            } else {
                console.log("data array length: " + dataArr.length + " val: " + (i+2));
                if(highlightFinal && i+2 == dataArr.length) {
                    PrintXAxisValue(pointX, i+2, true);
                } else {
                    PrintXAxisValue(pointX, i+2, false);
                }
            }
            DrawDataDiamond(pointX, pointY, 4, 'blue', dataArr[i+1], ctxU);
            //console.log("checking value: " + i);
        }

    }
}

//Plots the data from dataArrOp
//Compressed (black line) data
function DrawDataPlot_OPTIMIZED(max) {
    ctxU.beginPath();
    ctxU.lineJoin = "round";
    ctxU.setLineDash([]);
    ctxU.strokeStyle = "black";

    //Add first point in the graph
    var pointX = GRAPH_LEFT;
    var pointY = (GRAPH_HEIGHT - dataArrOp[0] / largestElement * GRAPH_HEIGHT) + GRAPH_TOP;
    ctxU.moveTo(pointX, pointY);
    //print bold for day 1 condition
    DrawDataDiamond(pointX, pointY, 4, 'black', dataArrOp[0], ctxU);
    
    //if beyond day 1 (0), and into day 2 (1) handle more days
    if(incDay >= 1) { 
        //Loop over each other datapoint
        for(var i = 0; i < max; i++ ){
            pointX = (GRAPH_RIGHT-40) / (arrayLen+1) * (i+1) + GRAPH_LEFT; //-40 here scales down the axis to fit
            pointY = (GRAPH_HEIGHT - dataArrOp[i+1] / largestElement * GRAPH_HEIGHT) + GRAPH_TOP;
            ctxU.lineTo(pointX, pointY);
            //Draw the graph  
            ctxU.stroke();
            
            DrawDataDiamond(pointX, pointY, 4, 'black', dataArrOp[i+1], ctxU);
            //console.log("checking value: " + i);
        }
    }
}

//Used during setup, finds the largest element in the array
//This sets the maximum Y value the graph will render
function FindLargestElement() {
    var pos = 0;
    for( var i = 0; i < arrayLen; i++ ){  
        if( dataArr[ i ] > largestElement ){  
            largestElement = dataArr[ i ];
            pos = i;
        }  
    }

    //TODO if largest point below 13, set 13kb as the upper limit of the graph
    //TODO if largest point is above maximum, trim

    console.log("Largest data-point in array is " + largestElement + "kb, on day " + (pos+1) + " - scaling accordingly.");
}