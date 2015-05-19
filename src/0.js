GT = {
    words: {
        doCare: [],
        dontCare: []
    }
};

GT.addAll = function(dontAsk){
    var SELECTORS = {
        COUPON_CENTER: {
            SAVINGS_VALUE: '.lt-savings-value'
        },
        DESCRIPTION: '.lt-description',
        EXPIRES_DATE: '.lt-expires-date',
        PERSONALIZED: {
            COMPETITOR_NAME: '.lt-competitor-name',
            COUPON_TITLE: '.lt-coupon-title',
            COUPON_TITLE_PRICE: '.lt-coupon-title-price'
        },
        TITLE: '.lt-coupon-ccpd-title'
    };

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
        if(_titleOrDescriptionMatch(GT.words.doCare)){
            console.log('Care');
            GT.doCare.push(_currentOfferString());
            _nextOffer();
        }else if(dontAsk || _titleOrDescriptionMatch(GT.words.dontCare)){
            console.log("Don't care");
            GT.dontCare.push(_currentOfferString());
            _nextOffer();
        }else{
            setTimeout(_checkIfCare, 1000);
        }
    }

    var _titleOrDescriptionMatch = function(wordsArray){
        return Ext.Array.some([SELECTORS.TITLE, SELECTORS.DESCRIPTION], function(selector) {
            var str = currentOfferEl.down(selector).dom.innerHTML.trim().toLowerCase();
            return Ext.Array.some(wordsArray, function(word){
                if(str.indexOf(word) !== -1) {
                    console.log(word);
                    return true;
                }
            });
        });
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
            SELECTORS.EXPIRES_DATE, SELECTORS.TITLE, SELECTORS.DESCRIPTION,
            SELECTORS.PERSONALIZED.COUPON_TITLE, SELECTORS.PERSONALIZED.COUPON_TITLE_PRICE, SELECTORS.PERSONALIZED.COMPETITOR_NAME,
            SELECTORS.COUPON_CENTER.SAVINGS_VALUE
        ].reduce(function(strings, selector){
            var subEl = currentOfferEl.down(selector);
            var text = subEl && subEl.dom.textContent.trim();
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
