
let onDocumentLoaded = () => {

  checkStartOfDay();
  refreshCounts();
  consoleLog();
}

let checkStartOfDay = () => {
  let data = getStoredData()
  let lastChange = data.lastChange;
  let lastDate = new Date(lastChange.t);
  let currentDate = new Date(Date.now());

  if (lastDate.getDate() !== currentDate.getDate() ||
    lastDate.getMonth() !== currentDate.getMonth() ||
    lastDate.getFullYear() !== currentDate.getFullYear()
  ) {
    data.chaiCount = 0;
    data.coffeeCount = 0;
    storeData(data);
  }
  refreshCounts();
}

let changeCount = (breverage) => {
  checkStartOfDay();
  let data = getStoredData();
  let doubleClicked = checkDoubleClick(breverage);

  if (breverage === 'chai') {
    data.chaiCount += 1;
    data.totalChaiCount += 1;
    enableUndo('chai');
  } else {
    data.coffeeCount += 1;
    data.totalCoffeeCount += 1;
    enableUndo('coffee');
  }

  let entryData = {
    b: breverage === 'chai' ? 1 : 2,
    t: Date.now()
  }

  data.allChanges.push(entryData);
  data.lastChange = entryData;
  storeData(data);
  refreshCounts();
}

let refreshCounts = () => {
  let data = getStoredData();
  if (data) {
    document.getElementById("chai-count").innerHTML = data.chaiCount;
    document.getElementById("chai-count-all").innerHTML = data.totalChaiCount;
    document.getElementById("coffee-count").innerHTML = data.coffeeCount;
    document.getElementById("coffee-count-all").innerHTML = data.totalCoffeeCount;
  }
}

let enableUndo = (type) => {
  if (type === 'chai') {
    document.getElementById('undo-chai').disabled = false;
    setTimeout(() => {
      document.getElementById('undo-chai').disabled = true;
    }, 10000)
  } else {
    document.getElementById('undo-coffee').disabled = false;
    setTimeout(() => {
      document.getElementById('undo-coffee').disabled = true;
    }, 10000)
  }
}

let disableUndo = (type) => {
  if (type === 'chai') {
    document.getElementById('undo-chai').disabled = true;
  } else {
    document.getElementById('undo-coffee').disabled = true;
  }
}

let getStoredData = () => {
  let storedData = localStorage.getItem('data');
  if (!storedData) {
    setData();
    return JSON.parse(localStorage.getItem('data'));
  }
  return JSON.parse(storedData);
}

let setData = () => {
  let data = {
    chaiCount: 0,
    coffeeCount: 0,
    totalChaiCount: 0,
    totalCoffeeCount: 0,
    allChanges: [],
    lastChange: {}
  }
  localStorage.setItem('data', JSON.stringify(data));
}

let storeData = (data) => {
  localStorage.setItem('data', JSON.stringify(data));
}

let checkDoubleClick = (breverage) => {
  return false
}

let undo = () => {
  let data = getStoredData();
  let secondLastChange = data.allChanges[data.allChanges.length - 2]
  let lastChange = data.lastChange;

  if (lastChange.b === 1) {
    data.chaiCount -= 1;
    data.totalChaiCount -= 1;
    disableUndo('chai')
  } else {
    data.coffeeCount -= 1;
    data.totalCoffeeCount -= 1;
    disableUndo('coffee')
  }

  data.lastChange = secondLastChange;
  data.allChanges.pop();
  storeData(data);
  refreshCounts();
}

let consoleLog = () => {
  console.log(`%c This is a simple webpage and basically does nothing.`,'color: red; font-size: 150%');
  console.log(`%c Have added some basic counters to track daily tea/coffee intake. Will add some visualizations in the future.`,'color: blue; font-size: 120%');
  console.log(`%c Data will be saved in browser's localstorage.  `,'color: green; font-size: 120%');
  console.log(`%c Contact me @ ch4iw4l4@gmail.com`,'color: grey; font-size: 130%');
}