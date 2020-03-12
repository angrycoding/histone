var Utils = require('./Utils'),
	Constants = require('./Constants'),
	languages = Constants.LANGUAGES,
	language = Constants.LANGUAGE;

function i18n(stringId, stringIndex, stringForm) {
	if (Constants.LANGUAGE) {
		var result = languages[language];
		if (result && result.hasOwnProperty(stringId)) {
			result = result[stringId];
			if (Utils.$isString(result)) return result;
			if (Utils.$isArray(result) && Utils.$isInteger(stringIndex) &&
				stringIndex >= 0 && stringIndex < result.length) {
				result = result[stringIndex];
				if (Utils.$isString(result)) return result;
				if (Utils.$isArray(result)) {
					if (!Utils.$isInteger(stringForm) && stringForm < 0) stringForm = 0;
					if (stringForm >= result.length) stringForm = result.length - 1;
					return result[stringForm];
				}
			}
			return result;
		}
	}
}

i18n.$setLanguage = function(lang) {
	if (Constants.LANGUAGE) {
		if (Utils.$isString(lang) &&
			languages.hasOwnProperty(lang)) {
			language = lang;
		}
	}
};

module.exports = i18n;