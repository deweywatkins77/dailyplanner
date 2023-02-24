$(function () {
  var eventEntry = {}
  const workHours = [9,10,11,12,13,14,15,16,17]
  var today = dayjs()
  const currentHour = today.format('H')
  const mainContainer = $('.container-lg')
  var eventEl, hourEl, textEl, saveEl
  var bgcolor
  
  //parse local storage if it exists
  var plannerCollection = JSON.parse(localStorage.getItem("plannerCache"))
  if (!plannerCollection){plannerCollection = {}}

  //event listner for changing the day
  $('.changeDay').click(function(){
    let changeValue = $(this).data('changevalue')
    if (changeValue == '1'){
      today = today.add(1, 'day')
    }else{
      today = today.subtract(1, 'day')
    }
    loadDailyEvents()
  })

  //display today date in the header, using set interval to update seconds
  timerInterval = setInterval(function() {
    //only display time of day if current day is today
    if (today.format('MDYYYY') == dayjs().format('MDYYYY')){
      $('#currentDay').text(dayjs().format('dddd, MMMM D, YYYY h:mm:ss A'))
    }else{
      $('#currentDay').text(today.format('dddd, MMMM D, YYYY'))
    }
  }, 100);

  //build planner time entries
  $.each(workHours, function(index,value){
    hourValue = dayjs().hour(value).format('hA')
    if ( value < currentHour){
      bgcolor = "past"
    }else if ( value > currentHour){
      bgcolor = "future"
    }else{
      bgcolor = "present"
    }
    eventEl = $('<div></div>')      
    eventEl.attr({id:"hour-"+value, class:"row time-block "+bgcolor})
    hourEl = `<div class="col-2 col-md-1 hour text-center py-3 id=timeEntry-`+value+`">`+hourValue+`</div>`
    textEl = `<textarea class="col-8 col-md-10 description" rows="3" id="textarea-`+value+`"></textarea>`
    saveEl = `<button class="btn saveBtn col-2 col-md-1" dataset=aria-label="save">
                <i class="fas fa-save" aria-hidden="true" id="button-`+value+`"></i>
              </button>`
    eventEl.append(hourEl)
    eventEl.append(textEl)
    eventEl.append(saveEl)
    mainContainer.append(eventEl)
  })

  //clear entries from display and populate entries from local storage
  function loadDailyEvents(){
    $.each(workHours, function(index,value){
      $('#textarea-'+value).val('')
    })
    if (typeof plannerCollection[today.format('MMDDYYYY')]!='undefined'){
      $.each(plannerCollection[today.format('MMDDYYYY')], function(key, value){
        //set event entries for currentdate
        eventEntry = {[key] : value}
        $('#textarea-'+key).val(value)
      })
    }else{
      // clear eventEntry if there are no entries for this date
      eventEntry = {}
    }
  }

  //eventlistener for save button value is stored/removed from the cache
  $('.fa-save').click(function(){
    var eventid = $(this).attr("id").split('-')[1]
    var eventValue = $('#textarea-'+eventid).val().trim()
    console.log(today.format('MMDDYYYY'))
    var plannerEntry = today.format('MMDDYYYY')

    //remove entry from eventEntry if value is blank otherwise add it to eventEntry
    eventValue ? eventEntry[eventid] = eventValue : delete eventEntry[eventid]
    plannerCollection[plannerEntry] = eventEntry
    //check to see if all event entries were cleared, and if they were remove date entry from plannerCollection
    if(Object.keys(plannerCollection[plannerEntry]).length==0){delete plannerCollection[plannerEntry]} 
    localStorage.setItem('plannerCache', JSON.stringify(plannerCollection))
  })
  loadDailyEvents()
});