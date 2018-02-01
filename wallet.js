var wallet = (function ($, digitals) {

    // Saving wallet into database
    function saveWallet() {
        if (typeof (Storage) === "undefined") {
            alert("Please update your browser to be able to use this application");
        } else {
            var wallet = sessionStorage.getItem('ws_wallet');
            var data = {
                wallet : JSON.parse(wallet),
                hash :  sum(JSON.parse(wallet))
            };
            var callbacks = {
                success: function (res) {
                    console.log(res);
                },
                error: function (err) {
                    console.log("wallet was not saved correctly");
                    alert(err);
                }
            };
            if (IsJsonString(wallet)) {
                digitals.query.pp('post', 'api/wallet', data, null, callbacks);
            }
        }
    }

    // Private
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

    // return wallet view
    function getWallet() {
        digitals.query.gd('get', 'api/wallet' + hash, {'X-AUTH-TOKEN': localStorage.getItem('ws_digital')}, callbacks);
        //syncWallet();

        return wallet;
    }


    // Private
    // couponObj : Json
    function manageWallet(type, retailer, couponObj) {
        switch(type) {
            case 'add':

                break;
            case 'delete':

                break;
        }
    }

    // Adding coupons to the wallet
    function addToWallet(retailerID, couponObj) {
        manageWallet('add', retailerID, couponObj);
    }

    // Removing coupons from the wallet
    function deleteFromWallet(retailerID, couponObj) {
        manageWallet('delete', retailerID, couponObj);
    }

    // Redeem coupons from the wallet
    function redeemCoupon(retailerID, couponID) {

        // Check the inventory
        digitals.query.gd('get', 'api/retailers/' + retailerID + '/coupons/' + couponID, {'X-AUTH-TOKEN': localStorage.getItem('ws_digital')}, callbacks);
    }

    // Public methods
    return {
        save: saveWallet,
        get: getWallet,
        add: addToWallet,
        del: deleteFromWallet
    };

})(jQuery, digitals);
