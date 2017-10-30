function Random(apiKey)
{
    var SERVICE_URL = 'https://api.random.org/json-rpc/1/invoke';
    var min;
    var max;
    var n;       
    var errors = {};    
    var numbers;
        
    this.loadParams = function()
    {
        var form = $('form');        
        min = form.find('[name="Random[min]"]').val();
        min = min ? parseInt(min) : null;
        max = form.find('[name="Random[max]"]').val();
        max = max ? parseInt(max) : null;
        n   = form.find('[name="Random[n]"]').val();
        n   = n ? parseInt(n) : null;
    };
        
    this.isValid = function()
    {
        errors = {};
        if ( ! n || n < 0) {
            errors['n'] = 'N must be positive integer greater than 0';
        }
        if (max !== 0 && ! max) {
            errors['max'] = 'Please enter max value';
        }
        if (min !== 0 && ! min) {
            errors['min'] = 'Please enter min value';
        } else if ((max === 0 || max) && (min===0 || min) && min >= max) {
            errors['min'] = 'Min value must be less than max value';
            errors['max'] = 'Max value must be greater than min value';            
        }
        return  ! errors.length;
    };
    
    this.getError = function(attr)
    {
        if (errors[attr]) {
            return errors[attr];
        }
        return false;
    };
    
    /**
     * 
     * @return string
     */
    function sendRequest()
    {
        return new Promise((resolve, reject) => {
            var request = {
                "jsonrpc": "2.0",
                "method":"generateIntegers",
                "params": {
                    "apiKey": apiKey,
                    "n"     : n,
                    "min"   : min,
                    "max"   : max,
                    "replacement" : true
                },
                "id" : 1            
            };
            $.post(SERVICE_URL, JSON.stringify(request), function(response) {
                resolve(response);
            }, "json");                   
        });
    }
    
    function parseResult(response)
    {
        if ( ! response['result']['random']['data']) {
            throw 'Returned data is not in required format';
        }
        numbers = response['result']['random']['data'];
    }
    
    /**
     * @return array
     */
    this.getFrequencyData = function()
    {
        var ret = {labels:[], frequencies:[]};        
        var map = {};
        for (var i = 0; i < numbers.length; i++) {
            if (map.hasOwnProperty(numbers[i])) {
                map[numbers[i]]++;
            } else {
                map[numbers[i]] = 1;
                ret.labels.push(numbers[i]);
            }
        }
        for (var j = 0; j < ret.labels.length; j++) {
            var label = ret.labels[j];
            ret.frequencies.push(map[label]);
        }
        return ret;
    };
        
    this.load = function()
    {
        return new Promise((resolve, reject) => {
            sendRequest().then((response) => {
                parseResult(response);
                resolve();
            });            
        });
    };
}