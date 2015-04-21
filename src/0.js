GT = {
    words: {
        doCare: [],
        dontCare: []
    }
};

GT.addAll = function(dontAsk){
    GT.doCare = [];
    GT.dontCare = [];

    var i = 0;
    var offers = document.getElementsByClassName('lt-offer');

    var _addOffer = function(){
        var currentOffer = Ext.get(offers[i]);
        currentOffer.dom.scrollIntoView();

        if(currentOffer.down('.lt-offer-not-added')){
            console.log('ADDING -', _currentOfferString());
            currentOffer.down('.lt-add-offer-gallery').dom.click();
        }else{
            console.log('ALREADY ADDED -', _currentOfferString());
        }

        setTimeout(_checkIfCare, GT.delay || 200);
    }

    var _checkIfCare = function(){
        var currentOffer = Ext.get(offers[i]);
        var title = currentOffer.down('.lt-coupon-ccpd-title').dom.innerHTML.trim().toLowerCase();
        var description = currentOffer.down('.lt-description').dom.innerHTML.trim().toLowerCase();
        if(_containsStringContainedIn(GT.words.doCare, title) || _containsStringContainedIn(GT.words.doCare, description)){
            console.log('Care');
            GT.doCare.push(_currentOfferString());
            _nextOffer();
        }else if(dontAsk || _containsStringContainedIn(GT.words.dontCare, title) || _containsStringContainedIn(GT.words.dontCare, description)){
            console.log("Don't care");
            GT.dontCare.push(_currentOfferString());
            _nextOffer();
        }else{
            setTimeout(_checkIfCare, 1000);
        }
    }

    var _containsStringContainedIn = function(a, str){
        for(var i = 0; i < a.length; i++){
            if(str.indexOf(a[i]) !== -1){
                console.log(a[i]);
                return true;
            }
        }
        return false;
    }

    var _nextOffer = function(){
        if(GT.stop){
            delete GT.stop;
            _onExit();
            return;
        }

        i++;

        if(i < offers.length){
            _addOffer();
        }else{
            _onExit();
        }
    }

    var _currentOfferString = function () {
        var str = '';
        Ext.Array.each([
            '.lt-expires-date', '.lt-coupon-ccpd-title', '.lt-description',
            '.lt-coupon-title', '.lt-coupon-title-price', '.lt-competitor-name', // Personalized specific
            '.lt-savings-value' // Coupon Center specific
        ], function(selector, index, selectors){
            var node = Ext.fly(offers[i]) && Ext.fly(offers[i]).down(selector);
            if(node){
                str += node.dom.innerHTML.trim() + (index === selectors.length - 1 ? '' : ' -+- ');
            }
        });

        return str;
    }

    var _onExit = function(){
        console.log('exiting');
        GT.printArray(GT.doCare, true);
    }

    _addOffer();
};

GT.printArray = function(a, oneLinePerItem){
    var str = '';
    Ext.Array.each(a.sort(), function(item){
        str += '"' + item + '", ' + (oneLinePerItem ? '\n' : '');
    });
    console.log(str.trim());
};
