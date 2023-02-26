$(function () {
  var eventEntry = {}
  var today = dayjs()
  var eventEl, hourEl, textEl, saveEl, bgcolor
  const workHours = [9,10,11,12,13,14,15,16,17]
  const mainContainer = $('.container-lg')

  //parse local storage for events if they exist
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
    //when date changes reload events for current day.
    loadDailyEvents()
  })

  $('#datepicker').change(function(){
    var datePickerValue = $(this).val()
    var datePickerMonth = datePickerValue.slice(0,2)
    var datePickerDate = datePickerValue.slice(3,5)
    var datePickerYear = datePickerValue.slice(-4)
    // for some reason the set method for month is 0 indexed, so we have to subtract 1
    today = today.set('month', datePickerMonth-1).set('date', datePickerDate).set('year',datePickerYear)
    //when date changes reload events for current day.
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
  function loadPlanner(){
    //clear old data from mainContainer if exists
    mainContainer.empty()
    $.each(workHours, function(index,value){
      var hourValue = dayjs().hour(value).format('hA')
      var unixTime = dayjs().unix()
      var hourDiff = dayjs(unixTime).diff(today.hour(value).unix())
      bgcolor = "future"
      if ( hourDiff >= 3600){
        bgcolor = "past"
      }else if (hourDiff >= 0){
        bgcolor = "present"
      }
      eventEl = $('<div></div>')
      eventEl.attr({id:"hour-"+value, class:"row time-block "+bgcolor})
      hourEl = `<div class="col-2 col-md-1 hour text-center py-3 id=timeEntry-`+value+`">`+hourValue+`</div>`
      textEl = `<textarea class="col-8 col-md-10 description" rows="3" id="textarea-`+value+`"></textarea>`
      saveEl = `<button class="btn saveBtn col-2 col-md-1" dataset=aria-label="save" id="buttonarea-`+value+`">
                  <i class="fas fa-save" aria-hidden="true" id="button-`+value+`"></i>
                </button>`
      eventEl.append(hourEl, textEl, saveEl)
      mainContainer.append(eventEl)
    })
    //generate new on click event listners for date change
    saveButtonClick()
    saveTextChange()
  }

  //save button click event listner
  function saveButtonClick(){
    $('.fa-save', '.saveBtn').on('click', function(){
      var eventid = $(this).attr("id").split('-')[1]
      saveInfo(eventid)
    })
  }

  //on text change for event entry save automatically
  function saveTextChange(){
    $('.description').on('change', function(){
      var eventid = $(this).attr("id").split('-')[1]
      saveInfo(eventid)
    })
  }

  //save info to local cache
  function saveInfo(eventid){
    var eventValue = $('#textarea-'+eventid).val().trim()
    var plannerEntry = today.format('MMDDYYYY')
    //remove entry from eventEntry if value is blank otherwise add it to eventEntry
    eventValue ? eventEntry[eventid] = eventValue : delete eventEntry[eventid]
    plannerCollection[plannerEntry] = eventEntry
    //check to see if all event entries were cleared, and if they were remove date entry from plannerCollection
    if(Object.keys(plannerCollection[plannerEntry]).length==0){delete plannerCollection[plannerEntry]}
    localStorage.setItem('plannerCache', JSON.stringify(plannerCollection))
  }

  //clear entries from display and populate entries from local storage
  function loadDailyEvents(){
    loadPlanner()
    $.each(workHours, function(index,value){
      $('#textarea-'+value).val('')
    })
    if (typeof plannerCollection[today.format('MMDDYYYY')]!='undefined'){
      eventEntry = {}
      $.each(plannerCollection[today.format('MMDDYYYY')], function(key, value){
        //set event entries for currentdate
        eventEntry[key] = value
        $('#textarea-'+key).val(value)
      })
    }else{
      // clear eventEntry if there are no entries for this date
      eventEntry = {}
    }
  }

  loadDailyEvents()
});