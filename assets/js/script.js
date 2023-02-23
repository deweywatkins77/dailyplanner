$(function () {
  var plannerCache = {}
  const workHours = [9,10,11,12,13,14,15,16,17]
  var today = dayjs()
  const currentHour = today.format('H')
  const mainContainer = $('.container-lg')
  var eventEl, hourEl, textEl, saveEl
  var bgcolor
  
  //parse local storage if it exists
  var plannerCache = JSON.parse(localStorage.getItem("plannerCache"))
  if (!plannerCache){plannerCache = {}}


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
  }, 1000);

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

  //populate existing entries from local storage
  function loadDailyEvents(){
    if (plannerCache){
      $.each(plannerCache, function(key, value){
        $('#textarea-'+key).text(value)
      })
    }
  }

  //eventlisnter for save button value is stored/removed from the cache
  $('.fa-save').click(function(){
    //get number part of id=button-# 
    let eventid = $(this).attr("id").split('-')[1]
    //remove entry if left blank other wise add it to the plannerCache
    console.log($('#textarea-'+eventid).val())
    $('#textarea-'+eventid).val() ? plannerCache[eventid] = $('#textarea-'+eventid).val().trim() : delete plannerCache[eventid]
    localStorage.setItem("test", "blahblah")
    console.log(JSON.stringify(plannerCache))
  })
});