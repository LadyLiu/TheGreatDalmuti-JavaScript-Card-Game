helper = {
    sortNumber: function (a, b) {
        return a - b; //sorts smallest to largest when used with .sort
    },

    getRandomNumber: function (min, max) {
        return Math.floor((Math.random() * max) + min);
    },
    //Changes class name when given old class and new class
    classChange: function(oldClass, newClass) {
        var changingObj = document.getElementsByClassName(oldClass);
        for (i = 0; i < changingObj.length; i++) {
            changingObj[i].setAttribute("class", newClass);
        }
    }
};