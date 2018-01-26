var render = (function ($, digitals, wallet) {
    var params = {
        form: {
            id: "ws_login",
            css: "",
            groupCss: "form-group",
            inputCss: "form-control"
        },
        submit: {
            value: "Submit",
            css: "btn btn-primary"
        }
    };

    var tools = {
        geo: function geolocalise(callback) {
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var coord = {
                        lat: position.latitude,
                        lng: position.longitide,
                        accuracy: position.accuracy
                    };
                    callback(coord);
                }, function (err) {
                    var errors = {
                        1: 'Permission denied',
                        2: 'Position unavailable',
                        3: 'Request timeout'
                    };
                    callback(errors[err.code]);
                }, options);
            } else {
                callback(false);
            }
        },
        jwt: function (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
        },
        IsJsonString: function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
    }

    //private
    function setParams(params) {
        if (params !== undefined) {
            if (params.form !== undefined) {
                this.params.form = {
                    id: (params.form.id !== undefined) ? params.form.id : this.params.form.id,
                    css: (params.form.css !== undefined) ? params.form.css : this.params.form.css,
                    groupCss: (params.form.groupCss !== undefined) ? params.form.groupCss : this.params.form.groupCss,
                    inputCss: (params.form.inputCss !== undefined) ? params.form.inputCss : this.params.form.inputCss
                };
            }
            if (params.submit !== undefined) {
                this.params.submit = {
                    value: (params.submit.value !== undefined) ? params.submit.value : this.params.submit.value,
                    css: (params.submit.css !== undefined) ? params.submit.css : this.params.submit.css
                };
            }
        }
    }

    //private
    function getParams() {
        return this.params;
    }

    //private
    function makeUL(array) {
        // Create the list element:
        var list = document.createElement('ul');

        for (var i = 0; i < array.length; i++) {
            // Create the list item:
            var item = document.createElement('li');

            // Set its contents:
            item.appendChild(document.createTextNode(array[i]));
            item.className = "search-list";
            item.setAttribute("data-searchList", array[i].toLowerCase());

            // Add it to the list:
            list.appendChild(item);
        }

        // Finally, return the constructed list:
        return list;
    }

    //private
    function login() {
        var formID = params.form.id;
        $('#' + formID + ' input[required]:visible').each(function () {
            if ($(this).val() === "") {
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        })
        var data = $("form#" + formID).serializeArray()
        var callbacks = {
            success: function (res) {
                if (res.result !== "") {
                    console.log("session storage added : " + res.result);
                    localStorage.setItem('ws_digital', res.result);

                    //removing login form
                    $('#' + formID).fadeOut(500, function () {
                        $('#' + formID).remove();
                    });
                    renderRetailers();
                }
            },
            error: function (err) {
                console.log(err);
            }
        };
        digitals.query.pp('post', 'login', data, null, callbacks);
    }

    // Rendering retailer's coupons list view
    function renderCoupons(elCouponID, elSearchID, retailerID) {
        var callbacks = {
            success: function (res) {
                var coupon = res.result;
                console.log(coupon);
                document.getElementById(elCouponID).appendChild(makeUL(coupon));
            },
            error: function (err) {
                console.log(err);
            }
        };
        digitals.query.gd('get', 'api/retailers/' + retailerID + '/coupons', {'X-AUTH-TOKEN': localStorage.getItem('ws_digital')}, callbacks);
    }

    //private
    function generateSearchForm(elSearchID) {
        var classInput = "search";
        var input = document.createElement("input");
        input.type = "text";
        input.name = "find";
        input.className = classInput;
        input.setAttribute("placeholder", "Search");

        document.getElementById(elSearchID).appendChild(input);

        $('#' + elSearchID).keyup(function (e) {
            var word = $('.' + classInput).val();
            if (word.toLowerCase() == "") {
                $('li[data-searchList]').show();
            } else {
                var search = word.toLowerCase();
                console.log('searching ... ' + search)
                var ul = document.getElementById("list");
                var li = ul.getElementsByTagName('li');
                for (var i = 0; i < li.length; i++) {
                    if (li[i].innerHTML.toLowerCase().indexOf(search) > -1) {
                        li[i].style.display = "";
                    } else {
                        li[i].style.display = "none";
                    }
                }
            }
        });
    }


    // Rendering retailer list view
    function renderRetailers(elRetailerID, elSearchID) {
        var callbacks = {
            success: function (res) {
                var retailer = res.result;
                console.log(retailer);
                document.getElementById(elRetailerID).appendChild(makeUL(retailer));
            },
            error: function (err) {
                console.log(err);
            }
        };
        digitals.query.gd('get', 'api/retailers', {'X-AUTH-TOKEN': localStorage.getItem('ws_digital')}, callbacks);
    }

    // Rendering user view
    function renderUser(token) {
        // return data inside a jwt
        var user = tools.jwt(token);
        console.log(user)
    }

    // Saving user location
    function saveLocation() {

    }

    //private
    function syncWallet() {
        if (typeof (Storage) === "undefined") {
            alert("Please update your browser to be able to use this application");
        } else {
            var wallet = sessionStorage.getItem('ws_wallet');
            if (wallet === null) {
                // No wallet
                var callbacks = {
                    success: function (res) {
                        // set wallet in session storage
                        sessionStorage.setItem('ws_wallet', res.result);
                        console.log('Wallet has been synced');
                    },
                    error: function (err) {
                        console.log(err);
                    }
                };
                digitals.query.gd('get', 'api/wallet', {'X-AUTH-TOKEN': localStorage.getItem('ws_digital')}, callbacks);
            } else {
                // found wallet - compare with the server ans sync if different from the server
                var hash = sum(wallet);
                var callbacks = {
                    success: function (res) {
                        console.log(res)
                        if (res.result.hash === 'false') {
                            sessionStorage.setItem('ws_wallet', res.result.wallet);
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    }
                };
                digitals.query.gd('get', 'api/wallet' + hash, {'X-AUTH-TOKEN': localStorage.getItem('ws_digital')}, callbacks);
            }
        }
    }

    // Saving wallet into database
    function saveWallet() {
        if (typeof (Storage) === "undefined") {
            alert("Please update your browser to be able to use this application");
        } else {
            var wallet = sessionStorage.getItem('ws_wallet');
            var data = wallet;
            var callbacks = {
                success: function (res) {
                    console.log(res);
                },
                error: function (err) {
                    console.log("wallet was not saved correctly");
                    alert(err);
                }
            };
            if(tools.IsJsonString(wallet)) {
                digitals.query.pp('post', 'api/wallet', data, null, callbacks);
            }
        }
    }

    // Adding or removing coupons from user's wallet
    // type : add or remove
    // couponObj : Json
    function manageWallet(type, retailer, couponObj) {

    }

    // Rendering wallet view
    function renderWallet(elementID) {
        var wallet = {
            IGA: {
                id: 123,
                coupons: [
                    {
                        "name": "",
                        "id": 12345,
                        "image": "",
                        "expiration": ""
                    }
                ]
            }
        };
        syncWallet();

        return wallet;
    }

    // Initiate the application
    function init(element) {
        if (typeof (Storage) === "undefined") {
            alert("Please update your browser to be able to use this application");
        } else {
            var token = localStorage.getItem('ws_digital');
            if (token === null) {
                renderLoginForm(element);
            } else {
                renderRetailers();
                renderUser(token);
            }
        }
    }

    // rendering login form view
    function renderLoginForm(element, params) {
        setParams(params);
        var parameters = getParams();
        var callbacks = {
            success: function (res) {
                // Clear session storage
                console.log("session storage cleared!");
                localStorage.removeItem("ws_digital");

                var data = res.result;
                var dataLength = data.length;
                var f = document.createElement("form"); // Create a form
                f.setAttribute("id", parameters.form.id);
                f.className = parameters.form.css;
                f.method = "POST";
                for (var i = 0; i < dataLength; i++) {
                    var div = document.createElement("div");
                    div.className = parameters.form.groupCss;
                    //Label
                    if (data[i].label !== undefined && data[i].label !== "") {
                        var label = document.createElement("label");
                        var labelText = document.createTextNode(data[i].label);
                        label.setAttribute("for", data[i].label);
                        label.appendChild(labelText);
                        div.appendChild(label);
                    }

                    //Input
                    var input = document.createElement("input");
                    input.type = data[i].type;
                    input.name = data[i].name;
                    input.className = parameters.form.inputCss;
                    input.value = data[i].value;
                    if (data[i].required) {
                        input.setAttribute("required", "");
                    }
                    div.appendChild(input);
                    f.appendChild(div);
                }
                var submit = document.createElement("input");
                submit.type = 'button';
                submit.value = parameters.submit.value;
                submit.className = parameters.submit.css;
                submit.onclick = login;
                f.appendChild(submit);
                $(element).append(f);
            },
            error: function (err) {
                console.log(err)
            }
        };

        digitals.query.gd('get', 'login', null, callbacks);

    }

    // Public methods
    return {
        init: init,
        render: {
            wallet: renderWallet,
            retailers: renderRetailers,
            coupons: renderCoupons,
            user: renderUser,
            login: renderLoginForm,
            search: generateSearchForm
        },
        save: {
            wallet: saveWallet,
            geo: saveLocation,
        }
    };

})(jQuery, digitals, wallet);
