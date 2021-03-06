var http = require('http');
var io = require('socket.io');

var app = http.createServer(function (req, res){
     var html = '<html>'+
				'<head>'+
				     '<title> cmpt 431 test tool</title>'+
                         '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+		
					'<h2 align=center>Welcome to Network Distributed System Test Page</h2>'+
                         '<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>'+
                         '<script src="http://members.shaw.ca/alextcwu/highcharts/js/highcharts.js" type="text/javascript"></script>'+
                         '<script src="/socket.io/socket.io.js"></script>'+
				'</head>'+

				'<body>'+
                         '<script type="text/javascript">'+
                              'var floodIsOn = false;\n'+
                    		"var socket=io.connect('http://localhost:8001');\n"+

                              //"var socket=io.connect('192.168.0.18:8001');"+
                    		"socket.on('update', function(data){\n"+
                                   "floodIsOn = true;\n"+
                                  "status_update(data.newstatus); });\n"+

                              "socket.on('floodIsDone', function(data){\n"+
                              "floodIsOn = false;\n"+
                              "status_update(data.newstatus); \n"+
                              "});\n"+
                                   
                              'function status_update(txt){document.getElementById("status").innerHTML = txt;}\n'+

                     		'function send1(){'+
                                        'var data=[];\n'+
                                        'data[0]=document.getElementById("field1").value;\n'+
                                        'data[1]=document.getElementById("field2").value;\n'+

                                   'if( ((parseFloat(data[0]) == parseInt(data[0])) && !isNaN(data[0])) && ((parseFloat(data[1]) == parseInt(data[1])) && !isNaN(data[1])) ){\n'+
                                        'if (!floodIsOn){\n'+

                                        'socket.emit("linear", data);\n'+
                                        '}\n'+
                                        '} else {alert("Please enter both numbers, integer only")}\n'+
                    		'}'+

                    		'function send2(){'+
                                   'var data=[];\n'+
                                        'data[0]=document.getElementById("field1").value;\n'+
                                        'data[1]=document.getElementById("field2").value;\n'+

                                   'if( ((parseFloat(data[0]) == parseInt(data[0])) && !isNaN(data[0])) && ((parseFloat(data[1]) == parseInt(data[1])) && !isNaN(data[1])) ){\n'+
                                        'if (!floodIsOn){\n'+

                                        'socket.emit("log", data);\n'+
                                        '}\n'+
                                        '} else {alert("Please enter both numbers, integer only")}\n'+
                    		'}'+

                              '$(document).ready(function() {\n'+
                                   
                                   'var chart = new Highcharts.Chart({\n'+
                                        'chart: {\n'+
                                            // "dateFormat('%Y-%m-%d %H:%M:%S', this.x),"+
                                             "renderTo: 'container',\n"+
                                             "zoomType: 'xy',\n"+
                                             "events: {\n"+
                                                  "load: function(){\n"+
                                                       "var series0=this.series[0];\n"+
                                                       "var series1=this.series[1];\n"+
                                                       "var series2=this.series[2];\n"+

                                                       "socket.on('all', function(data){\n"+
                                                                      "series0.addPoint([data[3],data[2]],false, false);\n"+
                                                                      "series1.addPoint([data[3],data[1]],false, false);\n"+
                                                                      "series2.addPoint([data[3],data[0]],true, false);\n"+
                                                       "});\n"+ 
                                                  "}\n"+
                                             "}\n"+
                                        '},\n'+
                                             'title: {\n'+
                                                  "text: 'Performance Test'\n"+
                                             '},\n'+

                                             'xAxis: [{\n'+
                                                  "categories: [],\n"+
                                                  
                                                  'title: {\n'+
                                                       "text: 'Seconds after the test starts'\n"+
                                                  ' }\n'+
                                        '}],\n'+

                                             'yAxis: [{ \n'+                                     // Primary yAxis
                                                  'labels: {\n'+
                                                       'formatter: function() {\n'+
                                                            "return this.value +' Requests/second';\n"+
                                                       '},\n'+
                                                       'style: {\n'+
                                                            "color: '#89A54E'\n"+
                                                       '}\n'+
                                                  '},\n'+
                                                  'title: {\n'+
                                                       "text: 'Request/Second',\n"+
                                                       'style: {\n'+
                                                            "color: '#89A54E'\n"+
                                                       '}\n'+
                                                  '},\n'+
                                                  'opposite: true\n'+
                                        '}, {\n'+                                          // Secondary yAxis
                                                  'title: {\n'+
                                                       "text: 'Average Latency',\n"+
                                                       'style: {\n'+
                                                            "color: '#4572A7'\n"+
                                                       '}\n'+
                                                  '},\n'+
                                                  'labels: {\n'+
                                                       'formatter: function() {\n'+
                                                            "return this.value +' nanosecond';\n"+
                                                       '},\n'+
                                                       'style: {\n'+
                                                            "color: '#4572A7'\n"+
                                                       '}\n'+
                                                  '}\n'+
                                        '}, { \n'+                                           // Tertiary yAxis
                                                  'title: {\n'+
                                                       "text: 'Total Requests',\n"+
                                                       'style: {\n'+
                                                            "color: '#AA4643'\n"+
                                                       '}\n'+
                                                  '},\n'+
                                                  'labels: {\n'+
                                                       'formatter: function() {\n'+
                                                            "return this.value +' requests';\n"+
                                                       '},\n'+
                                                       'style: {\n'+
                                                            "color: '#AA4643'\n"+
                                                       '}\n'+
                                                  '},\n'+
                                                  'opposite: true\n'+
                                        '}],\n'+
                                             'series: [{\n'+
                                                  "name: 'Average Latency',\n"+
                                                  "color: '#4572A7',\n"+
                                                  "type: 'spline',\n"+
                                                  'yAxis: 1,\n'+
                                                  "data: []\n"+
                                             '}, {\n'+
                                                  "name: 'Total Requests',\n"+
                                                  "type: 'column',\n"+
                                                  "color: '#AA4643',\n"+
                                                  'yAxis: 2,\n'+
                                                  "data: []\n"+
                                             '}, {\n'+
                                                  "name: 'Requests/Second',\n"+
                                                  "color: '#89A54E',\n"+
                                                  "type: 'column',\n"+
                                                  "data: []\n"+

                                             '}]\n'+
                                   '});\n'+
                              '});\n'+
                                  
                    	'</script>'+

                         '<div align=center><p id="status">Waiting for testing...</p></div>'+

                         '<div id="container" style="min-width: 400px; height: 400px; margin: 0 auto"></div>'+

                         '<p align=center>'+
                         'numberofrequest: <input type="text" id="field1" ></input>'+
                         'Intervaltime: <input type="text" id="field2" value= ></input>'+
                         '</p>'+

                         '<br/>'+
                         '<p align=center>'+
                              '<button onclick="send1()" id="send1">Low Load</button>'+
					     '<button onclick="send2()" id="send2">High Load</button>'+
                         '</p>'+
				'</body>'+
			 '</html>';

  		res.write(html);
  		res.end();   	
    }).listen(8000);

	
var sk = io.listen(app);