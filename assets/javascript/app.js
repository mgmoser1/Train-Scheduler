// ON LOAD //
$(document).ready(function(trainScheduler){

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDkeWXPWSissSsQSVUCu80NDVAofb2GTio",
    authDomain: "train-scheduler-619b4.firebaseapp.com",
    databaseURL: "https://train-scheduler-619b4.firebaseio.com",
    projectId: "train-scheduler-619b4",
    storageBucket: "train-scheduler-619b4.appspot.com",
    messagingSenderId: "219709137362"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database.
var trainy = firebase.database().ref();  // Was missing .ref()

   
// ON SUBMIT //

$("#submit").on("click", function(){
    event.preventDefault();
  //debugger;
//$("#train-table").val("");
    var trainName = $("#name").val().trim();
    var trainDest = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    console.log(firstTrain);  // Returned 13:45
    var freq = $("#frequency").val().trim();
    
  
  
  
    var newTrain = {
        name: trainName,
        destination: trainDest,
        frequency: freq,
        firstTrain: firstTrain
    
    };
    
    
    console.log("Train: " + newTrain);

    trainy.push(newTrain);

alert(newTrain.name + " has been added.");


      // Clear the input divs.
$("#name").val("");
$("#destination").val("");
$("#first-train").val("");
$("#frequency").val("");

return false;

});

// Abandoned this and went with a solution I found on the Internet.
// I walked thorugh it all so I know how it works now.
// I was not familiar with the childSnapshot portion.

// UPDATE LIST //
/* database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());
    console.log(snapshot.val().name);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().frequency);
    

    
    // Clear div so trains don't repeat//
    
 
    // Change the HTML to reflect
  var newRow = $("<tr>");
  var newName = $("<td>").text(snapshot.val().name);
  var newDest = $("<td>").text(snapshot.val().destination);
  var newFreq = $("<td>").text(snapshot.val().frequency);
  var newNext = $("<td>").(nextArrival); // Not working. Change text to val or something else?
  var newMinutesAway = $("<td>").val(minutesAway); // Not working. Change text to val or something else?
 

  $(newRow).append(newName);
  $(newRow).append(newDest);
  $(newRow).append(newFreq);
  $(newRow).append(newNext);
  $(newRow).append(newMinutesAway);

  $("#train-table").append(newRow); */

  // Took this from https://github.com/Ednas/train-scheduler/blob/master/assets/javascript/app.js //
  trainy.on("child_added", function(childSnapshot) {

    let data = childSnapshot.val();
    let trainName = data.name;
    let trainDestin = data.destination;
    let trainFrequency = data.frequency;
    let theFirstTrain = data.firstTrain;
    console.log(" theFirstTrain: " + theFirstTrain);
    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time and find the modulus between the difference and the frequency  
    
    var convertedFirstTrain = moment(theFirstTrain, "HH:mm").subtract(1, "years");  // in class example didn't have it, either. was missing .format("X")
 console.log("Converted First Train: " + convertedFirstTrain);
   
    
  //  var currentTime = moment(); // Had this in the nextTrain function.
 //   console.log("Current: " + moment(currentTime).format("HH:mm"));
//    var nextArrival = nextCalculator(convertedFirstTrain,freq); // NEXT ARRIVAL 
//    console.log(nextArrival); // Returning 08:10, same as function;

var diffTime = moment().diff(moment(convertedFirstTrain), "minutes");
//console.log("DIFFERENCE IN TIME: " + diffTime);
// CALCULATE Next Train and Minutes Remaining //
// assign and test:
/* var tRemainder = diffTime % freq;
var tMinutes = freq - tRemainder;
var nextArrival = moment().add(tMinutes, "minutes").format("HH:mm A"); // remove formatting and put on output div if needed.  //  FIGURE THIS OUT. WHERE DO I PUT IT?
var minutesAway = moment().diff(moment(nextArrival), "minutes"); */
    
    let tRemainder = diffTime % trainFrequency; // This is broken. firstTrain and freq are working.
    let tMinutes = trainFrequency - tRemainder;
    let nextArrival = moment().add(tMinutes, "minutes").format("HH:mm A"); // remove formatting and put on output div if needed.  //  FIGURE THIS OUT. WHERE DO I PUT IT?
 

    // To calculate the arrival time, add the tMinutes to the currrent time
 //   let tArrival = moment().add(tMinutes, "m").format("hh:mm A");

    // Add each train's data into the table 
    $("#train-table").append("<tr><td>" + trainName + "</td><td>" + trainDestin + "</td><td class='min'>" + trainFrequency + "</td><td class='min'>" + nextArrival + "</td><td class='min'>" + tMinutes + "</td></tr>");



  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

   
});
   
