'use strict';

// I need to make sure each <section> has a class of its keyword.

// creates constructor function

function Horn(horn) {
  this.image_url = horn.image_url;
  this.title = horn.title;
  this.description = horn.description;
  this.keyword = horn.keyword;
  this.horns = horn.horns;
}

// creates array with all objects from the constructor function

Horn.allHorns = [];

// declares function that clones the empty div elements, populates it with properties from each object, and deletes the emplty div. 

Horn.prototype.render = function() {
  let context  = {title: this.title, image_url: this.image_url, description: this.description};
  let x = this.toHtml(context);
  console.log(x);
  $('main').append(x);
};

Horn.prototype.toHtml = function () {
  console.log('running html method');
  let $template = $('#horn-template').html();
  let compiledTemplate = Handlebars.compile($template);
  console.log(compiledTemplate);
  return compiledTemplate(this);
};


// creates a promise that once the json file is read, data from each object will be populated into the new div template.

Horn.readJson = () => {
  $.get('data/page-1.json', 'json')
    .then(data => {
      data.forEach(item => {
        Horn.allHorns.push(new Horn(item));
      });

      Horn.allHorns.forEach(hornvar => {
        $('main').append(hornvar.render());
      });
    })
    .then(Horn.populateFilter)
    .then(Horn.handleFilter);
};

// clears all images from page and adds the ones chosen in the filter back in, ready to be rendered

Horn.populateFilter = () => {
  let filterKeywords = [];
  $('option').not(':first').remove();
  Horn.allHorns.forEach(horn => {
    if (!filterKeywords.includes(horn.keyword))
      filterKeywords.push(horn.keyword);
  });

  filterKeywords.sort();

  filterKeywords.forEach(keyword => {
    let optionTag = `<option value="${keyword}">
    ${keyword}</option>`;
    $('select').append(optionTag);
  });
};

// Hides all images from page and fades back in the ones chosen by the filter.

Horn.handleFilter = () => {
  $('select').on('change',function () {
    let $selected = $(this).val();
    if ($selected !== 'default') {
      $('section').hide();

      Horn.allHorns.forEach(horn =>{
        if ($selected === horn.keyword) {
          $(`section[class="${$selected}"`).addClass
          ('filtered').fadeIn();
        }
      });

      $(`option[value=${$selected}]`).fadeIn();
    } else {
      $('section').removeClass('filtered').fadeIn();
      $(`option[value=${$selected}]`).fadeIn();
    }
  });
};

//creates pagination

// $("ul.pagination").quickPagination({pagerLocation:"both"});

//Loads the json data

$(() => Horn.readJson());
