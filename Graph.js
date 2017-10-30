function Graph(containerId, rand)
{  
    var chart = null;
    
    function getColors(frequency, alpha)
    {
        var max = frequency.reduce(function(acc, current) {
            return Math.max(acc, current);
        });
        var ret = [];        
        for (var i = 0; i < frequency.length; i++) {
            var val = frequency[i];
            var r = parseInt(255.0 * val/max);
            var g = 0;
            var b = 255 - r;
            ret.push('rgba('+r+', '+g+', '+b+','+alpha+')');
        }
        return ret;
    }
    
    this.show = function()
    {
        rand.load().then(()=> {
            var data = rand.getFrequencyData();
            var backgroundColors = getColors(data.frequencies, 0.2);
            var borderColors     = getColors(data.frequencies, 1);
            var canvas = document.getElementById(containerId);
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0,0, canvas.width, canvas.height);
            var data = {
                type: 'bar',
                labels: data.labels,
                datasets: [
                {
                    label: "Frequency",
                    data: data.frequencies,                
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            };
            var options = {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            };    
            if (chart) {
                chart.destroy();
            }
            chart = new Chart(ctx, { type:'bar', data:data, options:options});             
        });
    };
}

