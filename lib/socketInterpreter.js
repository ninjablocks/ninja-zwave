var	util = require('util')
	, spawn = require('child_process').spawn
	, net = require('net')
	, socket_template_c
	, exec_z_wave
	, fs = require('fs')
;

module.exports=SocketInterpreter;

const kPathRelativeModule = './drivers/ninja-zwave/';
const kPathRelativeExec = 'lib/open-zwave/cpp/examples/linux/NinjaZW/';
const kExec = 'ninjaZW';
const kDebugLogs = false;

function nbPrint(message) {
	if (kDebugLogs) {
		console.log(message);
	}
}

SocketInterpreter.prototype.processZWaveData = function(dataBuffer) {
	var msgs = dataBuffer.toString().split("\n");
	var device;
	var dataObject, key, values, label, reading;
	for (i=0; i<msgs.length; i++) {
		try {
			dataObject = JSON.parse(msgs[i]);
			key = (Object.keys(dataObject))[0];
			if (key != undefined) {
				values = (dataObject[key]).split("|");
				label = values[0];
				reading = values[1];
				if ((label != undefined) && (reading != undefined)) {
					this.cbDataReceived(key, label, reading);
				}
			}
		} catch (err) { ; } //ignore invalid json
	}
}

exec_z_wave = spawn('./' + kExec
	, []
	, {cwd: kPathRelativeModule+kPathRelativeExec
		, stdio: 'inherit'
	}
);

nbPrint('Current directory: ' + process.cwd());
var path_socket = './' + kPathRelativeModule + kPathRelativeExec + 'socket_nbcomms';
nbPrint('Socket path: ' + path_socket);

function SocketInterpreter(cb) {
	var self = this;
	this.cbDataReceived = cb;
	nbPrint('module: attempting connect');
	socket_template_c = net.connect(path_socket, function() {
		nbPrint('module: connected to local socket\n');
	});
	socket_template_c.on('error', function(err) {
		nbPrint('module: socket error: ' + err);
	});
	socket_template_c.on('data', this.processZWaveData.bind(this));
//	socket_template_c.write('{jsondata : 1}');
}


