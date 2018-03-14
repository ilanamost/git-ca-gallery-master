// console.log('Starting up');

var gProjects = [];

var $document = $(document);
$document.ready(initPage);

function initPage() {
  gProjects = createProjs();
  renderPortfolio();
}

function createProjs() {
  var projects = [];

  var proj1 = createProj('sokoban', 'Sokoban', 'Better push those boxes', 'Push the boxes to the targets', 1519855200, ["Matrixes"]);
  var proj2 = createProj('minesweeper', 'Minesweeper', 'Mark the mines', 'Mark all the mines and open all the other cells', 1519855200, ["Matrixes"]);
  var proj3 = createProj('balloon-pop', 'Pop Balloons', 'Pop the balloons', 'Pop as many balloons as you can before they reach the top of the screen', 1519855200, ["Objects"]);
  var proj4 = createProj('in-picture', 'In Picture', 'What is in the picture?', 'answer the question about the picture correctlly', 1519855200, ["Objects"]);
  var proj5 = createProj('touch-nums', 'Touch Nums', 'Touch the numbers in increasing order', 'Touch all numbers in increasing order as fast as you can', 1519855200, ["Matrixes"]);
  var proj6 = createProj('pacman', 'Pacman', 'Eat up! avoid being eaten...', 'Eat all the food. Avoid being eaten by ghosts.', 1519855200, ["Matrixes", "keyboard events"]);

  projects.push(proj1, proj2, proj3, proj4, proj5, proj6);
  return projects;
}

function getDateForProj(timeStamp) {
  var date = new Date(timeStamp * 1000);

  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];


  var monthIdx = date.getMonth();
  var month = monthNames[monthIdx];
  var year = date.getFullYear();

  date = month + ' ' + year;
  return date;
}

function createProj(id, name, title, desc, publishedAt, labels) {
  return {
    id: id,
    name: name,
    title: title,
    desc: desc,
    url: 'img/portfolio/' + id + '-thumbnail.png',
    publishedAt: publishedAt,
    labels: labels
  };
}

function renderPortfolio() {
  renderProjs();
  renderModals();
}

function renderProjs() {
  var strHtml = '';

  $(gProjects).each(function (idx, proj) {
    strHtml += `<div class="col-md-4 col-sm-6 portfolio-item">
        <a class="portfolio-link" data-toggle="modal" href="#portfolioModal${idx}">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content">
              <i class="fa fa-plus fa-3x"></i>
            </div>
          </div>
          <img class="img-fluid" src=${proj.url} alt="">
        </a>
        <div class="portfolio-caption">
          <h4>${proj.name}</h4>
          <p class="text-muted">${proj.title}</p>
        </div>
      </div>`
  });

  var elProjs = $('.projects');
  elProjs.html(strHtml);
}

function renderModals() {

  var strHtml = '';

  $(gProjects).each(function (idx, proj) {
    strHtml += `<div class="portfolio-modal modal fade" id="portfolioModal${idx}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="close-modal" data-dismiss="modal">
              <div class="lr">
                <div class="rl"></div>
              </div>
            </div>
            <div class="container" id=${proj.id}>
              <div class="row">
                <div class="col-lg-8 mx-auto">
                  <div class="modal-body">
                    <!-- Project Details Go Here -->
                    <h2 class="proj-name-color">${proj.name}</h2>
                    <p class="item-intro">${proj.title}</p>
                    <a href="../projs/${proj.id}/index.html">
                    <img class="img-fluid d-block mx-auto" src='img/portfolio/${proj.id}-thumbnail.png' alt="">
                    </a>
                    <p class="font-color">${proj.desc}</p>
                    <ul class="list-inline font-color">
                      <li>Date: ${getDateForProj(proj.publishedAt)}</li>
                      <li>Client: ${proj.name}</li>
                      <li>Category: ${createLblsStr(proj.labels)}</li>
                    </ul>
                    <button class="btn btn-primary" data-dismiss="modal" type="button">
                        <i class="fa fa-times"></i>
                        Close Project</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
  });

  var elModals = $('.modals');
  elModals.html(strHtml);
}

function createLblsStr(labels) {
  str = '';
  $(labels).each(function (idx, lbl) {
    str += ' '+`<span class="badge badge-primary">${lbl}</span>`
  });
  return str;
}


