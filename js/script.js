/*global $*/

var answers = ["fill", "blank", "line"]; // answer key, stored in-order
var genericSlot; // "Prefab" element to fill blank spaces

/** -- ready --
 * Ensures that all jQuery code is executed after the page has finished loading
 */
$(document).ready(function() {
    // build prefab for blanks
    trySubmit();
    
    genericSlot = $("<div></div>");
    genericSlot.addClass("clickable blank slot");
    genericSlot.text("___");

    enableClicks();
    $(".buttonStyle:first").trigger("click");
});

/** -- enableClicks() --
 * 
 * Adds a click listener to all existing button elements.
 * 
 * If a button is in the pool, it is cloned and replaces the next available 
 * empty slot. Clicking is disabled on the orignal button, which acts as a 
 * placeholder in-case the user clicks on the clone.
 * 
 * If a button is in a slot, it replaces itself with a generic blank slot 
 * element and then enables the original button in the pool.
 * 
 */
function enableClicks() {
    // regular buttons
    $(".buttonStyle").on("click", function() {
        if ($(this).hasClass("inslot")) {
            // Move button from slot back into its matching position in the pool
            var buttonText = $(this).text();
            $(this).replaceWith(genericSlot.clone());
            var match = $("#guesspool .inactive:contains(" + buttonText + ")");

            // enables clicking again
            match.removeClass("inactive");

        }
        else {
            // "Move" button from pool into next available slot
            var nextSlot = $("#question > .blank:first");
            if (nextSlot.length > 0) {
                //slot exists
                var dup = $(this).clone(true);
                dup.addClass("inslot");
                nextSlot.replaceWith(dup);
                dup.css("visibility", "hidden");
                move($(this), dup);

                // disable clicking on original button
                $(this).addClass("inactive");
            }
        }
        trySubmit();
    });

    // submits answer and checks for correctness
    $("#check").on("click", function() {
        var correct = check();
        if (correct) {
            alert("CORRECT!!!\nI KNEW YOU COULD DO IT \nI AM SO PROUD OF YOU.");
        } else {
            alert("try again.");
        }
    });
}

var check = function() {
    var i;
    for (i = 0; i < answers.length; i++) {
        if (answers[i] !== $(".inslot").eq(i).text()) {
            return false;
        }
    }
    return true;
};

var trySubmit = function() {
    if ($("#question > .blank").length <= 0) {
        $("#check").removeClass("checkstyleinactive");  
    }
    else {
        $("#check").addClass("checkstyleinactive");
    }
};

var move = function(from, slot) {
    var copy = $(from).clone();
    copy.css({"position": "absolute", 
              "display": "block"
    });
    from.prepend(copy);
    
    var vOffset = from.offset().top - 
                    slot.offset().top;
    var hOffset = from.offset().left -
                    slot.offset().left;
    copy.animate({top: "-=" + vOffset, left: "-="+hOffset}, 
    200, 
    "swing",
    function() {slot.css({"visibility": "visible"}); copy.remove();})
};