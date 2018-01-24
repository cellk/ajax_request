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
