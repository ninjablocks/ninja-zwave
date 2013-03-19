#ifndef _NinjaBlocks_H
#define _NinjaBlocks_H

#include <string>
#include <map>

//forward declarations for OpenZWave classes
namespace OpenZWave {
	class ValueID;
}

namespace NinjaBlocks {

	class OpenZWave::ValueID;

	class NBZWInterpreter {
	public:
		NBZWInterpreter();
		
		void connectWithModule();

		static bool isRecognised(OpenZWave::ValueID &v);
		void valueChanged(std::string &uniqueIdentifier, OpenZWave::ValueID &v);
	private:
		std::map<std::string, std::string> valueMap;
	};
}

#endif

