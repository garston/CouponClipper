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
        var currentOfferString = _toString(_currentOffer());
        if(_currentOffer().getAttribute('class').indexOf('lt-clipped') === -1){
            console.log('ADDING -', currentOfferString);
            Ext.fly(_currentOffer()).down('.lt-add-offer-link').dom.click();
        }else{
            console.log('ALREADY ADDED -', currentOfferString);
        }

        setTimeout(_checkIfCare, GT.delay || 200);
    }

    var _checkIfCare = function(){
        var title = Ext.get(_currentOffer()).down('.lt-details-link').dom.innerHTML.trim().toLowerCase();
        var description = Ext.get(_currentOffer()).down('.lt-description').dom.innerHTML.trim().toLowerCase();
        if(_containsStringContainedIn(GT.words.doCare, title) || _containsStringContainedIn(GT.words.doCare, description)){
            console.log('Care');
            GT.doCare.push(_toString(_currentOffer()));
            _nextOffer();
        }else if(dontAsk || _containsStringContainedIn(GT.words.dontCare, title) || _containsStringContainedIn(GT.words.dontCare, description)){
            console.log("Don't care");
            GT.dontCare.push(_toString(_currentOffer()));
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

    var _currentOffer = function(){
        return offers[i];
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

    var _toString = function(offer){
        var str = '';
        Ext.Array.each([
            '.lt-expiration', '.lt-frequency', '.lt-details-link', '.lt-description',
            '.lt-coupon-value', '.lt-competitor-title', '.lt-competitor-value', // Personalized specific
            '.lt-savings-value' // Coupon Center specific
        ], function(selector, index, selectors){
            var node = Ext.fly(offer) && Ext.fly(offer).down(selector);
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
    })
    console.log(str.trim());
};
