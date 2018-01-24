var request = (function () {

    var apiUrl = "https://";

    /** Sending a Post or a put
     ** Params : 
     **     type (string) : POST, PUT
     **     endpoint (string)
     **     data (Json)
     **     customHeaders (obj)
     **     callbacks (Json) : { success : function(){}, progress : function(e){}, error : function(){}}
     **/
    function setRequest(type, endpoint, data, customHeaders, callbacks) {
        var url = apiUrl + '/' + endpoint;
        var json = JSON.stringify(data);

        request(url, type, customHeaders, callbacks, json);
    }

    /** Retrieving and deleting data
     ** Params : 
     **     type (string) : GET, DELETE
     **     endpoint (string)
     **     customHeaders (obj)
     **     callbacks (Json) : { success : function(){}, progress : function(e){}, error : function(){}}
     **/
    function getRequest(type, endpoint, customHeaders, callbacks) {
        var url = apiUrl + '/' + endpoint;

        request(url, type, customHeaders, callbacks);
    }

    /** Private : Ajax call
     ** Params : 
     **     url (string)
     **     typeRequest (string) : POST, GET, DELETE, PUT
     **     customHeaders (obj)
     **     callbacks (Json) : { success : function(){}, progress : function(e){}, error : function(){}}
     **/
    function request(url, typeRequest, customHeaders, callbacks, data) {
        var xhr = new XMLHttpRequest();

        xhr.open(typeRequest, url, true);

        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        // Set custom request headers if customHeaders parameter is provided
        if (customHeaders && typeof customHeaders === "object") {
            for (var headerKey in customHeaders) {
                xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
            }
        }

        // If a duringCallback function is set as a parameter, call that to notify about the upload progress
        if (callbacks.progress && callbacks.progress instanceof Function) {
            xhr.upload.onprogress = function (evt) {
                if (evt.lengthComputable) {
                    callbacks.progress((evt.loaded / evt.total) * 100);
                }
            };
        }

        if (typeof typeRequest !== 'undefined') {
            // Defaut will be a GET request
            switch (typeRequest.toLowerCase()) {
                case 'get':
                case 'delete':
                    xhr.send();
                    break;
                case 'put':
                case 'post':
                    xhr.send(data);
                    break;
                default:
                    console.log('No query');
            }
        } else {
            alert('No query');
            return;
        }

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    callbacks.success(JSON.parse(this.responseText));
                } else if (this.status >= 400) {
                    if (callbacks.error && callbacks.error instanceof Function) {
                        callbacks.error(this.responseText);
                    }
                }
            }
        };
    }

    // Private : decode jwt and return user's information
    function userInformation() {
        return 'user';
    }
    
    // Initiate the API and connexion
    function initApi(link){
        // Set Api url
        apiUrl = link;
    }

    // Get user's information
    function getUser() {
        userInformation();
    }

    // Public methods
    return {
        init: initApi,
        getUser: getUser,
        query: {
            pp: setRequest,
            gd: getRequest
        }
    };

})();

