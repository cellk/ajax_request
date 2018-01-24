# ajax_request
Javascript ajax request

        var callbacks = {
            success: function (res) {
                var retailer = res.result;
                var dataLength = retailer.length;
                for (var i = 0; i < dataLength; i++) {
                    console.log(retailer[i]);
                }
            },
            progress : function(e){
            console.log(e)
            },
            error: function (err) {
                console.log(err);
            }
        };
        request.query.gd('get', 'api_endpoint', {'X-AUTH-TOKEN': custom_headers}, callbacks);
