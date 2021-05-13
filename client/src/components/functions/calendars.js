export const daysInMonth = (month, year) => {
   switch (month) {
      case 0:
         return 31;
      case 1:
         if (year % 4 == 0) {
            return 29;
         } else {
            return 28;
         }
      case 2:
         return 31;
      case 3:
         return 30;
      case 4:
         return 31;
      case 5:
         return 30;
      case 6:
         return 31;
      case 7:
         return 31;
      case 8:
         return 30;
      case 9:
         return 31;
      case 10:
         return 30;
      case 11:
         return 31;
   }
};

export const createCalendar = (month, year) => {
   const Start = new Date(months[month] + ' ' + year);
   const StartParts = Start.toString().split(' ');
   var date = [...Array(daysInMonth(month, year)).keys()];
   switch (StartParts[0].toLowerCase()) {
      case 'mon':
         break;
      case 'tue':
         date.unshift(-1);
         break;
      case 'wed':
         date.unshift(-1, -1);
         break;
      case 'thu':
         date.unshift(-1, -1, -1);
         break;
      case 'fri':
         date.unshift(-1, -1, -1, -1);
         break;
      case 'sat':
         date.unshift(-1, -1, -1, -1, -1);
         break;
      case 'sun':
         date.unshift(-1, -1, -1, -1, -1, -1);
         break;
   }
   const dateLen = date.length % 7;
   const arrLen = 7 - dateLen == 7 ? 0 : 7 - dateLen;
   true &&
      [...Array(arrLen).keys()].map((i) => {
         console.log(i);
         date.push(-1);
      });
   return date;
};
export const months = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December',
];

export const highlightDate = (item, state) => {
      if (
         item + 1 == new Date().toString().split(' ')[2] &&
         state.month == new Date().getMonth() &&
         state.year == new Date().getFullYear()
      ) {
         return 'date highlight';
      } else {
         return 'date';
      }
   };