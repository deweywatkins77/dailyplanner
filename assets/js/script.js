// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  const mainContainer = $('.container-lg')
  const workHours = [9,10,11,12,1,2,3,4,5]
  //build planner time entries
  $.each(workHours, function(index,value){
      const hourContainer = $('<div></div>')
      hourContainer.attr({id:"hour-"+value, class:"row time-block past"})
      const hourTime = `<div class="col-2 col-md-1 hour text-center py-3 id=timeEntry-`+value+`">`+value+`AM</div>`
      const textArea = `<textarea class="col-8 col-md-10 description" rows="3" id="textarea-`+value+`"> </textarea>`
      const saveButton = `<button class="btn saveBtn col-2 col-md-1" aria-label="save">
                            <i class="fas fa-save" aria-hidden="true" id="button-`+value+`"></i>
                          </button>`
      hourContainer.append(hourTime)
      hourContainer.append(textArea)
      hourContainer.append(saveButton)
      mainContainer.append(hourContainer)
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
  