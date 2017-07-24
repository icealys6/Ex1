window.GolfApp = (function (window, document, undefined) {
    'use strict';

    var app = {};
    app.$data = [];

    app.tableRows = [0, 1, 2, 3];

    app.holeData = [
        'Holes', 1, 2, 3, 4, 5, 6, 7, 8, 9, 'Out', 10, 11, 12, 13, 14, 15, 16, 17, 18, 'In', 'Total'
    ];

    app.tee = [
        'Tee 3', 480, 150, 359, 320, 348, 380, 337, 187, 323, 2884, 337, 391, 166, 409, 136, 518, 348, 383, 459, 3147, 6031
    ];

    app.par = [
        'Par', 5, 3, 4, 4, 4, 4, 4, 3, 4, 35, 4, 4, 3, 4, 3, 5, 4, 4, 5, 36, 71
    ];

    app.tControls = [
        '<input type="button" id="generate_data" value="Generate Test Data">',
        //'<input type="button" id="add_player" value="Add Player">',
    ];

    app.bControls = [
        '<input type="button" id="reset_values" value="Reset Values">',
        '<input type="submit">',
    ];

    app.cache = function () {
        app.form = document.getElementById('scoreform');
        app.table = document.getElementById('scoreCard');
        app.top_controls = document.getElementById('top_controls');
        app.bottom_controls = document.getElementById('bottom_controls');
    };

    app.init = function () {
        app.cache();

        app.init_controls();
        app.init_table();

        app.front_nine_score = document.getElementsByClassName('calc_nine')[0];
        app.back_nine_score = document.getElementsByClassName('calc_back')[0];
        app.total_score = document.getElementsByClassName('calc_total')[0];

        app.form.addEventListener("submit", function (e) {
            e.preventDefault();
            app.calculate_scores();
        });

        document.getElementById("reset_values").addEventListener("click", function (e) {
            app.trigger_reset(e);
        });

        document.getElementById("generate_data").addEventListener("click", function (e) {
            app.generate_data(e);
        });


    };

    app.init_controls = function () {

        app.createControl(app.top_controls, app.tControls);

        app.createControl(app.bottom_controls, app.bControls);

    };

    app.createControl = function (container, data) {
        var html = "";
        for (var i = 0; i < data.length; i++) {
            html += '<div class="col col-' + i + '">';
            html += data[i];
            html += '</div>';
        }
        container.innerHTML = html;
    };

    app.init_table = function () {
        var setRows = {};
        var setCols = {};

        for (var mc = 0; mc < app.tableRows.length; mc++) {
            setRows[mc] = app.table.insertRow(mc);
            if (mc == 0) { //holes
                setRows[mc].className = "green";
                for (var i = 0; i < app.holeData.length; i++) {
                    app.loopRows(setCols[i], setRows[mc], app.holeData, i);
                }
            }
            if (mc == 1) { // tees
                setRows[mc].className = "blue";
                for (var i = 0; i < app.tee.length; i++) {
                    app.loopRows(setCols[i], setRows[mc], app.tee, i);

                }
            }
            if (mc == 2) { // par
                setRows[mc].className = "grey";
                for (var i = 0; i < app.par.length; i++) {
                    app.loopRows(setCols[i], setRows[mc], app.par, i);
                }
            }
            if (mc == 3) { // inputs
                for (var i = 0; i < app.par.length; i++) {
                    app.loopInputs(setCols[i], setRows[mc], app.par, i);
                }
            }

        }
    };

    app.loopRows = function (col, row, data, count) {
        col = row.insertCell(count);
        if (typeof data[count] != "undefined") {
            col.innerHTML = data[count];
        }
    };

    app.loopInputs = function (col, row, data, count) {
        col = row.insertCell(count);

        switch (count) {
            case 0:
                col.innerHTML = 'Your Score:';
                break;
            case 10:
                col.innerHTML = '<input class="numb calc_nine" type="number" class="front-nine" disabled="disabled" />';
                break;
            case 20:
                col.innerHTML = '<input class="numb calc_back" type="number" class="back-nine" disabled="disabled" />';
                break;
            case 21:
                col.innerHTML = '<input class="numb calc_total" type="number" class="total" disabled="disabled" />';
                break;
            default:
                col.innerHTML = '<input class="numb" type="number" data-par="' + app.par[count] + '" data-hole="' + app.holeData[count] + '" min="0" />';
                break;
        }

    };

    app.generate_data = function (e) {
        e.preventDefault();

        var inputs = document.getElementsByClassName("numb");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].disabled == false) {
                inputs[i].value = Math.floor(Math.random() * 8) + 1;
            }
        }
    };

    app.trigger_reset = function (e) {
        e.preventDefault();

        if (confirm("Are you sure?")) {
            var inputs = document.getElementsByClassName("numb");
            for (var i = 0; i < inputs.length; i++) {
                if(app.hasClass(inputs[i], 'fixed')){
                    inputs[i].className = "numb";
                }
                inputs[i].value = "";
            }
        }
    };

    /*
     For Par 5, worst score is 8
     Par 3 and 4, worst score is 7
     */
    app.calculate_scores = function () {
        app.adjust_scores();
        app.calculate_score();
    };

    app.adjust_scores = function () {
        var inputs = document.getElementsByClassName("numb");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].disabled == false) {
                if(inputs[i].value == ''){
                    alert("Please fill in all scores.");
                    return;
                }

                if (inputs[i].dataset.par == 5 && inputs[i].value > 8) {
                    inputs[i].value = 8;
                    inputs[i].className += " fixed";
                }

                if (inputs[i].dataset.par == 4 && inputs[i].value > 7) {
                    inputs[i].value = 7;
                    inputs[i].className += " fixed";
                }

                if (inputs[i].dataset.par == 3 && inputs[i].value > 7) {
                    inputs[i].value = 7;
                    inputs[i].className += " fixed";
                }
            }
        }
    };

    app.calculate_score = function () {
        var inputs = document.getElementsByClassName("numb");

        var score = parseInt(0);
        for (var i = 0; i < inputs.length; i++) {
            if (i == 10) {
                app.front_nine_score.value = score;
                score = 0;
            }

            if (i == 19) {
                app.back_nine_score.value = score;
                score = 0;
            }

            if (i == 20) {
                app.total_score.value = parseInt(app.front_nine_score.value) + parseInt(app.back_nine_score.value);
            }

            if (inputs[i].disabled == false) {
                score += parseInt(inputs[i].value);
            }
        }


    };

    app.hasClass = function(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    };

    document.addEventListener("DOMContentLoaded", function () {
        app.init();
    });

    return app;

})(window, document);