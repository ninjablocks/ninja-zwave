

#include "NBZWInterpreter.h"

#include <stdlib.h>
#include <stdio.h>

#include <nbsocket.h>

#include <string>
#include <iostream>
#include <map>
#include <sstream>

#include "ValueID.h"
#include "Manager.h"


using namespace NinjaBlocks;
using namespace std;

const char *kLabelPower = "Power";

//driver callbacks
void isListening() {
	//printf("zwave exec: is listening called back\n");
}

void didReceiveVariable(char *name, char *value) {
	//printf("zwave exec: received %s : %s\n", name, value);
}

NBZWInterpreter::NBZWInterpreter() {
}

void NBZWInterpreter::connectWithModule() {
	// Connect to Ninja Block module
	nb_listen(&isListening, &didReceiveVariable);
}

bool NBZWInterpreter::isRecognised(OpenZWave::ValueID &v) {
	bool result = false;
	if ((v.GetGenre() == OpenZWave::ValueID::ValueGenre_User)
		&& (v.GetType() == OpenZWave::ValueID::ValueType_Decimal)
	) {
		string label = OpenZWave::Manager::Get()->GetValueLabel(v);
		if (label == kLabelPower) {
			result = true;
		}
	}
	return result;
}

void NBZWInterpreter::valueChanged(string &uniqueIdentifier, OpenZWave::ValueID &v) {
	if (isRecognised(v)) {
		string label = OpenZWave::Manager::Get()->GetValueLabel(v);
		//string units(OpenZWave::Manager::Get()->GetValueUnits(v));
		string reading;
		OpenZWave::Manager::Get()->GetValueAsString(v, &reading);
		string previousReading = valueMap[uniqueIdentifier];
		float fCurrent = atof(reading.c_str());
		float fPrevious = atof(previousReading.c_str());
		if (previousReading.length() == 0) {
			fPrevious = -1;
		}
		float deltaMag = fCurrent-fPrevious;
		if (deltaMag<0) { deltaMag = -deltaMag; }
		float fCurrentMag = ((fCurrent >= 0) ? fCurrent : -fCurrent);
		//report on significant change from previous
		if ((deltaMag > 1) || (deltaMag*10 > fCurrentMag)) { // difference > 1W or 10%
			valueMap[uniqueIdentifier] = reading; // store new reading
			string value = "\"" + label + "|" + reading + "\"";
			//TODO: add to lib to send with VID, DID, G, DA
			nb_send(uniqueIdentifier.c_str(), value.c_str()); // send to module
		}
	}
}

