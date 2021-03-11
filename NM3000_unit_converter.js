var property = new Array();
var unit = new Array();
var factor = new Array();

property[0] = "Activity";
unit[0] = new Array("Becquerel", "curie", "dpm", "dps", "Megabecquerel", "Millicurie");
factor[0] = new Array(1, 2.702703E-11, 60, 1, 1.0E-06, 2.702703E-08);

property[1] = "Dose Equivalent";
unit[1] = new Array("Sievert", "Rem", "Milisievert", "Milirem");
factor[1] = new Array(1, 100, 1000, 1.0E+05);

property[2] = "Absorbed Dose";
unit[2] = new Array("Gray", "Rad", "Miligray", "Roentgen");
factor[2] = new Array(1, 100, 1000, 11494.25);

property[3] = "Exposure";
unit[3] = new Array("Roentgen", "Coulomb/Kg-air", "Rem", "Milirem", "Gray", "Microgray");
factor[3] = new Array(1, 2.58E-04, 0.87, 87, 0.87E-04, 0.87E+04);


// ===========
//  Functions
// ===========

function UpdateUnitMenu(propMenu, unitMenu) {
  // Updates the units displayed in the unitMenu according to the selection of property in the propMenu.
  var i;
  i = propMenu.selectedIndex;
  FillMenuWithArray(unitMenu, unit[i]);
}

function FillMenuWithArray(myMenu, myArray) {
  // Fills the options of myMenu with the elements of myArray.
  // !CAUTION!: It replaces the elements, so old ones will be deleted.
  var i;
  myMenu.length = myArray.length;
  for (i = 0; i < myArray.length; i++) {
    myMenu.options[i].text = myArray[i];
  }
}

function CalculateUnit(sourceForm, targetForm) {
  // A simple wrapper function to validate input before making the conversion
  var sourceValue = sourceForm.unit_input.value;

  // First check if the user has given numbers or anything that can be made to one...
  sourceValue = parseFloat(sourceValue);
  if (!isNaN(sourceValue) || sourceValue == 0) {
    // If we can make a valid floating-point number, put it in the text box and convert!
    sourceForm.unit_input.value = sourceValue;
    ConvertFromTo(sourceForm, targetForm);
  }
}

function ConvertFromTo(sourceForm, targetForm) {
  // Converts the contents of the sourceForm input box to the units specified in the targetForm unit menu and puts the result in the targetForm input box.In other words, this is the heart of the whole script...
  var propIndex;
  var sourceIndex;
  var sourceFactor;
  var targetIndex;
  var targetFactor;
  var result;

  // Start by checking which property we are working in...
  propIndex = document.property_form.the_menu.selectedIndex;

  // Let's determine what unit are we converting FROM (i.e. source) and the factor needed to convert that unit to the base unit.
  sourceIndex = sourceForm.unit_menu.selectedIndex;
  sourceFactor = factor[propIndex][sourceIndex];

  // the same thing for the target unit - the units we are converting TO:
  targetIndex = targetForm.unit_menu.selectedIndex;
  targetFactor = factor[propIndex][targetIndex];

  // a) convert the source TO the base unit: (The input has been checked by the CalculateUnit function).

  result = sourceForm.unit_input.value;
  
  result = result / sourceFactor;

  // b) use the targetFactor to convert FROM the base unit to the target unit...
  result = result * targetFactor;
 
  targetForm.unit_input.value = result;
}

// This fragment initializes the property dropdown menu using the data defined above in the 'Data Definitions' section
window.onload = function(e) {
  FillMenuWithArray(document.property_form.the_menu, property);
  UpdateUnitMenu(document.property_form.the_menu, document.form_A.unit_menu);
  UpdateUnitMenu(document.property_form.the_menu, document.form_B.unit_menu)
}

// Restricting textboxes to accept numbers + navigational keys only
document.getElementByClass('numbersonly').addEventListener('keydown', function(e) {
  var key = e.keyCode ? e.keyCode : e.which;

  if (!([8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
      (key == 65 && (e.ctrlKey || e.metaKey)) || // Select All 
      (key == 67 && (e.ctrlKey || e.metaKey)) || // Copy
      (key == 86 && (e.ctrlKey || e.metaKey)) || // Paste
      (key >= 35 && key <= 40) || // End, Home, Arrows
      (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) || // Numeric Keys
      (key >= 96 && key <= 105) // Numpad
      (key == 190) // Numpad
    )) e.preventDefault();
});
