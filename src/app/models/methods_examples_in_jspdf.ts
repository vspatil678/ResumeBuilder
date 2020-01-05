import * as jsPDF from 'jspdf';
import * as $ from 'jquery';
  // doc.text(); it takes 3 parameter
  // 1-text what you want to write
  // 2- x -indicates starting position of text (middle of the line - 80 , starting of the line - 0) --> Horizantal position
  // 3- y - indicates starting line of the text (begging of the page 10) --> vertical position
  // in otherwords x and y's are like css padding
// tslint:disable-next-line:align
  const doc = new jsPDF();
doc.setFontSize(22);
doc.text('RESUME', 80, 10);
doc.setFontSize(16);
doc.text(0, 20, 'This is some normal sized text underneath.');
doc.setTextColor(100);
doc.text(20, 20, 'This is gray.');

// tslint:disable-next-line:align
  doc.setTextColor(150);
doc.text(20, 30, 'This is light gray.');

doc.setTextColor(255, 0, 0);
doc.text(20, 40, 'This is red.');

doc.setTextColor(0, 255, 0);
doc.text(20, 50, 'This is green.');

doc.setTextColor(0, 0, 255);
doc.text(20, 60, 'This is blue.');
doc.text(20, 70, 'This is the default font.');

doc.setFont('courier');
doc.setFontType('normal');
doc.text(20, 80, 'This is courier normal.');

doc.setFont('times');
doc.setFontType('italic');
doc.text(20, 90, 'This is times italic.');

doc.setFont('helvetica');
doc.setFontType('bold');
doc.text(20, 100, 'This is helvetica bold.');

doc.setFont('courier');
doc.setFontType('bolditalic');
doc.text(20, 110, 'This is courier bolditalic.');
  // circle and rectangular in next page
doc.addPage();
doc.setFillColor(100, 100, 240);
doc.setDrawColor(100, 100, 0);
doc.setLineWidth(1);
  // Empty ellipse
doc.ellipse(50, 50, 10, 5);
// Filled ellipse
doc.ellipse(100, 50, 10, 5, 'F');
// Filled circle with borders
doc.circle(150, 50, 5, 'FD');
doc.rect(20, 20, 10, 10);

// Filled square
doc.rect(40, 20, 10, 10, 'F');

// Empty red square
doc.setDrawColor(255, 0, 0);
doc.rect(60, 20, 10, 10);

// Filled square with red borders
doc.setDrawColor(255, 0, 0);
doc.rect(80, 20, 10, 10, 'FD');

// Filled red square
doc.setDrawColor(0);
doc.setFillColor(255, 0, 0);
doc.rect(100, 20, 10, 10, 'F');

// Filled red square with black borders
doc.setDrawColor(0);
doc.setFillColor(255, 0, 0);
doc.rect(120, 20, 10, 10, 'FD');

//  Lines (Horizantal Lines and vertical Lines)
doc.addPage();
doc.line(20, 20, 60, 20); // horizontal line

doc.setLineWidth(0.5);
doc.line(20, 25, 60, 25);

doc.setLineWidth(1);
doc.line(20, 30, 60, 30);

doc.setLineWidth(1.5);
doc.line(20, 35, 60, 35);

doc.setDrawColor(255, 0, 0); // draw red lines

doc.setLineWidth(0.1);
doc.line(100, 20, 100, 60); // vertical line

doc.setLineWidth(0.5);
doc.line(105, 20, 105, 60);

doc.setLineWidth(1);
doc.line(110, 20, 110, 60);

doc.setLineWidth(1.5);
doc.line(115, 20, 115, 60);

  // tslint:disable-next-line:only-arrow-functions
doc.addHTML(document.body, function() {
    const string1 = doc.output('datauristring');
    $('.preview-pane').attr('src', string1);
   });

doc.addPage();
  // get all html controls into pdf
   // We'll make our own renderer to skip this editor
const specialElementHandlers = {
'#editor'(element, renderer) {
 return true;
}
};

// All units are in the set measurement for the document
// This can be changed to "pt" (points), "mm" (Default), "cm", "in"
doc.fromHTML($('body').get(0), 15, 15, {
width: 170,
elementHandlers: specialElementHandlers
});

doc.addPage();
  // adding metadata to the page
doc.text(20, 20, 'This PDF has a title, subject, author, keywords and a creator.');

// Optional - set properties on the document
doc.setProperties({
title: 'Title',
subject: 'This is the subject',
author: 'Author Name',
keywords: 'generated, javascript, web 2.0, ajax',
creator: 'Creator Name'
});

doc.output('dataurlnewwindow'); // works ok but opening in new tab;
