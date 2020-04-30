
var voltage_visibility = document.querySelector('#voltage_visibility');
voltage_visibility.addEventListener("click",function(){
    if (voltage_visibility.checked == true) {
        d3.select("#voltage_path").attr("opacity","100")
        d3.select("#y_axis_voltage").attr("opacity","100")
    } else {
        d3.select("#voltage_path").attr("opacity","0")
        d3.select("#y_axis_voltage").attr("opacity","0")
    }
})

var current_visibility = document.querySelector('#current_visibility');
current_visibility.addEventListener("click",function(){
    if (current_visibility.checked == true) {
        d3.select("#current_path").attr("opacity","100")
        d3.select("#y_axis_current").attr("opacity","100")
    } else {
        d3.select("#current_path").attr("opacity","0")
        d3.select("#y_axis_current").attr("opacity","0")
    }
})

var power_visibility = document.querySelector('#power_visibility');
power_visibility.addEventListener("click",function(){
    if (power_visibility.checked == true) {
        d3.select("#power_path").attr("opacity","100")
        d3.select("#y_axis_power").attr("opacity","100")
    } else {
        d3.select("#power_path").attr("opacity","0")
        d3.select("#y_axis_power").attr("opacity","0")
    }
})

var time_visibility = document.querySelector('#time_visibility');
time_visibility.addEventListener("click",function(){
    if (time_visibility.checked == true) {
        d3.select("#x_axis").attr("opacity","100")
    } else {
        d3.select("#x_axis").attr("opacity","0")
    }
})

