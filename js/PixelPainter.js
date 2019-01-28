const pixelPaint = (function () {
  let pixelPainter = document.getElementById('pixelPainter');
  let curColor = '#000000';
  let colorList = [];
  let curTool = 'none';
  let count = 0;
  let undoArr = [];
  let option = 'none';

  let canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.class = 'canvas';
  canvas.height = '500';
  canvas.width = '500';
  canvas.style.backgroundColor = '#ffffff';
  pixelPainter.appendChild(canvas);

  let controls = document.createElement('div');
  controls.className = 'controls';
  pixelPainter.appendChild(controls);
  let colorPick = document.createElement('input');
  colorPick.type = 'color';
  colorPick.id = 'colorPicker';
  controls.appendChild(colorPick);

  colorPick.addEventListener('change', function (event) {
    watchColorPicker(event)
  }, false);

  function watchColorPicker(e) {
    curColor = e.target.value;
  }

  let grid = document.createElement('div');
  grid.className = 'colors';
  controls.appendChild(grid);
  for (let i = 0; i < 2; i++) {
    let row = document.createElement('div');
    row.className = 'colorRow';
    for (let j = 1; j <= 6; j++) {
      let cell = document.createElement('div');
      cell.className = 'colorCell';
      cell.addEventListener('click', function (event) {
        changeColor(event.target.style.backgroundColor);
      });
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }

  function changeColor(e) {
    curColor = e;
  }
  colorCells = document.getElementsByClassName('colorCell');
  colorCells[0].style.backgroundColor = '#ff0000';
  colorCells[1].style.backgroundColor = '#ff00ff';
  colorCells[2].style.backgroundColor = '#0000ff';
  colorCells[3].style.backgroundColor = '#00ffff';
  colorCells[4].style.backgroundColor = '#00ff00';
  colorCells[5].style.backgroundColor = '#ffff00';
  colorCells[6].style.backgroundColor = '#ffffff';
  colorCells[7].style.backgroundColor = '#bbbbbb';
  colorCells[8].style.backgroundColor = '#888888';
  colorCells[9].style.backgroundColor = '#555555';
  colorCells[10].style.backgroundColor = '#222222';
  colorCells[11].style.backgroundColor = '#000000';

  let btnControls = document.createElement('div');
  btnControls.className = 'buttonControls';
  controls.appendChild(btnControls);

  //creating and appending box for buttons
  let btnBox1 = document.createElement('div');
  btnBox1.className = 'buttonBox';
  btnControls.appendChild(btnBox1);
  let btnBox2 = document.createElement('div');
  btnBox2.className = 'buttonBox';
  btnControls.appendChild(btnBox2);

  function mkBtn(name, num) {
    let btn = document.createElement('div');
    btn.className = 'button';
    btn.id = name;
    // btn.innerHTML = name;
    let icon = document.createElement('div');
    icon.id = name + 'Icon';
    icon.className = 'icon';
    btn.appendChild(icon);
    if (num === 1) {
      btnBox1.appendChild(btn);
    } else if (num === 2) {
      btnBox2.appendChild(btn);
    }
  }

  mkBtn('erase', 1);
  document.getElementById('eraseIcon').style.backgroundImage = "url('/assets/erase.svg')";
  document.getElementById('erase').addEventListener('click', function (event) {
    erase()
  });
  mkBtn('fill', 1);
  document.getElementById('fillIcon').style.backgroundImage = "url('/assets/paintbucket.png')";
  document.getElementById('fill').addEventListener('click', function (event) {
    fillBtn(event.target)
  });
  mkBtn('line', 1);
  document.getElementById('lineIcon').style.backgroundImage = "url('/assets/line.svg')";
  mkBtn('square', 1);
  document.getElementById('squareIcon').style.backgroundImage = "url('/assets/square.svg')";
  mkBtn('triangle', 1);
  document.getElementById('triangleIcon').style.backgroundImage = "url('/assets/triangle.svg')";
  mkBtn('circle', 1);
  document.getElementById('circleIcon').style.backgroundImage = "url('/assets/circle.svg')";
  mkBtn('save', 2);
  document.getElementById('saveIcon').style.backgroundImage = "url('/assets/save.png')";
  mkBtn('load', 2);
  document.getElementById('loadIcon').style.backgroundImage = "url('/assets/load.png')";
  mkBtn('undo', 2);
  document.getElementById('undoIcon').style.backgroundImage = "url('/assets/undo.svg')";
  document.getElementById('undo').addEventListener('click', function (event) {
    undo()
  });
  mkBtn('clear', 2);
  document.getElementById('clearIcon').style.backgroundImage = "url('/assets/clear.svg')";
  document.getElementById('clear').addEventListener('click', function (event) {
    clearCanvas()
  });

  if (typeof G_vmlCanvasManager != 'undefined') {
    canvas = G_vmlCanvasManager.initElement(canvas);
  }
  context = canvas.getContext("2d");

  canvas = document.getElementById('canvas');
  canvas.addEventListener('mousedown', function (e) {
    if (option === 'fill') {
      fill(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    } else {
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      redraw();
    }
  });

  canvas.addEventListener('mousemove', (function (e) {
    if (paint) {
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true)
      redraw();
    }
  }));

  canvas.addEventListener('mouseup', (function (e) {
    paint = false;
    if (count !== 0) {
      undoArr.push(count);
      count = 0;
    }
  }));

  canvas.addEventListener('mouseleave', (function (e) {
    paint = false;
    if (count !== 0) {
      undoArr.push(count);
      count = 0;
    }
  }));

  let clickX = new Array();
  let clickY = new Array();
  let clickDrag = new Array();
  let paint;

  function addClick(x, y, dragging) {
    clickX.push(x - 10);
    clickY.push(y - 10);
    clickDrag.push(dragging);
    if (curTool === 'erase') {
      colorList.push('#ffffff')
    } else {
      colorList.push(curColor);
    }
    count++;
  }

  function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.lineJoin = "round";
    context.lineWidth = 5;

    for (let i = 0; i < clickX.length; i++) {
      context.beginPath();
      if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1]);
      } else {
        context.moveTo(clickX[i] - 1, clickY[i]);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      context.strokeStyle = colorList[i];
      context.stroke();
    }
  }

  function erase() {
    if (curTool === 'erase') {
      curTool = 'none';
    } else {
      curTool = 'erase';
    }
  }

  function fillBtn() {
    if (option === 'fill') {
      option = 'none'
    } else {
      option = 'fill';
    }
  }
  function fill(x, y) {
    console.log(x, y);

  }

  function undo() {
    let undoNum = undoArr.pop();
    for (let i = 0; i < undoNum; i++) {
      clickX.pop();
      clickY.pop();
      clickDrag.pop();
      colorList.pop();
    }
    redraw();
  }

  function clearCanvas() {
    let context = document.getElementById('canvas').getContext("2d");
    clickX.length = 0;
    clickY.length = 0;
    clickDrag.length = 0;
    colorList.length = 0;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }
})();