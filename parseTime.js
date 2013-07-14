/* * * * * * * * * *
 *  parseTime .js  *
 *  Version 0.1.7  *
 *  License:  MIT  *
 * Simon  Waldherr *
 * * * * * * * * * */

/*jslint browser: true, indent: 2 */
/*exported parseTime */

var parseTime = function (string, now) {
  "use strict";
  var re,
    lang,
    encoded,
    timedif,
    integer,
    unit,
    word,
    words,
    parsed,
    hhmmss,
    date = {},
    regex = {},
    adWordsToRegex = function (fillfoo, first) {
      var returnval = '', i;
      for (i in words[lang][fillfoo]) {
        if (words[lang][fillfoo][i] !== undefined) {
          if (first === false) {
            returnval += '|';
          } else {
            first = false;
          }
          returnval += i;
        }
      }
      return returnval;
    };

  now = parseInt(now, 10);
  if (string === 'now' || string === 'jetzt') {
    return {
      'absolute': Date.now(),
      'relative': 0,
      'mode': 'now'
    };
  }
  parsed = Date.parse(string);
  if (!isNaN(parsed)) {
    return {
      'absolute': parsed,
      'relative': (parsed - now),
      'mode': 'absolute'
    };
  }
  regex = {};
  words = {
    de: {
      numbers: {
        'null' : 0,
        'ein' : 1,
        'zwei' : 2,
        'drei' : 3,
        'ein paar' : 3.5,
        'vier' : 4,
        'fünf' : 5,
        'sechs' : 6,
        'sieben' : 7,
        'acht' : 8,
        'neun' : 9,
        'zehn' : 10,
        'elf' : 11,
        'zwölf' : 12,
        'dreizehn' : 13,
        'vierzehn' : 14,
        'fünfzehn' : 15,
        'sechzehn' : 16,
        'siebzehn' : 17,
        'achzehn' : 18,
        'neinzehn' : 19,
        'zwanzig' : 20,
        'dreißig' : 30,
        'vierzig' : 40,
        'fünfzig' : 50,
        'sechzig' : 60,
        'siebzig' : 70,
        'achtzig' : 80,
        'neunzig' : 90,
        'hundert' : 100,
        'tausend' : 1000,
        'million' : 1000000
      },
      countable: {
        'vorgestern' : -172800000,
        'gestern' : -86400000,
        'heute' : 1,
        'übermorgen' : 172800000,
        'morgen' : 86400000
      },
      unit: {
        'millisekunde' : 1,
        'sekunde' : 1000,
        'minute' : 60000,
        'stunde' : 3600000,
        'tag' : 8640000,
        'woche' : 604800000,
        'monat' : 2592000000,
        'quartal' : 7776000000,
        'jahr' : 31536000000,
        'dekade' : 315360000000
      },
      fillwords: {
        'vor' : '-',
        'in' : '+'
      },
      fillfoo: {
        '\\-' : '',
        '\\ ' : '',
        'e' : '',
        'en' : '',
        'er' : '',
        'n' : ''
      }
    },
    en: {
      numbers: {
        'zero' : 0,
        'one' : 1,
        'two' : 2,
        'three' : 3,
        'a few' : 3.5,
        'four' : 4,
        'five' : 5,
        'six' : 6,
        'seven' : 7,
        'eight' : 8,
        'nine' : 9,
        'ten' : 10,
        'eleven' : 11,
        'twelve' : 12,
        'thirteen' : 13,
        'fourteen' : 14,
        'fifteen' : 15,
        'sixteen' : 16,
        'seventeen' : 17,
        'eighteen' : 18,
        'nineteen' : 19,
        'twenty' : 20,
        'thirty' : 30,
        'forty' : 40,
        'fifty' : 50,
        'sixty' : 60,
        'seventy' : 70,
        'eighty' : 80,
        'ninety' : 90,
        'hundred' : 100,
        'thousend' : 1000,
        'million' : 1000000
      },
      unit: {
        'millisecond' : 1,
        'second' : 1000,
        'minute' : 60000,
        'hour' : 3600000,
        'day' : 86400000,
        'week' : 604800000,
        'month' : 2592000000,
        'quarter' : 7776000000,
        'year' : 31536000000,
        'decade' : 315360000000
      },
      countable: {
        'before yesterday' : -172800000,
        'yesterday' : -86400000,
        'today' : 1,
        'day after tomorrow' : 172800000,
        'tomorrow' : 86400000
      },
      fillwords: {
        'ago' : '-',
        'in' : '+'
      },
      fillfoo: {
        's' : '',
        '\\-' : '',
        '\\ ' : '',
        '\\.' : ''
      }
    }
  };
  hhmmss = /((\d\d)\.(\d\d)\.(\d\d\d\d) (\d\d):(\d\d):(\d\d))/.exec(string);
  if (hhmmss !== null) {
    date.day = parseInt(hhmmss[2], 10);
    date.month = parseInt(hhmmss[3], 10);
    date.year = parseInt(hhmmss[4], 10);
    date.hour = parseInt(hhmmss[5], 10);
    date.minute = parseInt(hhmmss[6], 10);
    date.second = parseInt(hhmmss[7], 10);
  } else {
    hhmmss = /((\S+\s){0,4}(\d{1,2})((:(\d{1,2})(:(\d{1,2})(\.(\d{1,4}))?)?)|( Uhr| o\'clock)))/.exec(string);
    if (hhmmss !== null) {
      date.countable = hhmmss[0].toLowerCase();
      date.hour = parseInt(hhmmss[3], 10);
      date.minute = hhmmss[6] !== undefined ? parseInt(hhmmss[6], 10) : 0;
      date.second = hhmmss[8] !== undefined ? parseInt(hhmmss[8], 10) : 0;
    } else {
      hhmmss = /((\d\d)[\.:,\/](\d\d)[\.:,\/](\d\d\d\d))/.exec(string);
      if (hhmmss !== null) {
        date.day = parseInt(hhmmss[2], 10);
        date.month = parseInt(hhmmss[3], 10);
        date.year = parseInt(hhmmss[4], 10);
      }
    }
  }
  if (date.hour !== undefined) {
    for (lang in words) {
      if (words[lang] !== undefined) {
        for (word in words[lang].countable) {
          if (words[lang].countable[word] !== undefined) {
            if (date.countable !== undefined) {
              if (date.countable.indexOf(word) !== -1 && date.countableint === undefined) {
                date.countableint = words[lang].countable[word];
              }
            }
          }
        }
      }
    }
  }
  if (date.countableint !== undefined) {
    date.now = new Date(Date.now() + date.countableint).toString();
  } else {
    date.now = new Date().toString();
  }
  date.today = /(([A-Za-z0-9, ]+) \d\d:\d\d:\d\d ([A-Z]+))/.exec(date.now);
  date.timezone = date.today[3];
  if (date.year === undefined) {
    date.today = date.today[2];
  } else {
    date.today = date.year + '-' + date.month + '-' + date.day;
  }
  if (date.hour !== undefined) {
    date.parsed = new Date(date.today + ' ' + date.hour + ':' + date.minute + ':' + date.second + ' ' + date.timezone);
  } else if (date.day !== undefined) {
    date.parsed = new Date(date.today + ' 12:00:00 ' + date.timezone);
  }

  if (date.parsed !== undefined) {
    if (!isNaN(date.parsed.getTime())) {
      return {
        'absolute': date.parsed.getTime(),
        'relative': date.parsed.getTime() - now,
        'mode': 'absolute'
      };
    }
  }

  string = ' ' + string + ' ';
  for (lang in words) {
    if (words[lang] !== undefined) {
      regex[lang] = '((';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')+(';
      regex[lang] += adWordsToRegex('fillwords', true);
      regex[lang] += ')*(';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')*(\\d+';
      regex[lang] += adWordsToRegex('numbers', false);
      regex[lang] += ')+(';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')*((';
      regex[lang] += adWordsToRegex('unit', true);
      regex[lang] += ')(';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')*';
      regex[lang] += adWordsToRegex('fillfoo', false);
      regex[lang] += ')*(';
      regex[lang] += adWordsToRegex('fillwords', true);
      regex[lang] += ')*(';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')+)';
    }
  }
  // [0]  : unimportant
  // [1]  : unimportant
  // [2]  : unimportant
  // [3]  : fillwords (mostly future)
  // [4]  : unimportant
  // [5]  : numbers (string or int)
  // [6]  : unimportant
  // [7]  : unit (multiple)
  // [8]  : unit
  // [9]  : fillwords (mostly past)
  // [10] : unimportant

  for (lang in regex) {
    // if regex is builded
    if (regex[lang] !== undefined) {
      re = new RegExp(regex[lang], "i");
      encoded = re.exec(string);
      timedif = 0;
      // if regex matches
      if (encoded !== null) {
        // if unit matches
        if (encoded[8] !== undefined) {
          integer = (isNaN(parseInt(encoded[5], 10))) ? words[lang].numbers[encoded[5]] : parseInt(encoded[5], 10);
          unit = words[lang].unit[encoded[8].toLowerCase()];
          timedif = integer * unit;
          // if fillwords can be found in match-array
          if (encoded.indexOf(Object.keys(words[lang].fillwords)[0]) !== -1) {
            parsed = -timedif;
            return {
              'absolute': (now - timedif),
              'relative': parsed,
              'mode': 'relative'
            };
          }
          return {
            'absolute': (now + timedif),
            'relative': timedif,
            'mode': 'relative'
          };
        }
      }
    }
  }
  return {
    'absolute': false,
    'relative': false,
    'mode': 'error'
  };
};
