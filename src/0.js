GT = {
    words: {
        doCare: [],
        dontCare: []
    }
};

GT.addAll = function(dontAsk){
    GT.doCare = [];
    GT.dontCare = [];

    var offers = document.getElementsByClassName('lt-offer');
    var i = 0;
    var currentOfferEl = Ext.get(offers[i]);

    var _addOffer = function(){
        currentOfferEl.dom.scrollIntoView();

        if(currentOfferEl.down('.lt-offer-not-added')){
            console.log('ADDING -', _currentOfferString());
            currentOfferEl.down('.lt-add-offer-gallery').dom.click();
        }else{
            console.log('ALREADY ADDED -', _currentOfferString());
        }

        setTimeout(_checkIfCare, GT.delay || 200);
    }

    var _checkIfCare = function(){
        var title = currentOfferEl.down('.lt-coupon-ccpd-title').dom.innerHTML.trim().toLowerCase();
        var description = currentOfferEl.down('.lt-description').dom.innerHTML.trim().toLowerCase();
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
            currentOfferEl = Ext.get(offers[i]);
            _addOffer();
        }else{
            _onExit();
        }
    }

    var _currentOfferString = function () {
        return [
            '.lt-expires-date', '.lt-coupon-ccpd-title', '.lt-description',
            '.lt-coupon-title', '.lt-coupon-title-price', '.lt-competitor-name', // Personalized specific
            '.lt-savings-value' // Coupon Center specific
        ].reduce(function(strings, selector){
            var subEl = currentOfferEl.down(selector);
            var text = subEl && subEl.dom.innerHTML.trim();
            return text ? strings.concat([text]) : strings;
        }, []).join(' -+- ');
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
