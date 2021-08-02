class Task {
  constructor(hour, task) {
    this.hour = hour;
    this.task = task;
  }
}

window.onload = function() {
  const currentTimeblocks = getCurrentTimeblocks();
  const currentTime = moment();

  displayCurrentDate(currentTime);
  displayTimeblockRows(currentTime);

  document.querySelector('.container')
    .addeListener('click', function(e) {
      containerClicked(e, currentTimeblocks);
    });
  setTimeblockText(currentTimeblocks);
};

function getCurrentTimeblocks() {
  const currentTimeblocks = localStorage.getItem('taskects');
  return currentTimeblocks ? JSON.parse(currentTimeblocks) : [];
}

function displayCurrentDate(currentTime) {
  document.getElementById('currentDay')
    .textContent = currentTime.format('dddd, MMMM Do');
}

/*** functions for displaying all timeblock rows ***/
function displayTimeblockRows(currentTime) {
  const currentHour = currentTime.hour();
  //working hours are 9-5 or 9-17
  for (let i = 6; i <= 16; i ++) {
    const timeblock = createTimeblockRow(i);
    const hourCol = createCol(createHourDiv(i), 1);
    const textArea = createCol(createTextArea(i, currentHour), 10);
    const saveBtn = createCol(createSaveBtn(i), 1);
    appendTimeblockColumns(timeblock, hourCol, textArea, saveBtn);
    document.querySelector('.container').appendChild(timeblock);
  }
}

function createTimeblockRow(hourId) {
  const timeblock = document.createElement('div');
  timeblock.classList.add('row');
  timeblock.id = `timeblock-${hourId}`;
  return timeblock;
}

function createCol(element, colSize) {
  const col = document.createElement('div');
  col.classList.add(`col-${colSize}`,'p-0');
  col.appendChild(element);
  return col;
}

function createHourDiv(hour) {
  const hourCol = document.createElement('div');
  hourCol.classList.add('hour');
  hourCol.textContent = formatHour(hour);
  return hourCol;
}

function formatHour(hour) {
  const hourString = String(hour);
  return moment(hourString, 'h').format('hA');
}

function createTextArea(hour, currentHour) {
  const textArea = document.createElement('textarea');
  textArea.classList.add(getTextAreaBackgroundClass(hour, currentHour));
  return textArea;
}

function getTextAreaBackgroundClass(hour, currentHour) {
  return hour < currentHour ? 'past' 
    : hour === currentHour ? 'present' 
    : 'future';
}

function createSaveBtn(hour) {
  const saveBtn = document.createElement('button');
  saveBtn.classList.add('saveBtn');
  saveBtn.innerHTML = '<i class="fas fa-save"></i>';
  saveBtn.setAttribute('data-hour', hour);
  return saveBtn;
}

function appendTimeblockColumns(timeblockRow, hourCol, textAreaCol, saveBtnCol) {
  const innerCols = [hourCol, textAreaCol, saveBtnCol];
  for (let col of innerCols) {
    timeblockRow.appendChild(col);
  }
}

/*** functions for saving to local storage ***/
function containerClicked(e, timeblockList) {
  if (isSaveButton(e)) {
    const timeblockHour = getTimeblockHour(e);
    const textAreaValue = getTextAreaValue(timeblockHour);
    placeTimeblockInList(new task(timeblockHour, textAreaValue), timeblockList);
    saveTimeblockList(timeblockList);
  }
}

function isSaveButton(e) {
  return e.target.matches('button') || e.target.matches('.fa-save');
}

function getTimeblockHour(e) {
  return e.target.matches('.fa-save') ? e.target.parentElement.dataset.hour : e.target.dataset.hour;
}

function getTextAreaValue(timeblockHour) {
  return document.querySelector(`#timeblock-${timeblockHour} textarea`).value;
}

function placeTimeblockInList(newtask, timeblockList) {
  if (timeblockList.length > 0) {
    for (let savedTimeblock of timeblockList) {
      if (savedTimeblock.hour === newtask.hour) {
        savedTimeblock.task = newtask.task;
        return;
      }
    }
  } 
  timeblockList.push(newtask);
  return;
}

function saveTimeblockList(timeblockList) {
  localStorage.setItem('taskects', JSON.stringify(timeblockList));
}

function setTimeblockText(timeblockList) {
  if (timeblockList.length === 0 ) {
    return;
  } else {
    for (let timeblock of timeblockList) {
      document.querySelector(`#timeblock-${timeblock.hour} textarea`)
        .value = timeblock.task;
    }
  }
}