$(function () {
  const workHours = [9,10,11,12,13,14,15,16,17]
  var today = dayjs()
  const currentHour = today.format('H')
  const mainContainer = $('.container-lg')
  var eventEl, hourEl, textEl, saveEl
  var bgcolor
  
  //parse local storage if it exists
  var plannerCache = JSON.parse(localStorage.getItem("plannerCache"))
  if (!plannerCache){plannerCache = {}}

  //display today date in the header, using set interval to update seconds
  timerInterval = setInterval(function() {
      $('#currentDay').text(dayjs().format('dddd, MMMM D, YYYY h:mm:ss A'))
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
  if (plannerCache){
    $.each(plannerCache, function(key, value){
      $('#textarea-'+key).text(value)
    })
  }

  //eventlisnter for save button value is stored/removed from the cache
  $('.fa-save').click(function(){
    //get number part of id=button-# 
    let eventid = $(this).attr("id").split('-')[1]
    //remove entry if left blank other wise add it to the plannerCache
    $('#textarea-'+eventid).val() ? plannerCache[eventid] = $('#textarea-'+eventid).val().trim() : delete plannerCache[eventid]
    localStorage.setItem("plannerCache", JSON.stringify(plannerCache))
  })
});