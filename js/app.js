'use strict';

// Some of this code was from our class code review,
// but I wanted to get at least enough up and running that we could work on handlebars and flex box tonight.
// It was typed out by hand with care taken to work on understanding as I went.

// creates constructor function

function Horn(horn) {
  this.image_url = horn.image_url;
  this.title = horn.title;
  this.description = horn.decsription;
  this.keyword = horn.keyword;
  this.horns = horn.horns;
}

// creates array with all objects from the constructor function


// declares function that clones the empty div elements, populates it with properties from each object, and deletes the emplty div. 

// Horn.prototype.render = function() {
//   $('main').append('<div class="clone"></div>');
//   let $hornClone = $('div[class="clone"]');
//   $hornClone.html($('#horn-template').html());
//   $hornClone.find('h2').text(this.title);
//   $hornClone.find('img').attr('src', this.image_url);
//   $hornClone.find('p').text(this.description);
//   $hornClone.attr('class', this.keyword);
//   $hornClone.removeClass('clone');
// };

Horn.prototype.toHtml = function () {
  let $template = $('#horns-template').html();
  let compiledTemplate = Handlebars.compile($template);
  return compiledTemplate(this);
};



// creates a promise that once the json file is read, data from each object will be populated into the new div template.

Horn.readJson = () => {
  
Horn.allHorns = [];
  $.get('data/page-1.json', 'json')
    .then(data => {
      console.log(data);
      data.forEach(item => {
        console.log('This is item', item);
        Horn.allHorns.push(new Horn(item));
      });

      // .then(Horn.loadHorns)

      console.log(Horn.allHorns);

      Horn.allHorns.forEach(hornvar => {
        $('horns').append(hornvar.toHtml());
      });

      // Horn.allHorns.forEach (horn => {
      //   $('main').append(horn.render());
      // });
    })
    .then(Horn.populateFilter)
    .then(Horn.handleFilter);
};

// creates function that iterates through the horns array and renders each object to the page.

// Horn.loadHorns = () => {
//   Horn.allHorns.forEach(horn => horn.render())
// }

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
      $('div').hide();

      Horn.allHorns.forEach(horn =>{
        if ($selected === horn.keyword) {
          $(`div[class="${$selected}"`).addClass
          ('filtered').fadeIn();
        }
      });

      $(`option[value=${$selected}]`).fadeIn();
    } else {
      $('div').removeClass('filtered').fadeIn();
      $(`option[value=${$selected}]`).fadeIn();
    }
  });
};

//Loads the json data

$(() => Horn.readJson());

// $('select[name="animals"]').on('change', function () {
//   let $selection = $(this).val();
//   $('data/page-1.json').hide()
//   $(`data/page-1.json[keyword="${selection}"]`).show()
// })
