// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  const workHours = [9,10,11,12,13,14,15,16,17]
  const currentHour = dayjs().format('H')
  const mainContainer = $('.container-lg')
  var eventEl, hourEl, textEl, saveEl
  var bgcolor
  var plannerCache = localStorage.getItem("plannerCache")
  if (!plannerCache){plannerCache = {}}

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
    textEl = `<textarea class="col-8 col-md-10 description" rows="3" id="textarea-`+value+`"> </textarea>`
    saveEl = `<button class="btn saveBtn col-2 col-md-1" dataset=aria-label="save">
                <i class="fas fa-save" aria-hidden="true" id="button-`+value+`"></i>
              </button>`
    eventEl.append(hourEl)
    eventEl.append(textEl)
    eventEl.append(saveEl)
    mainContainer.append(eventEl)
  })
  //eventlisnter for save button value is stored/removed from the cache
  $('.fa-save').click(function(){
    //get number part of id=button-# 
    let eventid = $(this).attr("id")
    eventid = eventid.slice(-(eventid.length-7))
    //remove entry if left blank other wise add it to the plannerCache
    $('#textarea-'+eventid).val() ? plannerCache[eventid] = $('#textarea-'+eventid).val() : delete plannerCache[eventid]
    localStorage.setItem("plannerCache", JSON.stringify(plannerCache))
  })


    // TODO: Add a listener for click events on the save button. This code should
    // use the id in the containing time-block as a key to save the user input in
    // local storage. HINT: What does `this` reference in the click listener
    // function? How can DOM traversal be used to get the "hour-x" id of the
    // time-block containing the button that was clicked? How might the id be
    // useful when saving the description in local storage?
    //
    // TODO: Add code to apply the past, present, or future class to each time
    // block by comparing the id to the current hour. HINTS: How can the id
    // attribute of each time-block be used to conditionally add or remove the
    // past, present, and future classes? How can Day.js be used to get the
    // current hour in 24-hour time?
    //
    // TODO: Add code to get any user input that was saved in localStorage and set
    // the values of the corresponding textarea elements. HINT: How can the id
    // attribute of each time-block be used to do this?
    //
    // TODO: Add code to display the current date in the header of the page.
  });
  