# ajax_request
Javascript ajax request

        var callbacks = {
            success: function (res) {
                console.log(res)
            },
            progress : function(e){
                console.log(e)
            },
            error: function (err) {
                console.log(err);
            }
        };
        
        request.query.gd('get', 'api_endpoint', {'X-AUTH-TOKEN': custom_headers}, callbacks);

# sum
var wallet2 = [
            {
                retailer : {
                    name : "IGA",
                    id : 123
                },
                coupons : [
                    {
                        "name" : "",
                        "id" : 12345,
                        "image" : "",
                        "expiration" : ""
                    }
                ]
            }
        ];

sum(wallet2)
