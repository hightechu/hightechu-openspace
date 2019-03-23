$(document).keydown(function(event) {
if (event.ctrlKey==true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109'  || event.which == '187'  || event.which == '189'  ) ) {
        event.preventDefault();
     }
    // 107 Num Key  +
    // 109 Num Key  -
    // 173 Min Key  hyphen/underscor Hey
    // 61 Plus key  +/= key
});

$(window).bind('mousewheel DOMMouseScroll', function (event) {
       if (event.ctrlKey == true) {
       event.preventDefault();
       }
});

// var audio1 = document.getElementById("beep-one");

// function playAudio() {
// 	console.log(audio1);
//   audio1.play();
// }

var hover = new Audio("Audio/multimedia_button_click_013.mp3");
var activate = new Audio("Audio/multimedia_button_click_019.mp3");

function playAudio(media) {
	const playPromise = media.play();
	if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Automatic playback started!
			// Show playing UI.
			console.log(media)
    })
    .catch(error => {
    	console.log("Error in playAudio")
      // Auto-play was prevented
      // Show paused UI.
    });
  }
// }

// function pauseAudio() {
// 	const playPromise = media.pause();
// 	if (playPromise !== undefined) {
//     playPromise.then(_ => {
//       // Automatic playback started!
// 			// Show playing UI.
// 			console.log(media)
//     })
//     .catch(error => {
//       // Auto-play was prevented
//       // Show paused UI.
//     });
//   }
 }