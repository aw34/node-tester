var http = require('http');
var hrtime = require('hrtime');
var fs =require('fs');
var userinput = process.argv.slice(2);
var numberoftest;
var stop;
var globalStartTime;
var counter =0;
var reqinc;
var intinc;

var resultarray= [];
var io = require('socket.io').listen(8001);

http.globalAgent.maxSockets=10000;

var server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('TEST PAGE');
  res.end();
}).listen(8080);

//pre-entered host options
var options1 = {
           host: 'localhost',
           port: 8080,
method: 'GET'
};

var options2 = {
           host: 'www.google.com',
           port: 80,
method: 'GET'
};

var options3 = {
           host: 'www.6park.com',
           port: 80,
method: 'GET'
};
//testing LAN proxy
var options4 = {
           host: '142.58.63.37',
           port: 8888,
method: 'GET',
path:'/fab'
};

function init(){
numberoftest = 0;
stop = 10;
if (counter<=0){globalStartTime = hrtime.time();};
}

function setup(){
testresult = {
numberofrequest:userinput[0]*1,
intervaltime:userinput[1]*1,
latarray:[],
badrequest:0,
total:0,
mean:0,
sd:0,
testStartTime: hrtime.time(),
reqPerSecond:0,
testEndTime:0,
};
resultarray.push(testresult);

};

function test(n,t){
//setup();
var counter = 0;
var interval = function(){
if(counter < n){
temp(counter, testresult.latarray);
counter++
} else {
clearInterval(interval);
};
};

setInterval(interval, t);
};

function testnowait(n){

var counter = 0;
while (counter < n){
temp(counter, latarray);
counter++;
};
};

function temp(k, array){
//'optionsX' for host option
var starttime ;

var req = http.request(options1, function(res) {

var receivetime = hrtime.time();
var latency = receivetime - req.starttime;
array.push(latency);
//console.log('Request #',k,': sending http request to',options1.host,'at time =',req.starttime/1000000000,'seconds');

res.on("end", function() {
if (array.length==testresult.numberofrequest-testresult.badrequest){
endoftest(array);

};
})


});
req.on('error', function(e) {
console.log('Request #',k,': ERROR',e.message);

if (array.length==testresult.numberofrequest-testresult.badrequest){
endoftest(array);
//req.emit('finish',endoftest(array));
};
});
req.write('data\n');
req.on("drain", function() {
req.starttime = hrtime.time();
})
req.end();
};

function endoftest(array){
numberoftest++;
var testTook = hrtime.time() - testresult.testStartTime;
testresult.testEndTime = hrtime.time() - globalStartTime;
testresult.reqPerSecond = array.length / (testTook/1000000000);
console.log('END OF LATENCY TEST RUN '+numberoftest);
console.log('Test Run Ends at',testresult.testEndTime/1000000000,'seconds after start');
console.log('Number of request =',testresult.numberofrequest);
console.log('waitInterval =',testresult.intervaltime);
console.log('Req Per Second =',testresult.reqPerSecond);
testresult.total = calTotal(array);
testresult.mean = calMean(testresult.total,array.length);
//testresult.sd = calSD(array,testresult.mean);

console.log('Total Latency =',Math.round(testresult.total/1000000)/1000,'seconds');
console.log('Mean =',Math.round(testresult.mean/1000)/1000,'milliseconds');
//console.log('Standard Deviation =',Math.round(testresult.sd/1000)/1000,'milliseconds');
console.log('Number of bad request =',testresult.badrequest);
output2();

//testing start time

//var temp=0;
//startarray.sort();
//console.log(startarray);
//for (var i=0; i<startarray.length-1; i++){
//console.log(startarray[i]);
//console.log(startarray[i+1]);

// temp = temp+ ( startarray[i+1]*1-startarray[i]*1);
//console.log(temp);
//console.log(startarray[i]/1000000000);
// console.log(temp);
//};
//console.log(numberofrequest,' ',startarray.length);
//console.log(temp);
//console.log(numberofrequest);

};

function output1(){
var stream = fs.createWriteStream('output.txt', {'flags':'a'});
//var options = {
//numberofrequest: numberofrequest [
// testresult:{
// numberofrequest: numberofrequest,
// total:total,
// mean: mean,
// sd: sd,
// badrequest: badrequest
// }
//};
//var data = JSON.stringify(options, null,2);
console.log('SUMMARY SAVED TO OUTPUT.TXT');
stream.write('{\n');
//stream.write('"testresult": {\n');
stream.write(' "numberofrequest": '+testresult.numberofrequest+',\n');
stream.write(' "reqPerSecond": '+testresult.reqPerSecond+',\n');
stream.write(' "totallatency": '+testresult.total+',\n');
stream.write(' "mean": ' +testresult.mean+',\n');
stream.write(' "sd": '+testresult.sd+',\n');
stream.write(' "badrequest": '+testresult.badrequest+'\n');
stream.write('},\n');
//stream.write(data);
stream.end();

};

function output2(){

var data=[];
  data[0]=testresult.reqPerSecond;
  data[1]=testresult.numberofrequest;
  data[2]=testresult.mean;
  data[3]=Math.round(testresult.testEndTime/1000000)/1000;
  io.sockets.emit("all", data);
 
run();
};

function calTotal(array){
//console.log('running caltotal function');
var temp=0;
for (var i=0; i<array.length; i++){
//console.log('i=',i,'=' ,array[i]);
temp = temp + array[i];
//console.log('running sum :',temp);
};
return temp;
};

function calMean(sum,number){
//console.log('running calMean');
var temp=0;
temp = sum/number;
return temp;
};

function calMeanArray (array){
//console.log('input length:::::',array.length);
var temp=0;
for (var i=0; i<array.length; i++){
temp = temp + array[i];
};
temp = temp/array.length;
return temp;
};

function calSD (array, m){
//console.log('running calSD');
var temp=0;
for (var i=0; i<array.length; i++){
temp = temp + Math.pow(array[i]-m,2);
}
temp = temp/array.length;
temp = Math.sqrt(temp);
return temp;
};



function run(){
if (numberoftest < stop){//run another test
setup();

testresult.numberofrequest = testresult.numberofrequest*1+(numberoftest*recinc);
testresult.intervaltime = testresult.intervaltime*1-Math.round((numberoftest*intinc));

if (testresult.intervaltime<1){testresult.intervaltime=1};

test(resultarray[resultarray.length-1].numberofrequest,resultarray[resultarray.length-1].intervaltime);
} else { //finish

console.log('END OF FLOOD');
counter++;
io.sockets.emit("floodIsDone", {newstatus:"Test is finished"});

//setTimeout(function(){process.exit();},2500);


};
};

io.sockets.on('connection', function (socket) {
            socket.on('message', function(message){
               
                  if (message == "linear")
                  {  
                      socket.emit("update", {newstatus:"Low load testing..."});
                      recinc=userinput[0];
                      intinc=userinput[1]/10;
                      init();
                      run();                     
                     //console.log("fabonacci(15) = "+n+"--from client");
                     
                  }else if (message == "log")
                  {
                      socket.emit("update", {newstatus:"High load testing..."});
                      recinc=userinput[0]*1.5;
                      intinc=userinput[1]/8;
                      init();
                      run(); 
                  }
               });
            });

