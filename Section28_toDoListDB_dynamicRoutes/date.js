
module.exports.getDateString = function(){
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  const currentDay = new Date();
  return currentDay.toLocaleString(undefined,options);
}
