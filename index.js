var Device = require('./lib/device')
  , SocketInterpreter = require('./lib/socketInterpreter')
  , util = require('util')
  , stream = require('stream')
  ;

// Give our driver a stream interface
util.inherits(myDriver,stream);

var myDriverObject;
var devices = []; // devices that the driver has been notified of

function registerNewDevice(key) {
	var device = new Device();
	device.G = key;
	devices[key] = device;
	myDriverObject.emit('register', device);
	return device;
}

function deviceForKey(key) {
	var device = undefined;
	if (key != undefined) {
		device = devices[key];
		if (device == undefined) {
			device = registerNewDevice(key); 
		}
	}
	return device;
}

function dataReceived(key, label, reading) {
	var device = deviceForKey(key);
	reading = parseFloat(reading);
	if (device != undefined) {
		device.sendData(reading);
	}
}

//setTimeout(
//	(function() {
//		socket_template_c.write('{jsondata : 2}');
//	}
//), 3000);

/**
 * Called when our client starts up
 * @constructor
 *
 * @param  {Object} opts Saved/default driver configuration
 * @param  {Object} app  The app event emitter
 * @param  {String} app.id The client serial number
 *
 * @property  {Function} save When called will save the contents of `opts`
 * @property  {Function} config Will be called when config data is received from the cloud
 *
 * @fires register - Emit this when you wish to register a device (see Device)
 * @fires config - Emit this when you wish to send config data back to the cloud
 */
function myDriver(opts,app) {

  var self = this;
  myDriverObject = this;

  app.on('client::up',function(){

    // The client is now connected to the cloud

    // Do stuff with opts, and then commit it to disk
    if (!opts.hasMutated) {
      opts.hasMutated = true;
    }

    self.save();

    // Register a device
    //self.emit('register', new Device());

	process.nextTick(function() {
		var si = new SocketInterpreter(dataReceived);	
	});

  });
};

/**
 * Called when config data is received from the cloud
 * @param  {Object} config Configuration data
 */
myDriver.prototype.config = function(config) {

};

// Export it
module.exports = myDriver;
